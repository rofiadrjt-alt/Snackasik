import { useState, useEffect } from 'react';
import { Instagram, MapPin, Facebook, ShoppingBag, PhoneCall, Youtube, Music2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SiteSettings } from '../types';
import { defaultSettings } from '../constants';

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'general'));
        if (snap.exists()) {
          setSettings(snap.data() as SiteSettings);
        }
      } catch (error) {
        // Fall back to default settings gracefully
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-primary-brown text-white py-20 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-yellow/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        <div className="space-y-6 md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="bg-primary-yellow p-2 rounded-xl shadow-inner">
              <ShoppingBag className="w-7 h-7 text-primary-brown" />
            </div>
            <span className="font-display text-3xl font-black tracking-tighter">
              Snack <span className="text-primary-yellow text-opacity-90">Asik</span>
            </span>
          </div>
          <p className="text-white/80 max-w-sm leading-relaxed font-medium">
            Ngemil Boleh, Pilih yang Berkualitas! Dibuat dengan cinta dan bahan pilihan untuk menemani setiap momen asikmu. Pesen sekarang sebelum kehabisan!
          </p>
        </div>

        <div className="space-y-6">
          <h4 className="text-xl font-bold text-primary-yellow">Kontak & Lokasi</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-white/80 hover:text-white transition-colors cursor-pointer">
              <MapPin className="w-5 h-5 text-primary-yellow shrink-0 mt-0.5" />
              <span className="leading-snug">{settings.location || 'Jl. Kubang Welingi, Indonesia'}</span>
            </li>
            <li className="flex items-center gap-3 text-white/80 hover:text-white transition-colors cursor-pointer">
              <PhoneCall className="w-5 h-5 text-primary-yellow shrink-0" />
              <span>{settings.whatsappNumber || '0896-5207-4866'}</span>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-xl font-bold text-primary-yellow">Menu Pintar</h4>
          <ul className="space-y-3 font-medium">
            <li><a href="/" className="text-white/70 hover:text-primary-yellow transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary-yellow"></span> Home</a></li>
            <li><Link to="/artikel" className="text-white/70 hover:text-primary-yellow transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary-yellow"></span> Artikel & Tips</Link></li>
            <li><a href="/#produk" className="text-white/70 hover:text-primary-yellow transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary-yellow"></span> Menu Cemilan</a></li>
            <li><a href="/#tentang" className="text-white/70 hover:text-primary-yellow transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary-yellow"></span> Rahasia Dapur</a></li>
            <li><Link to="/admin" className="text-white/70 hover:text-primary-yellow transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-white/20"></span> Admin Area</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-white/10 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10">
        <p className="text-white/40 text-sm font-medium">&copy; {new Date().getFullYear()} Snack Asik. Dibuat buat yang suka ngemil.</p>
        <div className="flex gap-4">
          {settings.instagramLink && (
            <a href={settings.instagramLink} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="bg-white/5 p-3 rounded-xl hover:bg-primary-yellow hover:text-primary-brown transition-all hover:-translate-y-1">
              <Instagram size={20} />
            </a>
          )}
          {settings.facebookLink && (
            <a href={settings.facebookLink} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="bg-white/5 p-3 rounded-xl hover:bg-primary-yellow hover:text-primary-brown transition-all hover:-translate-y-1">
              <Facebook size={20} />
            </a>
          )}
          {settings.tiktokLink && (
            <a href={settings.tiktokLink} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="bg-white/5 p-3 rounded-xl hover:bg-primary-yellow hover:text-primary-brown transition-all hover:-translate-y-1">
              <Music2 size={20} />
            </a>
          )}
          {settings.youtubeLink && (
            <a href={settings.youtubeLink} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="bg-white/5 p-3 rounded-xl hover:bg-primary-yellow hover:text-primary-brown transition-all hover:-translate-y-1">
              <Youtube size={20} />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
