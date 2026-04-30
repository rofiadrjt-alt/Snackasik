import { motion } from 'motion/react';
import { ShoppingBasket, ArrowRight, Star, Flame } from 'lucide-react';
import { Product } from '../types';

interface ProductListProps {
  products: Product[];
  whatsappNumber: string;
}

export default function ProductList({ products, whatsappNumber }: ProductListProps) {
  const handleOrder = (productName: string) => {
    const message = encodeURIComponent(`Halo Snack Asik! Saya mau pesan ${productName}. Bisa dibantu?`);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <section id="produk" className="py-24 bg-bg-cream relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-yellow/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 relative z-10">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-display font-black text-primary-brown tracking-tighter">
              Pilih Porsi <span className="text-primary-yellow">Ngemilmu!</span>
            </h2>
            <p className="text-lg text-primary-brown/70 max-w-xl font-medium leading-relaxed">
              Buat me-time atau sharing bareng bestie? Pilih ukuran yang paling pas buat nemenin momen asikmu hari ini.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: "spring" }}
              viewport={{ once: true }}
              className="bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group border-2 border-transparent hover:border-primary-yellow/30 flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden relative p-4 bg-gradient-to-t from-gray-50 to-white">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover rounded-[32px] group-hover:scale-105 transition-transform duration-700 shadow-sm"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute top-8 left-8 bg-white/90 backdrop-blur text-red-500 font-bold px-3 py-1.5 rounded-full text-sm shadow-sm flex items-center gap-1">
                  <Flame size={16} className="text-red-500" /> Best Seller
                </div>

                <div className="absolute top-8 right-8 bg-primary-yellow text-primary-brown font-black px-4 py-1.5 rounded-full text-sm shadow-md flex items-center gap-1">
                  <Star size={14} className="fill-primary-brown" /> 
                  {product.weight || '50g'}
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-primary-brown mb-3 tracking-tight group-hover:text-primary-yellow transition-colors">{product.name}</h3>
                  <p className="text-primary-brown/70 text-base leading-relaxed font-medium">
                    {product.description}
                  </p>
                </div>
                
                <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-4">
                  <span className="text-4xl font-display font-black text-primary-brown mb-2">
                    {product.price}
                  </span>
                  <button 
                    onClick={() => handleOrder(product.name)}
                    className="w-full flex justify-center items-center gap-2 bg-primary-yellow text-primary-brown px-6 py-4 rounded-2xl hover:bg-primary-brown hover:text-white transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl font-black text-lg group/btn"
                  >
                    <ShoppingBasket size={24} className="group-hover/btn:scale-110 transition-transform" />
                    Pesan via WhatsApp
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
