import { motion } from 'motion/react';
import { Article } from '../types';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';

interface LatestArticlesProps {
  articles: Article[];
}

export default function LatestArticles({ articles }: LatestArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="py-24 bg-bg-cream">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-display font-black text-primary-brown leading-tight">
              Artikel & <span className="text-primary-yellow">Tips</span>
            </h2>
            <p className="text-xl text-primary-brown/60 font-medium max-w-xl">
              Cari tahu cara terbaik menikmati cemilan dan info menarik lainnya seputar kedapur Snack Asik.
            </p>
          </div>
          <Link 
            to="/artikel" 
            className="inline-flex items-center gap-3 text-primary-brown font-black hover:text-primary-yellow transition-colors group"
          >
            Lihat Semua Artikel
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md group-hover:bg-primary-yellow transition-colors">
              <ArrowRight size={20} />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-[40px] overflow-hidden shadow-xl shadow-primary-brown/5 group hover:-translate-y-2 transition-all duration-500 border border-transparent hover:border-primary-yellow/30"
            >
              <Link to={`/artikel/${article.slug}`} className="block aspect-[16/10] overflow-hidden">
                <img 
                  src={article.imageUrl || "https://images.unsplash.com/photo-1613919113166-704944fd6ab9?auto=format&fit=crop&q=80&w=800"} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </Link>
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-3 text-primary-brown/40 font-bold text-xs uppercase tracking-widest">
                  <Clock size={14} />
                  <span>{new Date(article.createdAt).toLocaleDateString('id-ID', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <h3 className="text-2xl font-black text-primary-brown leading-snug group-hover:text-primary-yellow transition-colors min-h-[4rem] line-clamp-2">
                  <Link to={`/artikel/${article.slug}`}>{article.title}</Link>
                </h3>
                <Link 
                  to={`/artikel/${article.slug}`}
                  className="inline-flex items-center gap-2 text-primary-yellow font-black group/link"
                >
                  Baca Selengkapnya
                  <ArrowRight size={18} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
