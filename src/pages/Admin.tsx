import { useState, useEffect, FormEvent } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut, 
  User 
} from 'firebase/auth';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  orderBy,
  updateDoc
} from 'firebase/firestore';
import { Helmet } from 'react-helmet-async';
import ImageInput from '../components/ImageInput';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { SiteSettings, Product, Testimonial, FAQ, Article } from '../types';
import { defaultSettings, defaultProducts, defaultTestimonials, defaultFAQs } from '../constants';
import { initialArticles } from '../data/articles';
import { 
  LayoutDashboard, 
  Settings as SettingsIcon, 
  ShoppingBasket, 
  MessageSquare, 
  HelpCircle, 
  LogOut, 
  Plus, 
  Trash2, 
  Save, 
  Loader2,
  Trash,
  FileText
} from 'lucide-react';

const ADMIN_EMAIL = 'rofiadrjt@gmail.com';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'settings' | 'products' | 'testimonials' | 'faqs' | 'articles'>('settings');
  
  // Data States
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [products, setProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u && u.email === ADMIN_EMAIL) {
        fetchAdminData();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Settings
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
        if (settingsDoc.exists()) {
          setSettings(settingsDoc.data() as SiteSettings);
        } else {
          await setDoc(doc(db, 'settings', 'general'), defaultSettings);
          setSettings(defaultSettings);
        }
      } catch (e) {
        console.warn("Fallback to default settings");
        setSettings(defaultSettings);
      }

      // Products
      try {
        const pSnap = await getDocs(query(collection(db, 'products')));
        if (pSnap.empty) {
          const promises = defaultProducts.map(p => {
            const { id, ...data } = p;
            return addDoc(collection(db, 'products'), data);
          });
          await Promise.all(promises);
          const newSnap = await getDocs(query(collection(db, 'products')));
          const items = newSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
          items.sort((a, b) => (a.order || 0) - (b.order || 0));
          setProducts(items);
        } else {
          const items = pSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
          items.sort((a, b) => (a.order || 0) - (b.order || 0));
          setProducts(items);
        }
      } catch (e) {
        console.warn("Fallback to default products");
        setProducts(defaultProducts);
      }

      // Testimonials
      try {
        const tSnap = await getDocs(query(collection(db, 'testimonials')));
        if (tSnap.empty) {
          const promises = defaultTestimonials.map(t => {
            const { id, ...data } = t;
            return addDoc(collection(db, 'testimonials'), data);
          });
          await Promise.all(promises);
          const newSnap = await getDocs(query(collection(db, 'testimonials')));
          const items = newSnap.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial));
          items.sort((a, b) => (a.order || 0) - (b.order || 0));
          setTestimonials(items);
        } else {
          const items = tSnap.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial));
          items.sort((a, b) => (a.order || 0) - (b.order || 0));
          setTestimonials(items);
        }
      } catch (e) {
        console.warn("Fallback to default testimonials");
        setTestimonials(defaultTestimonials);
      }

      // FAQ
      try {
        const fSnap = await getDocs(query(collection(db, 'faqs')));
        if (fSnap.empty) {
          const promises = defaultFAQs.map(f => {
            const { id, ...data } = f;
            return addDoc(collection(db, 'faqs'), data);
          });
          await Promise.all(promises);
          const newSnap = await getDocs(query(collection(db, 'faqs')));
          const items = newSnap.docs.map(d => ({ id: d.id, ...d.data() } as FAQ));
          items.sort((a, b) => (a.order || 0) - (b.order || 0));
          setFaqs(items);
        } else {
          const items = fSnap.docs.map(d => ({ id: d.id, ...d.data() } as FAQ));
          items.sort((a, b) => (a.order || 0) - (b.order || 0));
          setFaqs(items);
        }
      } catch (e) {
        console.warn("Fallback to default FAQs");
        setFaqs(defaultFAQs);
      }

      // Articles
      try {
        const aSnap = await getDocs(query(collection(db, 'articles')));
        if (aSnap.empty) {
          const promises = initialArticles.map(article => {
            const { id, ...data } = article;
            return addDoc(collection(db, 'articles'), data);
          });
          await Promise.all(promises);
          const newSnap = await getDocs(query(collection(db, 'articles')));
          const items = newSnap.docs.map(d => ({ id: d.id, ...d.data() } as Article));
          items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setArticles(items);
        } else {
          const items = aSnap.docs.map(d => ({ id: d.id, ...d.data() } as Article));
          items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setArticles(items);
        }
      } catch (e) {
        console.warn("Fallback to default articles");
        setArticles(initialArticles);
      }
    } catch (e) {
      console.error("Admin data main fetch error:", e);
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => signOut(auth);

  const saveSettings = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const path = 'settings/general';
    try {
      await setDoc(doc(db, 'settings', 'general'), settings);
      alert('Settings saved!');
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    } finally {
      setIsSaving(false);
    }
  };

  const addProduct = async () => {
    const newProd = {
      name: 'Produk Baru',
      price: 'Rp 0',
      description: 'Deskripsi produk baru',
      weight: '50g',
      imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bb087?auto=format&fit=crop&q=80&w=400',
      order: products.length + 1
    };
    const path = 'products';
    try {
      const docRef = await addDoc(collection(db, path), newProd);
      setProducts([...products, { ...newProd, id: docRef.id }]);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  };

  const addTestimonial = async () => {
    const newItem = {
      name: 'Nama Baru',
      text: 'Review baru',
      role: 'Pelanggan Baru',
      order: testimonials.length + 1
    };
    const path = 'testimonials';
    try {
      const docRef = await addDoc(collection(db, path), newItem);
      setTestimonials([...testimonials, { ...newItem, id: docRef.id }]);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  };

  const addFaq = async () => {
    const newItem = {
      question: 'Pertanyaan Baru?',
      answer: 'Jawaban',
      order: faqs.length + 1
    };
    const path = 'faqs';
    try {
      const docRef = await addDoc(collection(db, path), newItem);
      setFaqs([...faqs, { ...newItem, id: docRef.id }]);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  };

  const addArticle = async () => {
    const newItem = {
      title: 'Judul Artikel Baru',
      slug: 'judul-artikel-baru-' + Date.now(),
      content: 'Tulis isi artikel di sini...',
      imageUrl: 'https://images.unsplash.com/photo-1613919113166-704944fd6ab9?auto=format&fit=crop&q=80&w=800',
      published: false,
      createdAt: Date.now()
    };
    const path = 'articles';
    try {
      const docRef = await addDoc(collection(db, path), newItem);
      setArticles([{ ...newItem, id: docRef.id }, ...articles]);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, path);
    }
  };

  const deleteItem = async (col: string, id: string) => {
    if (!confirm('Yakin ingin menghapus?')) return;
    try {
      await deleteDoc(doc(db, col, id));
      if (col === 'products') setProducts(products.filter(p => p.id !== id));
      if (col === 'testimonials') setTestimonials(testimonials.filter(p => p.id !== id));
      if (col === 'faqs') setFaqs(faqs.filter(p => p.id !== id));
      if (col === 'articles') setArticles(articles.filter(p => p.id !== id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, col);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-bg-cream"><Loader2 className="animate-spin text-primary-brown" /></div>;

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-cream px-4">
        <Helmet>
          <title>Admin Login - Snack Asik</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="bg-white p-10 rounded-[40px] shadow-2xl max-w-md w-full text-center space-y-8">
          <div className="bg-primary-yellow w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
            <LayoutDashboard size={40} className="text-primary-brown" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-extrabold text-primary-brown">Admin Dashboard</h1>
            <p className="text-primary-brown/60 mt-2">Silakan login dengan akun yang terdaftar untuk mengelola website.</p>
          </div>
          <button 
            onClick={handleLogin}
            className="w-full bg-primary-brown text-white font-bold py-4 rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-3"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5 invert" alt="Google" referrerPolicy="no-referrer" />
            Login dengan Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-cream flex">
      <Helmet>
        <title>Admin Dashboard - Snack Asik</title>
        <meta name="robots" content="noindex, nofollow" />
        {settings.faviconUrl && <link rel="icon" href={settings.faviconUrl} />}
      </Helmet>
      {/* Sidebar */}
      <aside className="w-20 md:w-64 bg-primary-brown text-white p-4 flex flex-col items-center md:items-start gap-8">
        <div className="flex items-center gap-3 md:px-4 py-8">
          <div className="bg-primary-yellow p-2 rounded-xl">
            <LayoutDashboard size={24} className="text-primary-brown" />
          </div>
          <span className="hidden md:block font-display font-bold text-xl">Dashboard</span>
        </div>

        <nav className="flex-grow w-full space-y-2">
          {[
            { id: 'settings', icon: SettingsIcon, label: 'Settings' },
            { id: 'products', icon: ShoppingBasket, label: 'Products' },
            { id: 'testimonials', icon: MessageSquare, label: 'Testimonials' },
            { id: 'faqs', icon: HelpCircle, label: 'FAQ' },
            { id: 'articles', icon: FileText, label: 'Articles' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id ? 'bg-white/10 text-primary-yellow' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon size={20} />
              <span className="hidden md:block font-bold">{tab.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all mt-auto"
        >
          <LogOut size={20} />
          <span className="hidden md:block font-bold">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 md:p-12 overflow-y-auto max-h-screen">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-display font-extrabold text-primary-brown uppercase tracking-tight">
              {activeTab} Management
            </h2>
            <p className="text-primary-brown/40">Kelola konten website Anda dengan mudah.</p>
          </div>
          {activeTab !== 'settings' && (
            <button 
              onClick={() => {
                if (activeTab === 'products') addProduct();
                else if (activeTab === 'testimonials') addTestimonial();
                else if (activeTab === 'faqs') addFaq();
                else if (activeTab === 'articles') addArticle();
              }}
              className="bg-primary-brown text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all"
            >
              <Plus size={20} /> Tambah Item
            </button>
          )}
        </header>

        <div className="bg-white rounded-[40px] shadow-sm p-8 md:p-10 border border-gray-100">
          {activeTab === 'settings' && (
            <form onSubmit={saveSettings} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">Headline</label>
                  <input 
                    className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 ring-primary-yellow outline-none transition-all"
                    value={settings.headline}
                    onChange={e => setSettings({...settings, headline: e.target.value})}
                  />
                </div>
                <ImageInput 
                  label="Hero Image URl"
                  value={settings.heroImage}
                  onChange={val => setSettings({...settings, heroImage: val})}
                />
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">Description</label>
                  <textarea 
                    rows={3}
                    className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 ring-primary-yellow outline-none transition-all"
                    value={settings.description}
                    onChange={e => setSettings({...settings, description: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">WhatsApp Number</label>
                  <input 
                    className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 ring-primary-yellow outline-none transition-all"
                    value={settings.whatsappNumber}
                    onChange={e => setSettings({...settings, whatsappNumber: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">Shopee Link</label>
                  <input 
                    className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 ring-primary-yellow outline-none transition-all"
                    value={settings.shopeeLink || ''}
                    onChange={e => setSettings({...settings, shopeeLink: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">Tokopedia Link</label>
                  <input 
                    className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 ring-primary-yellow outline-none transition-all"
                    value={settings.tokopediaLink || ''}
                    onChange={e => setSettings({...settings, tokopediaLink: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">Location</label>
                  <input 
                    className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 ring-primary-yellow outline-none transition-all"
                    value={settings.location || ''}
                    onChange={e => setSettings({...settings, location: e.target.value})}
                  />
                </div>
                <ImageInput 
                  label="Favicon URL"
                  value={settings.faviconUrl || ''}
                  onChange={val => setSettings({...settings, faviconUrl: val})}
                />
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">Instagram Link</label>
                  <input 
                    className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 ring-primary-yellow outline-none transition-all"
                    value={settings.instagramLink || ''}
                    onChange={e => setSettings({...settings, instagramLink: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">TikTok Link</label>
                  <input 
                    className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 ring-primary-yellow outline-none transition-all"
                    value={settings.tiktokLink || ''}
                    onChange={e => setSettings({...settings, tiktokLink: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">Facebook Link</label>
                  <input 
                    className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 ring-primary-yellow outline-none transition-all"
                    value={settings.facebookLink || ''}
                    onChange={e => setSettings({...settings, facebookLink: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">YouTube Link</label>
                  <input 
                    className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 ring-primary-yellow outline-none transition-all"
                    value={settings.youtubeLink || ''}
                    onChange={e => setSettings({...settings, youtubeLink: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="md:col-span-2">
                  <h3 className="text-xl font-bold border-b pb-2">Konten "Rahasia Dapur"</h3>
                </div>
                <ImageInput 
                  label="Gambar Proses Pembuatan"
                  value={settings.processImage || ''}
                  onChange={val => setSettings({...settings, processImage: val})}
                />
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">Badge Konten</label>
                  <input 
                    className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 ring-primary-yellow outline-none transition-all"
                    value={settings.processBadge || ''}
                    onChange={e => setSettings({...settings, processBadge: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">Headline</label>
                  <input 
                    className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 ring-primary-yellow outline-none transition-all"
                    value={settings.processHeadline || ''}
                    onChange={e => setSettings({...settings, processHeadline: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">Description</label>
                  <textarea 
                    rows={3}
                    className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 ring-primary-yellow outline-none transition-all"
                    value={settings.processDescription || ''}
                    onChange={e => setSettings({...settings, processDescription: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="md:col-span-2">
                  <h3 className="text-xl font-bold border-b pb-2">Konten "Fitur"</h3>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">Headline Utama</label>
                  <input 
                    className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 ring-primary-yellow outline-none transition-all"
                    value={settings.featuresHeadline || ''}
                    onChange={e => setSettings({...settings, featuresHeadline: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">Deskripsi Utama</label>
                  <textarea 
                    rows={3}
                    className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 ring-primary-yellow outline-none transition-all"
                    value={settings.featuresDescription || ''}
                    onChange={e => setSettings({...settings, featuresDescription: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="md:col-span-2">
                  <h3 className="text-xl font-bold border-b pb-2">SEO & Tracking Scripts</h3>
                  <p className="text-sm text-gray-500 mt-2">Paste seluruh kodingan script dari Google Search Console, Analytics, Meta Pixel, dll (tanpa terkecuali) di bawah ini.</p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">Scripts Untuk Di Dalam &lt;head&gt;</label>
                  <p className="text-xs text-gray-500 mb-2">Paste tag &lt;meta ...&gt; Google Site Verification, dan tag &lt;script&gt; Google Analytics / Tag Manager di sini.</p>
                  <textarea 
                    className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 font-mono text-sm ring-primary-yellow outline-none transition-all"
                    rows={6}
                    value={settings.headScripts !== undefined ? settings.headScripts : (settings.googleSiteVerification || '')}
                    onChange={e => setSettings({...settings, headScripts: e.target.value})}
                    placeholder={'<meta name="google-site-verification" content="..." />\n<script async src="..."></script>'}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">Scripts Untuk Di Dalam &lt;body&gt;</label>
                  <p className="text-xs text-gray-500 mb-2">Paste tag &lt;noscript&gt; dari Google Tag Manager atau script lain yang harus ada di dalam body di sini.</p>
                  <textarea 
                    className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 font-mono text-sm ring-primary-yellow outline-none transition-all"
                    rows={4}
                    value={settings.bodyScripts !== undefined ? settings.bodyScripts : (settings.googleTagManagerId || '')}
                    onChange={e => setSettings({...settings, bodyScripts: e.target.value})}
                    placeholder={'<noscript><iframe src="..." height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>'}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSaving}
                className="bg-primary-yellow text-primary-brown font-extrabold px-10 py-4 rounded-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                Simpan Perubahan
              </button>
            </form>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              {products.map(product => (
                <div key={product.id} className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-3xl bg-bg-cream hover:bg-primary-yellow/5 transition-all">
                  <img src={product.imageUrl} className="w-24 h-24 rounded-2xl object-cover" alt="" referrerPolicy="no-referrer" />
                  <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 px-2">Nama Produk</label>
                      <input 
                        className="w-full bg-white p-3 rounded-xl outline-none focus:ring-2 ring-primary-yellow"
                        value={product.name}
                        onChange={e => {
                          const newProds = products.map(p => p.id === product.id ? {...p, name: e.target.value} : p);
                          setProducts(newProds);
                          updateDoc(doc(db, 'products', product.id), { name: e.target.value });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-gray-500 px-2">Harga</label>
                       <input 
                        className="w-full bg-white p-3 rounded-xl outline-none focus:ring-2 ring-primary-yellow"
                        value={product.price}
                        onChange={e => {
                          const newProds = products.map(p => p.id === product.id ? {...p, price: e.target.value} : p);
                          setProducts(newProds);
                          updateDoc(doc(db, 'products', product.id), { price: e.target.value });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-gray-500 px-2">Berat / Ukuran</label>
                       <input 
                        className="w-full bg-white p-3 rounded-xl outline-none focus:ring-2 ring-primary-yellow"
                        value={product.weight || ''}
                        onChange={e => {
                          const newProds = products.map(p => p.id === product.id ? {...p, weight: e.target.value} : p);
                          setProducts(newProds);
                          updateDoc(doc(db, 'products', product.id), { weight: e.target.value });
                        }}
                      />
                    </div>
                    <div className="md:col-span-2 lg:col-span-3 space-y-2">
                       <label className="text-sm font-bold text-gray-500 px-2">Deskripsi</label>
                       <textarea 
                        className="w-full bg-white p-3 rounded-xl outline-none focus:ring-2 ring-primary-yellow"
                        value={product.description || ''}
                        onChange={e => {
                          const newProds = products.map(p => p.id === product.id ? {...p, description: e.target.value} : p);
                          setProducts(newProds);
                          updateDoc(doc(db, 'products', product.id), { description: e.target.value });
                        }}
                      />
                    </div>
                    <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-2 relative mt-2">
                      <div className="flex justify-between items-center bg-white p-2 rounded-xl">
                        <span className="text-sm font-bold text-gray-500 px-2">Image</span>
                        <button 
                          onClick={() => deleteItem('products', product.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      <ImageInput 
                        value={product.imageUrl}
                        onChange={val => {
                          const newProds = products.map(p => p.id === product.id ? {...p, imageUrl: val} : p);
                          setProducts(newProds);
                          updateDoc(doc(db, 'products', product.id), { imageUrl: val });
                        }}
                        showPreview={false}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              {testimonials.map(item => (
                <div key={item.id} className="p-6 rounded-3xl bg-bg-cream space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-grow space-y-2 mr-4">
                      <input 
                        className="w-full text-xl font-bold bg-white p-3 rounded-xl outline-none focus:ring-2 ring-primary-yellow"
                        value={item.name}
                        onChange={e => {
                          const newItems = testimonials.map(t => t.id === item.id ? {...t, name: e.target.value} : t);
                          setTestimonials(newItems);
                          updateDoc(doc(db, 'testimonials', item.id), { name: e.target.value });
                        }}
                        placeholder="Nama Pembeli"
                      />
                      <input 
                        className="w-full text-sm font-medium text-gray-600 bg-white p-3 rounded-xl outline-none focus:ring-2 ring-primary-yellow"
                        value={item.role || ''}
                        onChange={e => {
                          const newItems = testimonials.map(t => t.id === item.id ? {...t, role: e.target.value} : t);
                          setTestimonials(newItems);
                          updateDoc(doc(db, 'testimonials', item.id), { role: e.target.value });
                        }}
                        placeholder="Peran (misal: Pembeli Setia)"
                      />
                    </div>
                    <button onClick={() => deleteItem('testimonials', item.id)} className="text-red-500 p-2 shrink-0 bg-white rounded-xl hover:bg-red-50"><Trash size={20} /></button>
                  </div>
                  <textarea 
                    className="w-full bg-white p-4 rounded-xl outline-none focus:ring-2 ring-primary-yellow"
                    value={item.text}
                    onChange={e => {
                      const newItems = testimonials.map(t => t.id === item.id ? {...t, text: e.target.value} : t);
                      setTestimonials(newItems);
                      updateDoc(doc(db, 'testimonials', item.id), { text: e.target.value });
                    }}
                  />
                  <div className="bg-white p-4 rounded-xl">
                    <ImageInput 
                      label="Avatar URL (Optional)"
                      value={item.avatarUrl || ''}
                      onChange={val => {
                        const newItems = testimonials.map(t => t.id === item.id ? {...t, avatarUrl: val} : t);
                        setTestimonials(newItems);
                        updateDoc(doc(db, 'testimonials', item.id), { avatarUrl: val });
                      }}
                      showPreview={true}
                    />
                  </div>
                </div>
              ))}
              <button 
                onClick={async () => {
                  const newItem = { name: 'Nama Pelanggan', text: 'Ulasan pelanggan...', order: testimonials.length + 1 };
                  const docRef = await addDoc(collection(db, 'testimonials'), newItem);
                  setTestimonials([...testimonials, { ...newItem, id: docRef.id }]);
                }}
                className="w-full border-2 border-dashed border-gray-200 p-8 rounded-3xl text-gray-400 hover:border-primary-yellow hover:text-primary-yellow transition-all flex items-center justify-center gap-2"
              >
                <Plus size={24} /> Tambah Testimoni Baru
              </button>
            </div>
          )}

          {activeTab === 'faqs' && (
            <div className="space-y-6">
              {faqs.map(faq => (
                <div key={faq.id} className="p-6 rounded-3xl bg-bg-cream space-y-4">
                  <div className="flex justify-between items-start">
                    <input 
                      className="font-bold w-full bg-transparent outline-none border-b border-transparent focus:border-primary-yellow"
                      value={faq.question}
                      onChange={e => {
                        const newItems = faqs.map(f => f.id === faq.id ? {...f, question: e.target.value} : f);
                        setFaqs(newItems);
                        updateDoc(doc(db, 'faqs', faq.id), { question: e.target.value });
                      }}
                    />
                    <button onClick={() => deleteItem('faqs', faq.id)} className="text-red-500 p-2"><Trash size={20} /></button>
                  </div>
                  <textarea 
                    className="w-full bg-white p-4 rounded-xl outline-none focus:ring-2 ring-primary-yellow"
                    value={faq.answer}
                    onChange={e => {
                      const newItems = faqs.map(f => f.id === faq.id ? {...f, answer: e.target.value} : f);
                      setFaqs(newItems);
                      updateDoc(doc(db, 'faqs', faq.id), { answer: e.target.value });
                    }}
                  />
                </div>
              ))}
              <button 
                onClick={async () => {
                  const newItem = { question: 'Pertanyaan baru?', answer: 'Jawaban baru...', order: faqs.length + 1 };
                  const docRef = await addDoc(collection(db, 'faqs'), newItem);
                  setFaqs([...faqs, { ...newItem, id: docRef.id }]);
                }}
                className="w-full border-2 border-dashed border-gray-200 p-8 rounded-3xl text-gray-400 hover:border-primary-yellow hover:text-primary-yellow transition-all flex items-center justify-center gap-2"
              >
                <Plus size={24} /> Tambah FAQ Baru
              </button>
            </div>
          )}
          {activeTab === 'articles' && (
            <div className="space-y-6">
              <div className="flex bg-primary-yellow/10 p-6 rounded-3xl justify-between items-center mb-6 border border-primary-yellow/20">
                <div>
                  <h3 className="font-bold text-primary-brown text-lg">Reset Semua Artikel</h3>
                  <p className="text-secondary-brown text-sm">Jika materi artikel Anda masih kosong atau berisi tulisan acak, Anda dapat meresetnya kembali ke artikel bawaan yang baru.</p>
                </div>
                <button 
                  onClick={async () => {
                    const confirm = window.confirm("Peringatan: Ini akan menghapus SEMUA artikel saat ini dan menggantinya dengan artikel bawaan. Anda yakin?");
                    if (!confirm) return;
                    
                    try {
                      // Hapus semua artikel lama
                      for (const article of articles) {
                        await deleteDoc(doc(db, 'articles', article.id));
                      }
                      
                      // Masukkan artikel baru
                      const promises = initialArticles.map(article => {
                        const { id, ...data } = article;
                        return addDoc(collection(db, 'articles'), data);
                      });
                      await Promise.all(promises);
                      
                      const newSnap = await getDocs(query(collection(db, 'articles')));
                      const items = newSnap.docs.map(d => ({ id: d.id, ...d.data() } as Article));
                      items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                      setArticles(items);
                      
                      alert("Artikel berhasil di-reset!");
                    } catch (e) {
                      console.error(e);
                      alert("Terjadi kesalahan saat mereset artikel.");
                    }
                  }}
                  className="bg-red-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-red-600 transition-colors whitespace-nowrap"
                >
                  Reset ke Default
                </button>
              </div>

              {articles.map(article => (
                <div key={article.id} className="p-6 rounded-3xl bg-bg-cream space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-grow space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 px-2">Judul Artikel</label>
                        <input 
                          className="w-full font-bold text-xl bg-white p-4 rounded-xl outline-none focus:ring-2 ring-primary-yellow"
                          value={article.title}
                          onChange={e => {
                            const newItems = articles.map(art => art.id === article.id ? {...art, title: e.target.value} : art);
                            setArticles(newItems);
                            updateDoc(doc(db, 'articles', article.id), { title: e.target.value });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 px-2">Slug (URL)</label>
                        <input 
                          className="w-full bg-white p-3 rounded-xl outline-none focus:ring-2 ring-primary-yellow font-mono text-sm"
                          value={article.slug}
                          onChange={e => {
                            const newItems = articles.map(art => art.id === article.id ? {...art, slug: e.target.value} : art);
                            setArticles(newItems);
                            updateDoc(doc(db, 'articles', article.id), { slug: e.target.value });
                          }}
                        />
                      </div>
                    </div>
                    <button onClick={() => deleteItem('articles', article.id)} className="text-red-500 p-3 bg-white rounded-xl hover:bg-red-50">
                      <Trash size={20} />
                    </button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl">
                      <ImageInput 
                        label="Cover Image"
                        value={article.imageUrl || ''}
                        onChange={val => {
                          const newItems = articles.map(art => art.id === article.id ? {...art, imageUrl: val} : art);
                          setArticles(newItems);
                          updateDoc(doc(db, 'articles', article.id), { imageUrl: val });
                        }}
                        showPreview={true}
                      />
                    </div>
                    <div className="bg-white p-4 rounded-xl flex items-center justify-between">
                      <div className="space-y-1">
                        <label className="font-bold text-primary-brown">Status Publikasi</label>
                        <p className="text-sm text-gray-500">{article.published ? 'Artikel dapat dilihat publik' : 'Draft (disembunyikan)'}</p>
                      </div>
                      <button 
                        onClick={() => {
                          const newVal = !article.published;
                          const newItems = articles.map(art => art.id === article.id ? {...art, published: newVal} : art);
                          setArticles(newItems);
                          updateDoc(doc(db, 'articles', article.id), { published: newVal });
                        }}
                        className={`w-14 h-8 rounded-full relative transition-colors ${article.published ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${article.published ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 px-2 flex justify-between">
                      <span>Konten (Mendukung Markdown / HTML)</span>
                      <a href="https://www.markdownguide.org/basic-syntax/" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Panduan Markdown</a>
                    </label>
                    <textarea 
                      rows={10}
                      className="w-full bg-white p-4 rounded-xl outline-none focus:ring-2 ring-primary-yellow font-mono text-sm leading-relaxed"
                      value={article.content}
                      onChange={e => {
                        const newItems = articles.map(art => art.id === article.id ? {...art, content: e.target.value} : art);
                        setArticles(newItems);
                        updateDoc(doc(db, 'articles', article.id), { content: e.target.value });
                      }}
                      placeholder="Tulis konten artikel di sini..."
                    />
                  </div>
                </div>
              ))}
              <button 
                onClick={addArticle}
                className="w-full border-2 border-dashed border-gray-200 p-8 rounded-3xl text-gray-400 hover:border-primary-yellow hover:text-primary-yellow transition-all flex items-center justify-center gap-2"
              >
                <Plus size={24} /> Tambah Artikel Baru
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
