import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';

type HeaderProps = {
  onRegisterClick?: () => void;
};

export function Header({ onRegisterClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Register', path: '/register', onClick: onRegisterClick }
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-0 sm:px-2 lg:px-3">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src="/logof.jpeg" alt="Khushit logo" className="w-60 h-48 rounded-lg object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isProductsActive =
                link.name === 'Products' && location.pathname.startsWith('/products');
              const isActive = isProductsActive || location.pathname === link.path;

              if (link.href) {
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className="relative py-2 text-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                );
              }

              if (link.onClick) {
                return (
                  <button
                    key={link.path ?? link.name}
                    type="button"
                    onClick={link.onClick}
                    className="relative py-2 text-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </button>
                );
              }

              if (!link.path) {
                return null;
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative py-2 transition-colors duration-200 ${
                    isActive
                      ? 'text-primary font-medium'
                      : 'text-foreground hover:text-primary'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t border-gray-100"
        >
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const isProductsActive =
                link.name === 'Products' && location.pathname.startsWith('/products');
              const isActive = isProductsActive || location.pathname === link.path;

              if (link.href) {
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left py-3 px-4 rounded-lg text-foreground hover:bg-secondary transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                );
              }

              if (link.onClick) {
                return (
                  <button
                    key={link.path ?? link.name}
                    type="button"
                    onClick={() => {
                      link.onClick?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-3 px-4 rounded-lg text-foreground hover:bg-secondary transition-colors duration-200"
                  >
                    {link.name}
                  </button>
                );
              }

              if (!link.path) {
                return null;
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-3 px-4 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
