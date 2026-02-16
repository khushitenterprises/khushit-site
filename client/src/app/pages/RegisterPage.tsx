import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/Button';
import { CheckCircle, Mail, Phone, Building, User, MapPin, MessageSquare } from 'lucide-react';
import { saveRegistration } from '../lib/firebase';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    city: '',
    message:''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        source: 'page'
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

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-12 text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Registration Successful!
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Thank you for registering, {formData.name}. We'll contact you soon at {formData.email} with more information about the exhibition.
          </p>
          <Button onClick={() => {
            setIsSubmitted(false);
            setFormData({
              name: '',
              company: '',
              phone: '',
              email: '',
              city: '',
              message: ''
            });
          }}>
            Register Another Visitor
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-primary/5 via-secondary to-accent">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Exhibition Visitor <span className="text-primary">Registration</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Register your details to visit our product exhibition and explore our complete range
            </p>
          </motion.div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="flex items-center gap-2 text-foreground mb-2">
                  <User className="w-5 h-5 text-primary" />
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Company Name */}
              <div>
                <label htmlFor="company" className="flex items-center gap-2 text-foreground mb-2">
                  <Building className="w-5 h-5 text-primary" />
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Enter your company name"
                />
              </div>

              {/* Phone & Email Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="flex items-center gap-2 text-foreground mb-2">
                    <Phone className="w-5 h-5 text-primary" />
                    Mobile Number (India) *
                  </label>
                  <div className="flex rounded-lg border border-border bg-input-background focus-within:ring-2 focus-within:ring-primary transition-all">
                    <span className="inline-flex items-center px-3 text-sm text-muted-foreground border-r border-border">
                      +91
                    </span>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        inputMode="numeric"
                        maxLength={10}
                        className="w-full px-4 py-3 bg-transparent focus:outline-none"
                        placeholder="9876543210"
                      />
                    </div>
                  <p className="text-xs text-muted-foreground mt-2">Enter a 10-digit mobile number.</p>
                </div>

                <div>
                  <label htmlFor="email" className="flex items-center gap-2 text-foreground mb-2">
                    <Mail className="w-5 h-5 text-primary" />
                    Email Address
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="flex items-center gap-2 text-foreground mb-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Enter your city"
                />
              </div>

              {/* Interested Category */}
           
              {/* Message */}
              <div>
                <label htmlFor="message" className="flex items-center gap-2 text-foreground mb-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Message / Requirements
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                  placeholder="Tell us about your requirements or any questions you have..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button type="submit" size="lg" className="w-full" disabled={isSaving}>
                  {isSaving ? 'Submitting...' : 'Submit Registration'}
                </Button>
              </div>

              {errorMessage && (
                <p className="text-sm text-red-600 text-center">{errorMessage}</p>
              )}

              <p className="text-sm text-muted-foreground text-center">
                By submitting this form, you agree to be contacted by Khushit regarding the exhibition.
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Exhibition Details',
                description: 'View our complete product range and meet our team'
              },
              {
                title: 'Product Samples',
                description: 'Experience the quality of our products firsthand'
              },
              {
                title: 'Business Opportunities',
                description: 'Explore partnership and distribution opportunities'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-xl p-6 shadow-md text-center"
              >
                <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
