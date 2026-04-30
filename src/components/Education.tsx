import { motion } from 'motion/react';
import { BadgeCheck } from 'lucide-react';

const stats = [
  { label: 'Rahasia Renyah', value: 'Digiling Tipis', desc: 'Adonan digiling tipis sempurna lalu dipotong kotak agar tekstur garingnya maksimal merata.', icon: '🥖' },
  { label: 'Wangi Khas', value: 'Bawang & Seledri', desc: 'Perpaduan irisan daun seledri segar dan bawang merah yang menggugah selera.', icon: '🧄' },
  { label: 'Teman Nyantai', value: 'Cocok Dimanapun', desc: 'Paling asik disandingkan dengan secangkir kopi, teh hangat, atau nonton TV.', icon: '☕' },
  { label: 'Rasa Nostalgia', value: 'Resep Rumahan', desc: 'Cita rasa jadul yang ngingetin sama cemilan kue bawang buatan nenek.', icon: '💛' },
];

export default function Education({ 
  image,
  headline = "Kenapa Bikin Ketagihan?",
  description = "Sadar nggak sih kalau keripik bawang tuh cemilan yang nggak lekang oleh waktu? Kami pertahankan bentuk kotak klasik dengan taburan seledri wangi yang bikin rindu.",
  badge = "Rahasia Dapur"
}: { 
  image?: string;
  headline?: string;
  description?: string;
  badge?: string;
}) {
  const displayImage = image || "https://images.unsplash.com/photo-1563223552-30d01fda3bc6?auto=format&fit=crop&q=80&w=800";

  return (
    <section id="tentang" className="py-24 bg-primary-brown text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 -left-20 w-96 h-96 bg-primary-yellow/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-20 right-10 w-96 h-96 bg-bg-cream/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring" }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-[40px] overflow-hidden border-4 border-white/20 shadow-2xl">
              <img 
                src={displayImage} 
                alt="Proses Pembuatan" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="absolute -bottom-10 -right-10 bg-primary-yellow text-primary-brown p-8 rounded-[40px] shadow-2xl hidden md:block max-w-[280px] border-4 border-primary-brown">
              <div className="flex items-center gap-3 mb-3">
                <BadgeCheck size={28} className="text-primary-brown shrink-0" />
                <p className="font-display font-black text-xl leading-tight">Digoreng Sempurna</p>
              </div>
              <p className="text-sm font-medium opacity-90 leading-relaxed">
                Hanya menggunakan minyak nabati premium agar keripik tetap garing tanpa terasa oily.
              </p>
            </div>
          </motion.div>

          <div className="space-y-12">
            <div className="space-y-6">
              <div className="inline-block bg-white/10 text-primary-yellow px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase border border-primary-yellow/30">
                {badge}
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-black leading-[1.2]">
                {headline}
              </h2>
              <p className="text-xl text-white/80 leading-relaxed font-medium">
                {description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.value}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/5 p-8 rounded-[32px] border border-white/10 hover:bg-white/10 hover:border-primary-yellow/30 transition-all group"
                >
                  <span className="text-4xl mb-4 block group-hover:scale-125 group-hover:-rotate-6 transition-transform transform origin-bottom-left">{stat.icon}</span>
                  <p className="text-primary-yellow text-xs font-black uppercase tracking-widest mb-2">{stat.label}</p>
                  <h4 className="text-2xl font-bold mb-3">{stat.value}</h4>
                  <p className="text-sm text-white/60 leading-relaxed font-medium">{stat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
