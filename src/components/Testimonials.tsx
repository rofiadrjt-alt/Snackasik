import { motion } from 'motion/react';
import { Quote, Star, BadgeCheck } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  // Bento grid layout classes
  const getBentoClasses = (index: number) => {
    switch (index % 4) {
      case 0: return 'md:col-span-2 md:row-span-2 h-[450px] md:h-full bg-primary-yellow/10';
      case 1: return 'md:col-span-1 md:row-span-1 h-[280px] bg-bg-cream border border-gray-100';
      case 2: return 'md:col-span-1 md:row-span-1 h-[280px] bg-primary-yellow text-primary-brown';
      case 3: return 'md:col-span-2 md:row-span-1 h-[320px] bg-primary-brown text-white';
      default: return 'md:col-span-1 md:row-span-1 h-[280px] bg-bg-cream';
    }
  };

  const getQuoteColor = (index: number) => {
    switch (index % 4) {
      case 2: return 'text-primary-brown/20';
      case 3: return 'text-white/10';
      default: return 'text-primary-yellow/50';
    }
  };

  return (
    <section id="testimoni" className="py-24 bg-white overflow-hidden relative">
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-primary-yellow/10 rounded-full blur-[80px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-display font-black text-primary-brown tracking-tighter">
            Kata Mereka yang <br/><span className="text-primary-yellow">Udah Ketagihan</span>
          </h2>
          <p className="text-lg text-primary-brown/70 max-w-2xl mx-auto font-medium">
            Ribuan bungkus udah ludes, mending dengerin apa kata pelanggan setia kami sebelum kamu nyesel kehabisan!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className={`relative group rounded-[40px] overflow-hidden p-8 flex flex-col justify-between transition-all hover:shadow-xl hover:-translate-y-1 ${getBentoClasses(index)}`}
            >
              <div className={`absolute top-8 right-8 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500 ${getQuoteColor(index)}`}>
                <Quote size={40} className="fill-current" />
              </div>
              
              <div className="relative z-10 space-y-4 pt-4">
                <div className="flex gap-1" aria-label="5 stars rating">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className={`${index % 4 === 3 ? 'fill-primary-yellow stroke-primary-yellow' : 'fill-amber-500 stroke-amber-500'}`} />
                  ))}
                </div>
                <p className={`text-xl md:text-2xl font-medium leading-relaxed line-clamp-5 ${index % 4 === 3 ? 'text-white/90' : 'text-primary-brown'}`}>
                  "{item.text}"
                </p>
              </div>

              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-current/10">
                {item.avatarUrl ? (
                  <img src={item.avatarUrl} alt={item.name} className="w-12 h-12 rounded-full object-cover shadow-sm" referrerPolicy="no-referrer" />
                ) : (
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-display font-black text-xl shadow-sm ${index % 4 === 2 ? 'bg-white text-primary-brown' : 'bg-primary-yellow text-primary-brown'}`}>
                    {item.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className={`font-bold flex items-center gap-1.5 ${index % 4 === 3 ? 'text-white' : 'text-primary-brown'}`}>
                    {item.name} <BadgeCheck size={16} className={index % 4 === 3 ? 'text-blue-300' : 'text-blue-500'} />
                  </h4>
                  <p className={`text-sm ${index % 4 === 3 ? 'text-white/60' : 'text-primary-brown/60'}`}>{item.role || 'Pembeli Terverifikasi'}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
