'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Calendar, 
  CreditCard, 
  Mail, 
  Shield, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const features = [
  {
    icon: Calendar,
    title: 'Easy Scheduling',
    description: 'Pick your preferred date and time slot with our intuitive calendar interface.',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'Pay safely with Stripe. Your card details never touch our servers.',
  },
  {
    icon: Mail,
    title: 'Instant Confirmation',
    description: 'Receive immediate email confirmation with all your booking details.',
  },
  {
    icon: Shield,
    title: 'Trusted & Reliable',
    description: 'Join thousands of satisfied customers who book with confidence.',
  },
];

const stats = [
  { value: '10K+', label: 'Bookings Made' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9/5', label: 'Customer Rating' },
  { value: '24/7', label: 'Support' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F] via-[#1E3A5F] to-[#2563EB] opacity-[0.03]" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-[#2563EB] rounded-full blur-[120px] opacity-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#1E3A5F] rounded-full blur-[100px] opacity-10" />
        
        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#DBEAFE] rounded-full mb-8"
            >
              <Sparkles className="h-4 w-4 text-[#2563EB]" />
              <span className="text-sm font-medium text-[#2563EB]">
                Trusted by 10,000+ customers
              </span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1F2937] leading-tight text-balance">
              Book Services{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#1E3A5F]">
                Effortlessly
              </span>
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl text-[#6B7280] max-w-2xl mx-auto text-pretty">
              Schedule appointments, pay securely, and get instant confirmations. 
              The modern way to book services online.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/services">
                <Button 
                  size="lg" 
                  className="bg-[#2563EB] hover:bg-[#1E3A5F] text-white px-8 py-6 text-lg shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
                >
                  Browse Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white px-8 py-6 text-lg"
                >
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-[#1E3A5F]">{stat.value}</div>
                <div className="mt-1 text-sm text-[#6B7280]">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937]">
              Why Choose BookEase?
            </h2>
            <p className="mt-4 text-lg text-[#6B7280] max-w-2xl mx-auto">
              Everything you need for seamless service booking in one powerful platform.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="relative p-8 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] group hover:border-[#2563EB] transition-colors"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#DBEAFE] text-[#2563EB] mb-6 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-[#1F2937] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#6B7280]">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937]">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-[#6B7280] max-w-2xl mx-auto">
              Book your appointment in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                step: '01', 
                icon: Zap,
                title: 'Choose a Service', 
                description: 'Browse our catalog and select the service that fits your needs.' 
              },
              { 
                step: '02', 
                icon: Clock,
                title: 'Pick Your Time', 
                description: 'Select a convenient date and time slot from our calendar.' 
              },
              { 
                step: '03', 
                icon: CheckCircle,
                title: 'Confirm & Pay', 
                description: 'Complete secure payment and receive instant confirmation.' 
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <div className="text-center p-8">
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1E3A5F] to-[#2563EB] flex items-center justify-center">
                      <item.icon className="h-10 w-10 text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#DBEAFE] text-[#2563EB] font-bold text-sm flex items-center justify-center">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#1F2937] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[#6B7280]">
                    {item.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 w-8 h-0.5 bg-[#E2E8F0] transform translate-x-4" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-5xl bg-gradient-to-br from-[#1E3A5F] to-[#2563EB] rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
          
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
              <Users className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">
                Join our community
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-balance">
              Ready to Streamline Your Bookings?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Start booking services today and experience the simplicity of modern scheduling.
            </p>
            <Link href="/services">
              <Button 
                size="lg" 
                className="bg-white text-[#1E3A5F] hover:bg-[#F8FAFC] px-8 py-6 text-lg font-semibold"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
