import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Article } from '../types';
import { initialArticles } from '../data/articles';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const q = query(
          collection(db, 'articles'),
          where('published', '==', true)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Article));
        
        if (data.length > 0) {
          // Client side sort
          data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setArticles(data);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="pt-32 pb-24 bg-bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-display font-black text-primary-brown tracking-tighter">
            Artikel <span className="text-primary-yellow">Pilihan</span>
          </h1>
          <p className="text-lg text-primary-brown/70 max-w-2xl mx-auto font-medium">
            Temukan berbagai informasi menarik dan bermanfaat tentang camilan, tips, dan peluang usaha.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center p-20">
            <div className="w-10 h-10 border-4 border-primary-yellow border-t-transparent rounded-full animate-spin" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[40px] border border-gray-100">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-400">Belum ada artikel</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
              <Link 
                key={article.id} 
                to={`/artikel/${article.slug}`}
                className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col border border-transparent hover:border-primary-yellow/30"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img 
                    src={article.imageUrl || "https://images.unsplash.com/photo-1613919113166-704944fd6ab9?auto=format&fit=crop&q=80&w=800"} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-primary-brown text-sm font-bold px-3 py-1.5 rounded-full shadow-sm">
                    {new Date(article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-black text-primary-brown mb-4 line-clamp-2 leading-tight group-hover:text-primary-yellow transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-primary-brown/70 font-medium line-clamp-3 mb-6">
                    {article.content.substring(0, 150)}...
                  </p>
                  <div className="mt-auto flex items-center font-bold text-primary-yellow group-hover:text-primary-brown transition-colors">
                    Baca Selengkapnya <ArrowRight size={20} className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
