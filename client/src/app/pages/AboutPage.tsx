import { motion } from 'motion/react';
import { Factory, Users, TrendingUp, Award, CheckCircle, Target } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-primary/5 via-secondary to-accent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              About <span className="text-primary">Khushit</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A trusted name in personal care and household products, committed to quality, hygiene, and customer satisfaction.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Our Story
              </h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Khushit Enterprise began its journey in 2005 with the trading of Khushboodeep and Khushit products, laying a strong foundation built on quality, reliability, and customer trust. From the very beginning, the company focused on understanding market needs and delivering products that met consistent quality standards. This early experience in trading helped establish strong relationships with distributors and retailers across the region.
              </p>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
               With years of hands-on market knowledge and growing consumer demand, Khushit Enterprise took a significant step forward in 2019 by entering the cosmetic manufacturing sector. This transition marked a new phase of growth, allowing the company to develop and manufacture its own range of personal care and household products. By maintaining strict quality control and focusing on effective formulations, Khushit Enterprise steadily strengthened its manufacturing capabilities.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative min-h-[320px] sm:min-h-[380px] rounded-3xl shadow-2xl overflow-hidden bg-white border border-gray-100">
                <img
                  src="/ab-about.jpeg"
                  alt="Khushit manufacturing facility"
                  className="h-full w-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-8 space-y-4"
          >
            <p className="text-lg text-muted-foreground leading-relaxed">
              In 2022, the company further expanded its operations by scaling up production and strengthening its soap manufacturing department.  Today, the company manufactures a diverse portfolio of products, including detergents, fabric conditioners, air fresheners, hair oils, handwash liquids, shampoos, and other essential toiletries.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Khushit Enterprise has built a strong and reliable distribution network, with its products now available in more than 200 outlets across Gujarat. This widespread presence reflects the trust placed in the brand by retailers and consumers alike. Guided by a commitment to quality, innovation, and long-term partnerships, Khushit Enterprise continues to grow with the aim of delivering value-driven products that meet everyday consumer needs while expanding its reach in the Indian market.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To become a leading manufacturer of premium personal care and household products, recognized globally for our commitment to quality, innovation, and customer satisfaction.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white mb-6">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To manufacture and deliver high-quality, affordable products that enhance daily living while maintaining the highest standards of manufacturing excellence and environmental responsibility.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Manufacturing Excellence */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Manufacturing Excellence
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our state-of-the-art facilities and quality control processes ensure consistent product excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Factory className="w-8 h-8" />,
                title: 'Modern Facilities',
                description: 'State-of-the-art manufacturing units'
              },
              {
                icon: <CheckCircle className="w-8 h-8" />,
                title: 'Quality Control',
                description: 'Rigorous testing at every stage'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Expert Team',
                description: 'Skilled professionals and technicians'
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Continuous Innovation',
                description: 'R&D focused on improvement'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Standards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Quality Standards & Certifications
              </h2>
              <div className="space-y-4">
                {[
                  'ISO certified manufacturing processes',
                  'GMP (Good Manufacturing Practices) compliance',
                  'Regular quality audits and inspections',
                  'Strict adherence to safety regulations',
                  'Environmental sustainability practices',
                  'Ethical sourcing of raw materials'
                ].map((standard, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-lg text-muted-foreground">{standard}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { number: '8+', label: 'Product Categories' },
                { number: '100+', label: 'Products' },
                { number: '20+', label: 'Years Experience' },
                { number: '100000+', label: 'Happy Customers' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg text-center"
                >
                  <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Story Timeline */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-muted-foreground">
              Building trust through quality and consistency
            </p>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                year: '2005',
                title: 'Foundation',
                description: 'Started trading Khushboodeep and Khushit products.'
              },
              {
                year: '2012',
                title: 'Detergents Category',
                description: 'Added the detergents category to our product portfolio.'
              },
              {
                year: '2019',
                title: 'Manufacturing Start',
                description: 'Starting of cosmetic manufacturing.'
              },
              {
                year: '2022',
                title: 'Scale-up & Expansion',
                description: 'Scale-up and expansion of soap department.'
              },
              {
                year: '2026',
                title: 'Present Day',
                description: 'Leading manufacturer with 100+ products across 8 categories'
              }
            ].map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0 w-24 text-right">
                  <span className="text-2xl font-bold text-primary">{milestone.year}</span>
                </div>
                <div className="relative flex-1 bg-white rounded-xl p-6 shadow-md border-l-4 border-primary">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{milestone.title}</h3>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

