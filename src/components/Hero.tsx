import { motion } from 'motion/react';
import { ShoppingCart, ArrowDown, ShieldCheck, CheckCircle2, Star } from 'lucide-react';

interface HeroProps {
  headline: string;
  description: string;
  image: string;
}

export default function Hero({ headline, description, image }: HeroProps) {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 -z-10 w-full md:w-2/3 h-full bg-gradient-to-bl from-primary-yellow/20 to-transparent rounded-bl-[150px]" />
      <div className="absolute top-40 left-10 -z-10 w-48 h-48 bg-primary-yellow/30 rounded-full blur-[80px]" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 bg-white text-primary-brown px-5 py-2 rounded-full text-sm font-bold tracking-wide shadow-sm border border-primary-yellow/30">
            <span>✨</span> Cemilan Favorit Keluarga
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black text-primary-brown leading-[1.1] tracking-tighter">
            {headline}
          </h1>
          <p className="text-xl md:text-2xl text-primary-brown/80 leading-relaxed max-w-xl font-medium">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a 
              href="#produk"
              className="group flex flex-1 sm:flex-none items-center justify-center gap-3 bg-primary-yellow text-primary-brown border-2 border-primary-yellow text-center text-lg font-black px-10 py-5 rounded-full hover:bg-primary-brown hover:text-primary-yellow transition-all shadow-xl hover:-translate-y-1 hover:shadow-2xl"
            >
              <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
              Pesan Sekarang!
            </a>
            <a 
              href="#tentang"
              className="flex items-center justify-center gap-3 bg-white text-primary-brown border-2 border-primary-brown text-center text-lg font-bold px-10 py-5 rounded-full hover:bg-bg-cream transition-all hover:-translate-y-1"
            >
              Cari Tahu Bedanya
              <ArrowDown size={20} className="animate-bounce" />
            </a>
          </div>

          <div className="pt-6 flex flex-wrap items-center gap-6 text-sm font-bold text-primary-brown/70">
            <span className="flex items-center gap-2"><CheckCircle2 className="text-green-500" size={20}/> 100% Halal</span>
            <span className="flex items-center gap-2"><ShieldCheck className="text-blue-500" size={20}/> Tanpa Pengawet</span>
            <span className="flex items-center gap-2 text-amber-500">
              <div className="flex -space-x-1">
                <Star className="fill-amber-500 stroke-amber-500" size={16} />
                <Star className="fill-amber-500 stroke-amber-500" size={16} />
                <Star className="fill-amber-500 stroke-amber-500" size={16} />
                <Star className="fill-amber-500 stroke-amber-500" size={16} />
                <Star className="fill-amber-500 stroke-amber-500" size={16} />
              </div>
              <span className="text-primary-brown/70 ml-1">Ribuan Terjual</span>
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: 'spring' }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-yellow/50 to-primary-yellow/20 rounded-[40px] rotate-6 -z-10 blur-xl" />
          <div className="absolute inset-0 bg-primary-yellow rounded-[40px] rotate-3 -z-10 shadow-inner" />
          <div className="bg-white p-3 rounded-[40px] shadow-2xl overflow-hidden border-4 border-white backdrop-blur-sm">
            <img 
              src={image} 
              alt="Keripik Bawang"
              className="w-full h-auto aspect-[4/5] object-cover rounded-[30px] hover:scale-105 transition-transform duration-700 origin-center"
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* Decorative badges */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-6 -right-6 lg:-right-10 bg-white p-4 rounded-3xl shadow-xl flex items-center gap-4 border border-primary-yellow/30"
          >
            <div className="w-12 h-12 bg-primary-yellow rounded-2xl flex items-center justify-center text-primary-brown font-display font-black text-xl shadow-inner">
              💯
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Kualitas</p>
              <p className="text-base font-black text-primary-brown">Bahan Premium</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
