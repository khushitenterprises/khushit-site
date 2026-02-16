import { Mail, Phone, MapPin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

type FooterProps = {
  onRegisterClick?: () => void;
};

export function Footer({ onRegisterClick }: FooterProps) {
  return (
    <footer id="contact" className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold">Khushit</span>
            </div>
            <p className="text-gray-300 mb-4">
              Quality personal care and household products for a healthier, happier life.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/products" className="text-gray-300 hover:text-primary transition-colors">Products</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-primary transition-colors">About Us</Link></li>
              <li>
                {onRegisterClick ? (
                  <button
                    type="button"
                    onClick={onRegisterClick}
                    className="text-gray-300 hover:text-primary transition-colors"
                  >
                    Register
                  </button>
                ) : (
                  <Link to="/register" className="text-gray-300 hover:text-primary transition-colors">Register</Link>
                )}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/products/bath-soaps" className="text-gray-300 hover:text-primary transition-colors">Bath Soaps</Link></li>
              <li><Link to="/products/detergents" className="text-gray-300 hover:text-primary transition-colors">Detergents</Link></li>
              <li><Link to="/products/shampoo" className="text-gray-300 hover:text-primary transition-colors">Shampoo</Link></li>
              <li><Link to="/products/toiletries" className="text-gray-300 hover:text-primary transition-colors">Toiletries</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://maps.app.goo.gl/w3pZYxYkTHvA86ZQ6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 hover:text-primary transition-colors"
                >
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">27/28, Shubh Industries, Parab, Surat.</span>
                </a>
              </li>
              <li>
                <a href="tel:+918140074714" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-gray-300">+91 8140074714</span>
                </a>
              </li>
              <li>
                <a href="mailto:khushitenterprises@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-gray-300">khushitenterprises@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/khushit.in?igsh=ZzVneGd1Y245dHl1&utm_source=qr"
              className="w-10 h-10 rounded-full bg-gray-700 hover:bg-primary flex items-center justify-center transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>

          <p className="text-gray-400 text-sm">(c) 2026 Khushit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
