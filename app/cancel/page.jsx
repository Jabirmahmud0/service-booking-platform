'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { XCircle, ArrowLeft, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg bg-white rounded-3xl border border-[#E2E8F0] p-8 md:p-12 text-center shadow-lg"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-20 h-20 bg-[#FEE2E2] rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <XCircle className="h-10 w-10 text-[#DC2626]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl font-bold text-[#1F2937] mb-4"
          >
            Payment Cancelled
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-[#6B7280] mb-8"
          >
            Your payment was not completed. No charges have been made to your account.
            Feel free to try again or contact us if you need assistance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Link href="/services">
              <Button className="bg-[#2563EB] hover:bg-[#1E3A5F] text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                className="border-[#E2E8F0] text-[#6B7280] hover:bg-[#F8FAFC]"
              >
                Back to Home
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pt-6 border-t border-[#E2E8F0]"
          >
            <p className="text-sm text-[#6B7280] mb-3">Need help? Contact us:</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <a
                href="mailto:support@bookease.app"
                className="flex items-center justify-center gap-2 text-[#2563EB] hover:underline"
              >
                <Mail className="h-4 w-4" />
                support@bookease.app
              </a>
              <a
                href="tel:+15551234567"
                className="flex items-center justify-center gap-2 text-[#2563EB] hover:underline"
              >
                <Phone className="h-4 w-4" />
                +1 (555) 123-4567
              </a>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
