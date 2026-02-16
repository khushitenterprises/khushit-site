import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './Button';
import { CheckCircle, Mail, Phone, Building, User, MapPin, MessageSquare, X } from 'lucide-react';
import { saveRegistration } from '../lib/firebase';

type RegistrationModalProps = {
  isOpen: boolean;
  onComplete: () => void;
  onCancel: () => void;
};

export function RegistrationModal({ isOpen, onComplete, onCancel }: RegistrationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    city: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setIsSubmitted(false);
      setFormData({
        name: '',
        company: '',
        phone: '',
        email: '',
        city: '',
        message: ''
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData({
      ...formData,
      phone: digitsOnly
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSaving(true);
    try {
      const phoneValue = formData.phone.trim();
      if (!/^\d{10}$/.test(phoneValue)) {
        setErrorMessage('Please enter a valid 10-digit mobile number.');
        setIsSaving(false);
        return;
      }
      await saveRegistration({
        ...formData,
        source: 'modal'
      });
      setIsSubmitted(true);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Sorry, we could not submit your registration. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleContinue = () => {
    onComplete();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

          <motion.div
            className="relative w-full max-w-3xl max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="max-h-[85vh] overflow-y-auto p-6 sm:p-10">
            <button
              type="button"
              aria-label="Close"
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
              onClick={onCancel}
            >
              <X className="h-5 w-5" />
            </button>

            {!isSubmitted && (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    Exhibition Visitor <span className="text-primary">Registration</span>
                  </h2>
                  <p className="text-muted-foreground">
                    Please fill this form to access the full site.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="modal-name" className="flex items-center gap-2 text-foreground mb-2">
                      <User className="w-5 h-5 text-primary" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="modal-name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="modal-company" className="flex items-center gap-2 text-foreground mb-2">
                      <Building className="w-5 h-5 text-primary" />
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="modal-company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      placeholder="Enter your company name"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="modal-phone" className="flex items-center gap-2 text-foreground mb-2">
                        <Phone className="w-5 h-5 text-primary" />
                        Mobile Number (India) *
                      </label>
                      <div className="flex rounded-lg border border-border bg-input-background focus-within:ring-2 focus-within:ring-primary transition-all">
                        <span className="inline-flex items-center px-3 text-sm text-muted-foreground border-r border-border">
                          +91
                        </span>
                        <input
                          type="tel"
                          id="modal-phone"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          inputMode="numeric"
                          maxLength={10}
                          className="w-full px-4 py-3 bg-transparent focus:outline-none"
                          placeholder="8140012602"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Enter a 10-digit mobile number.</p>
                    </div>

                    <div>
                      <label htmlFor="modal-email" className="flex items-center gap-2 text-foreground mb-2">
                        <Mail className="w-5 h-5 text-primary" />
                        Email Address
                      </label>
                      <input
                        type="text"
                        id="modal-email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="modal-city" className="flex items-center gap-2 text-foreground mb-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      City
                    </label>
                    <input
                      type="text"
                      id="modal-city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      placeholder="Enter your city"
                    />
                  </div>

                  <div>
                    <label htmlFor="modal-message" className="flex items-center gap-2 text-foreground mb-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      Message / Requirements
                    </label>
                    <textarea
                      id="modal-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                      placeholder="Tell us about your requirements or any questions you have..."
                    />
                  </div>

                  <div className="pt-2">
                    <Button type="submit" size="lg" className="w-full" disabled={isSaving}>
                      {isSaving ? 'Submitting...' : 'Submit Registration'}
                    </Button>
                  </div>
                  {errorMessage && (
                    <p className="text-sm text-red-600 text-center">{errorMessage}</p>
                  )}
                </form>
              </>
            )}

            {isSubmitted && (
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Registration Successful!
                </h3>
                <p className="text-muted-foreground mb-6">
                  Thank you, {formData.name}. You can now explore the full site.
                </p>
                <Button onClick={handleContinue} size="lg">
                  Continue to Site
                </Button>
              </div>
            )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
