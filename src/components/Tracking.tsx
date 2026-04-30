import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { SiteSettings } from '../types';

const injectScripts = (html: string, target: 'head' | 'body', markerId: string) => {
  // Remove previously injected custom scripts to prevent duplicates
  document.querySelectorAll(`[data-custom-script="${markerId}"]`).forEach(el => el.remove());
  
  if (!html) return;
  const template = document.createElement('div');
  template.innerHTML = html.trim();
  const targetElement = target === 'head' ? document.head : document.body;

  Array.from(template.childNodes).forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      // We must handle <script> manually because innerHTML does not execute scripts.
      if (el.tagName === 'SCRIPT') {
        const script = document.createElement('script');
        Array.from(el.attributes).forEach(attr => {
          script.setAttribute(attr.name, attr.value);
        });
        script.text = el.innerHTML;
        script.setAttribute('data-custom-script', markerId);
        targetElement.appendChild(script);
      } else {
        const clone = el.cloneNode(true) as Element;
        clone.setAttribute('data-custom-script', markerId);
        
        // Use prepend for body scripts like GTM noscript
        if (target === 'body') {
          targetElement.prepend(clone);
        } else {
          targetElement.appendChild(clone);
        }
      }
    }
  });
};

export default function Tracking() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'general'), 
      (docSnap) => {
        if (docSnap.exists()) {
          setSettings(docSnap.data() as SiteSettings);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'settings/general');
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!settings) return;

    const headHtml = settings.headScripts !== undefined ? settings.headScripts : 
      [
        settings.googleSiteVerification ? `<meta name="google-site-verification" content="${settings.googleSiteVerification}" />` : '',
        settings.googleAnalyticsId ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}"></script><script>window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${settings.googleAnalyticsId}');</script>` : ''
      ].filter(Boolean).join('\n');
      
    const bodyHtml = settings.bodyScripts !== undefined ? settings.bodyScripts : 
      settings.googleTagManagerId ? `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${settings.googleTagManagerId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>` : '';

    injectScripts(headHtml, 'head', 'tracking-head');
    injectScripts(bodyHtml, 'body', 'tracking-body');

  }, [settings]);

  return null;
}

