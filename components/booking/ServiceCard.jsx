'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, DollarSign, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ServiceCard({ service, index = 0 }) {
  const formattedPrice = (service.price / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.08,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 20px 40px -15px rgba(30, 58, 95, 0.15)'
      }}
      className="group relative bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden transition-all duration-300"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1E3A5F] to-[#2563EB] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      
      <div className="p-6">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-[#DBEAFE] text-[#2563EB] rounded-full">
            {service.category || 'General'}
          </span>
        </div>
        
        <h3 className="text-xl font-semibold text-[#1F2937] mb-2 group-hover:text-[#2563EB] transition-colors">
          {service.name}
        </h3>
        
        <p className="text-sm text-[#6B7280] mb-6 line-clamp-2">
          {service.description}
        </p>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
            <Clock className="h-4 w-4" />
            <span>{service.duration} min</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-[#1E3A5F]">
            <DollarSign className="h-4 w-4" />
            <span>{formattedPrice}</span>
          </div>
        </div>
        
        <Link href={`/book/${service._id}`}>
          <Button className="w-full bg-[#2563EB] hover:bg-[#1E3A5F] text-white group/btn">
            <span>Book Now</span>
            <ArrowRight className="ml-2 h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
