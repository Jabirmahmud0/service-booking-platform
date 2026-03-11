'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/booking/ServiceCard';

// Demo services data - in production this comes from MongoDB
const demoServices = [
  {
    _id: '1',
    name: 'Deep Tissue Massage',
    description: 'A therapeutic massage that focuses on realigning deeper layers of muscles and connective tissue.',
    price: 12000,
    duration: 60,
    category: 'Wellness',
    active: true,
  },
  {
    _id: '2',
    name: 'Business Consultation',
    description: 'One-on-one strategic consulting session for entrepreneurs and business owners.',
    price: 15000,
    duration: 45,
    category: 'Consulting',
    active: true,
  },
  {
    _id: '3',
    name: 'Personal Training Session',
    description: 'Customized fitness training tailored to your goals with a certified trainer.',
    price: 8000,
    duration: 60,
    category: 'Fitness',
    active: true,
  },
  {
    _id: '4',
    name: 'Hair Styling & Cut',
    description: 'Professional haircut and styling service with premium products.',
    price: 7500,
    duration: 45,
    category: 'Beauty',
    active: true,
  },
  {
    _id: '5',
    name: 'Photography Session',
    description: 'Professional portrait or event photography session with edited photos included.',
    price: 25000,
    duration: 120,
    category: 'Creative',
    active: true,
  },
  {
    _id: '6',
    name: 'Legal Consultation',
    description: 'Initial consultation with an experienced attorney for legal advice and guidance.',
    price: 20000,
    duration: 30,
    category: 'Legal',
    active: true,
  },
];

const categories = ['All', 'Wellness', 'Consulting', 'Fitness', 'Beauty', 'Creative', 'Legal'];

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch services from API
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setServices(data);
            setFilteredServices(data);
          } else {
            setServices(demoServices);
            setFilteredServices(demoServices);
          }
        } else {
          setServices(demoServices);
          setFilteredServices(demoServices);
        }
      } catch (error) {
        console.log('Using demo services');
        setServices(demoServices);
        setFilteredServices(demoServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    let result = services;

    if (activeCategory !== 'All') {
      result = result.filter((service) => service.category === activeCategory);
    }

    if (searchQuery) {
      result = result.filter(
        (service) =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredServices(result);
  }, [searchQuery, activeCategory, services]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#1E3A5F] to-[#2563EB]">
        <div className="mx-auto max-w-7xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white"
          >
            Our Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-white/80 max-w-2xl mx-auto"
          >
            Browse our catalog of professional services and book your appointment today.
          </motion.p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-b">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
              <Input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#F8FAFC] border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className={
                    activeCategory === category
                      ? 'bg-[#2563EB] text-white hover:bg-[#1E3A5F]'
                      : 'border-[#E2E8F0] text-[#6B7280] hover:border-[#2563EB] hover:text-[#2563EB]'
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-[#E2E8F0] p-6 animate-pulse"
                >
                  <div className="h-6 w-20 bg-[#E2E8F0] rounded-full mb-4" />
                  <div className="h-6 w-3/4 bg-[#E2E8F0] rounded mb-2" />
                  <div className="h-4 w-full bg-[#E2E8F0] rounded mb-6" />
                  <div className="h-10 w-full bg-[#E2E8F0] rounded" />
                </div>
              ))}
            </div>
          ) : filteredServices.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredServices.map((service, index) => (
                <ServiceCard key={service._id} service={service} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Filter className="h-12 w-12 text-[#6B7280] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">
                No services found
              </h3>
              <p className="text-[#6B7280]">
                Try adjusting your search or filter criteria.
              </p>
              <Button
                variant="outline"
                className="mt-4 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
