import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Article } from '../types';
import { initialArticles } from '../data/articles';
import Markdown from 'react-markdown';
import { ArrowLeft, Clock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      try {
        const q = query(collection(db, 'articles'), where('slug', '==', slug), limit(1));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          setArticle({ ...snapshot.docs[0].data(), id: snapshot.docs[0].id } as Article);
        } else {
          // Fallback to local data if not found in Firestore
          const localArticle = initialArticles.find(a => a.slug === slug);
          if (localArticle) {
            setArticle(localArticle);
          } else {
            setArticle(null);
          }
        }
      } catch (error) {
        console.warn("Using local article fallback due to fetch error/quota:", error);
        const localArticle = initialArticles.find(a => a.slug === slug);
        setArticle(localArticle || null);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 bg-bg-cream min-h-screen flex justify-center p-20">
        <div className="w-10 h-10 border-4 border-primary-yellow border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="pt-32 pb-24 bg-bg-cream min-h-screen">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-primary-brown mb-4">Artikel tidak ditemukan</h1>
          <button onClick={() => navigate('/artikel')} className="text-primary-yellow font-bold hover:underline">
            Kembali ke Artikel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen">
      <Helmet>
        <title>{article.title} - Snack Asik</title>
        <meta name="description" content={article.content.substring(0, 150)} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <Link to="/artikel" className="inline-flex items-center text-primary-brown/60 hover:text-primary-yellow font-bold mb-8 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Kembali ke Daftar Artikel
        </Link>
        
        <header className="mb-12">
          <div className="flex items-center gap-2 text-primary-brown/60 font-medium mb-6">
            <Clock size={18} />
            <span>{new Date(article.createdAt).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black text-primary-brown tracking-tight leading-[1.1] mb-8">
            {article.title}
          </h1>
          <div className="w-full aspect-[21/9] rounded-[32px] overflow-hidden mb-12 shadow-md">
            <img 
              src={article.imageUrl || "https://images.unsplash.com/photo-1613919113166-704944fd6ab9?auto=format&fit=crop&q=80&w=800"} 
              alt={article.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </header>

        <div className="max-w-none text-primary-brown/80 font-medium leading-relaxed
          [&>h1]:text-4xl [&>h1]:font-display [&>h1]:font-black [&>h1]:text-primary-brown [&>h1]:mt-10 [&>h1]:mb-6
          [&>h2]:text-3xl [&>h2]:font-display [&>h2]:font-black [&>h2]:text-primary-brown [&>h2]:mt-10 [&>h2]:mb-4
          [&>h3]:text-2xl [&>h3]:font-display [&>h3]:font-bold [&>h3]:text-primary-brown [&>h3]:mt-8 [&>h3]:mb-4
          [&>p]:mb-6 [&>p]:text-lg
          [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2
          [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol>li]:mb-2
          [&>a]:text-blue-600 [&>a]:font-bold [&>a]:underline hover:[&>a]:text-blue-800
          [&>strong]:font-black [&>strong]:text-primary-brown
          [&>img]:rounded-3xl [&>img]:shadow-md [&>img]:mb-6
        ">
          <Markdown>{article.content}</Markdown>
        </div>

        <div className="mt-12 p-6 bg-primary-yellow/10 rounded-[24px] border border-primary-yellow/20 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex-1">
             <h4 className="font-bold text-primary-brown text-lg mb-2">Didukung oleh LSP Digital</h4>
             <p className="text-secondary-brown font-medium">Tingkatkan kompetensi digital dan raih sertifikasi profesional Anda bersama <a href="https://lspdigital.id" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-bold underline">LSP Digital</a>.</p>
           </div>
           <a href="https://lspdigital.id" target="_blank" rel="noopener noreferrer" className="bg-white text-primary-brown border-2 border-primary-brown/10 px-6 py-3 rounded-xl font-bold hover:border-primary-yellow hover:scale-105 transition-all text-sm whitespace-nowrap shadow-sm">
             Kunjungi Website
           </a>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100 flex justify-between items-center">
          <p className="text-primary-brown/60 font-bold">Terima kasih sudah membaca!</p>
          <Link to="/#produk" className="bg-primary-yellow text-primary-brown px-6 py-3 rounded-xl font-black hover:bg-primary-brown hover:text-white transition-colors">
            Pesan Cemilan Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
