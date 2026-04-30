import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import { Helmet } from 'react-helmet-async';
import { db } from '../lib/firebase';
import { SiteSettings, Product, Testimonial, FAQ, Article } from '../types';
import { defaultSettings, defaultProducts, defaultTestimonials, defaultFAQs } from '../constants';
import { initialArticles } from '../data/articles';

import Hero from '../components/Hero';
import Features from '../components/Features';
import ProductList from '../components/ProductList';
import Education from '../components/Education';
import LatestArticles from '../components/LatestArticles';
import Testimonials from '../components/Testimonials';
import FAQSection from '../components/FAQ';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [faqs, setFaqs] = useState<FAQ[]>(defaultFAQs);
  const [articles, setArticles] = useState<Article[]>(initialArticles.slice(0, 3));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Settings
        const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
        if (settingsDoc.exists()) {
          setSettings({ ...defaultSettings, ...settingsDoc.data() } as SiteSettings);
        }
      } catch (error) {
        console.warn("Using offline default settings");
      }

      try {
        // Fetch Products
        const productsQuery = query(collection(db, 'products'));
        const productsSnap = await getDocs(productsQuery);
        const productsList = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        if (productsList.length > 0) {
          productsList.sort((a, b) => (a.order || 0) - (b.order || 0));
          setProducts(productsList);
        } else {
          setProducts(defaultProducts);
        }
      } catch (error) {
        console.warn("Using default products due to fetch error/quota:", error);
        setProducts(defaultProducts);
      }

      try {
        // Fetch Testimonials
        const testimonialsQuery = query(collection(db, 'testimonials'));
        const testimonialsSnap = await getDocs(testimonialsQuery);
        const testimonialsList = testimonialsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
        if (testimonialsList.length > 0) {
          testimonialsList.sort((a, b) => (a.order || 0) - (b.order || 0));
          setTestimonials(testimonialsList);
        } else {
          setTestimonials(defaultTestimonials);
        }
      } catch (error) {
        console.warn("Using default testimonials due to fetch error/quota:", error);
        setTestimonials(defaultTestimonials);
      }

      try {
        // Fetch FAQs
        const faqsQuery = query(collection(db, 'faqs'));
        const faqsSnap = await getDocs(faqsQuery);
        const faqsList = faqsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as FAQ));
        if (faqsList.length > 0) {
          faqsList.sort((a, b) => (a.order || 0) - (b.order || 0));
          setFaqs(faqsList);
        } else {
          setFaqs(defaultFAQs);
        }
      } catch (error) {
        console.warn("Using default FAQs due to fetch error/quota:", error);
        setFaqs(defaultFAQs);
      }

      try {
        // Fetch Articles
        const articlesQuery = query(collection(db, 'articles'), where('published', '==', true));
        const articlesSnap = await getDocs(articlesQuery);
        const articlesList = articlesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
        if (articlesList.length > 0) {
          articlesList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setArticles(articlesList.slice(0, 3));
        } else {
          setArticles(initialArticles.slice(0, 3));
        }
      } catch (error) {
        console.warn("Using local articles due to fetch error/quota:", error);
        setArticles(initialArticles.slice(0, 3));
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-cream flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-primary-yellow animate-spin mb-4" />
        <p className="text-primary-brown font-bold text-xl">Menyiapkan Cemilan Asik...</p>
      </div>
    );
  }

  // Determine a concise title based on settings (or default)
  const pageTitle = "Snack Asik - Keripik Bawang Paling Kriuk";
  const desc = settings.description || "Keripik Bawang Snack Asik terbuat dari bahan premium, renyah, dan gurih.";

  return (
    <div className="overflow-x-hidden">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={desc} />
        {settings.faviconUrl && <link rel="icon" href={settings.faviconUrl} />}
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={desc} />
        {settings.heroImage && <meta property="og:image" content={settings.heroImage} />}
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={desc} />
        {settings.heroImage && <meta property="twitter:image" content={settings.heroImage} />}
      </Helmet>

      <Hero 
        headline={settings.headline}
        description={settings.description}
        image={settings.heroImage}
      />
      <Features 
        headline={settings.featuresHeadline}
        description={settings.featuresDescription}
      />
      <ProductList 
        products={products} 
        whatsappNumber={settings.whatsappNumber}
      />
      <Education 
        image={settings.processImage} 
        headline={settings.processHeadline}
        description={settings.processDescription}
        badge={settings.processBadge}
      />
      <LatestArticles articles={articles} />
      <Testimonials testimonials={testimonials} />
      <FAQSection faqs={faqs} />
    </div>
  );
}
