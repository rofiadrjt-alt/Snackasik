import { motion } from 'motion/react';
import { Wheat, Check, ChefHat, ShieldCheck, HeartHandshake } from 'lucide-react';

const features = [
  {
    icon: Wheat,
    title: "Resep Warisan",
    desc: "Tepung pilihan, bawang segar & taburan irisan seledri wangi. Bukan perisa buatan.",
    color: "bg-amber-100 text-amber-700"
  },
  {
    icon: Check,
    title: "Potongan Pas",
    desc: "Bentuk kotak tipis yang pas buat sekali hap. Nggak bikin mulut belepotan.",
    color: "bg-yellow-100 text-yellow-700"
  },
  {
    icon: ChefHat,
    title: "Gurih Alami",
    desc: "Rasa gurih bawang asli yang nikmat, digoreng dengan minyak baru yang higienis.",
    color: "bg-orange-100 text-orange-700"
  },
  {
    icon: HeartHandshake,
    title: "Teman Setia",
    desc: "Paling asik buat temen nugas, nonton netflix, atau kumpul bareng keluarga.",
    color: "bg-red-100 text-red-700"
  },
  {
    icon: ShieldCheck,
    title: "Kemasan Ziplock",
    desc: "Gak perlu bingung nyari karet gelang. Ziplock-nya rapat, kerenyahan tahan lama.",
    color: "bg-stone-100 text-stone-700"
  }
];

export default function Features({
  headline = "Kenapa Kamu Wajib Nyobain?",
  description = "Bukan sekadar keripik biasa. Snack Asik dibikin pakai cinta biar tiap gigitannya ngasih pengalaman ngemil yang beda."
}: {
  headline?: string;
  description?: string;
}) {
  return (
    <section className="py-24 relative bg-bg-cream overflow-hidden">
      {/* Decorative bg element */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[400px] bg-primary-yellow/5 skew-y-3 -z-10" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-display font-black text-primary-brown tracking-tighter">
            {headline}
          </h2>
          <p className="text-lg text-primary-brown/70 max-w-2xl mx-auto font-medium">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-center">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: "spring" }}
              viewport={{ once: true }}
              className={`p-8 rounded-[40px] bg-white border-2 border-transparent shadow-sm hover:shadow-2xl hover:border-primary-yellow/20 hover:-translate-y-2 transition-all duration-300 group ${index === 4 ? 'lg:col-span-2 lg:mx-auto lg:w-1/2' : ''}`}
            >
              <div className={`w-16 h-16 rounded-3xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-transform shadow-inner`}>
                <feature.icon size={32} />
              </div>
              <h3 className="text-2xl font-black text-primary-brown mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-primary-brown/70 text-base leading-relaxed font-medium">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
