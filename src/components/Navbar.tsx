import { Menu, X, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Menu Cemilan', href: '/#produk' },
    { name: 'Rahasia Dapur', href: '/#tentang' },
    { name: 'Kata Mereka', href: '/#testimoni' },
    { name: 'Artikel & Tips', href: '/artikel' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md py-3 shadow-sm border-b border-gray-100' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary-yellow p-1.5 rounded-lg shadow-sm group-hover:-rotate-6 group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-6 h-6 text-primary-brown" />
          </div>
          <span className="font-display text-2xl font-black text-primary-brown tracking-tighter">
            Snack<span className="text-primary-yellow">Asik</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            link.href.startsWith('/#') || link.href.startsWith('#') ? (
              <a 
                key={link.name} 
                href={link.href}
                className="text-primary-brown font-bold hover:text-primary-yellow transition-colors"
              >
                {link.name}
              </a>
            ) : (
              <Link 
                key={link.name} 
                to={link.href}
                className="text-primary-brown font-bold hover:text-primary-yellow transition-colors"
              >
                {link.name}
              </Link>
            )
          ))}
          <a 
            href="#produk"
            className="flex items-center gap-2 bg-primary-brown hover:bg-accent-brown text-white font-bold px-6 py-2.5 rounded-full transition-all hover:-translate-y-0.5 shadow-md hover:shadow-xl"
          >
            Pesan Sekarang
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button 
          className="md:hidden text-primary-brown p-2 bg-white/50 backdrop-blur-sm rounded-full"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-lg border-b border-primary-yellow/20 overflow-hidden shadow-xl"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
               link.href.startsWith('/#') || link.href.startsWith('#') ? (
                 <a 
                   key={link.name} 
                   href={link.href}
                   className="text-lg font-bold text-primary-brown hover:text-primary-yellow bg-gray-50 p-4 rounded-xl"
                   onClick={() => setIsMobileMenuOpen(false)}
                 >
                   {link.name}
                 </a>
               ) : (
                 <Link 
                   key={link.name} 
                   to={link.href}
                   className="text-lg font-bold text-primary-brown hover:text-primary-yellow bg-gray-50 p-4 rounded-xl"
                   onClick={() => setIsMobileMenuOpen(false)}
                 >
                   {link.name}
                 </Link>
               )
              ))}
              <a 
                href="#produk"
                className="bg-primary-brown text-white text-center font-bold py-4 rounded-xl shadow-md mt-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pesan Sekarang
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
