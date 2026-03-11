'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, Calendar, Mail, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        // We'll use the existing bookings API but with a session filter
        const res = await fetch(`/api/bookings?stripeSessionId=${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.bookings && data.bookings.length > 0) {
            setBooking(data.bookings[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching booking success info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [sessionId]);

  const confettiColors = ['#2563EB', '#1E3A5F', '#16A34A', '#DBEAFE'];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="w-full max-w-2xl">
          {loading ? (
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#2563EB] mx-auto" />
              <p className="mt-4 text-[#6B7280]">Loading booking details...</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl border border-[#E2E8F0] p-8 md:p-12 text-center shadow-lg"
            >
              {/* Confetti Animation */}
              <div className="relative">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      opacity: 1, 
                      y: 0, 
                      x: 0,
                      scale: 0 
                    }}
                    animate={{ 
                      opacity: 0, 
                      y: -100 - Math.random() * 100,
                      x: (Math.random() - 0.5) * 200,
                      scale: 1,
                      rotate: Math.random() * 360
                    }}
                    transition={{ 
                      duration: 1 + Math.random() * 0.5, 
                      delay: Math.random() * 0.3,
                      ease: 'easeOut'
                    }}
                    className="absolute left-1/2 top-0 w-3 h-3 rounded-full"
                    style={{ 
                      backgroundColor: confettiColors[Math.floor(Math.random() * confettiColors.length)] 
                    }}
                  />
                ))}
              </div>

              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 200, 
                  damping: 15,
                  delay: 0.2 
                }}
                className="w-24 h-24 bg-[#DCFCE7] rounded-full flex items-center justify-center mx-auto mb-8"
              >
                <CheckCircle className="h-12 w-12 text-[#16A34A]" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-4"
              >
                Booking Confirmed!
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-[#6B7280] mb-8"
              >
                Thank you for your booking. A confirmation email has been sent to your inbox.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-[#F8FAFC] rounded-xl p-6 mb-8"
              >
                <p className="text-sm text-[#6B7280] mb-2">Booking Reference</p>
                <p className="text-2xl font-bold font-mono text-[#1E3A5F]">
                  #{booking?.bookingRef || (sessionId ? sessionId.slice(-8).toUpperCase() : 'DEMO01')}
                </p>
              </motion.div>

              {/* Info Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid md:grid-cols-2 gap-4 mb-8"
              >
                <div className="flex items-center gap-3 p-4 bg-[#DBEAFE] rounded-lg">
                  <Mail className="h-5 w-5 text-[#2563EB]" />
                  <div className="text-left">
                    <p className="text-sm text-[#2563EB] font-medium">Email Confirmation</p>
                    <p className="text-xs text-[#6B7280]">Check your inbox for details</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-[#DCFCE7] rounded-lg">
                  <Clock className="h-5 w-5 text-[#16A34A]" />
                  <div className="text-left">
                    <p className="text-sm text-[#16A34A] font-medium">Appointment Set</p>
                    <p className="text-xs text-[#6B7280]">We look forward to seeing you</p>
                  </div>
                </div>
              </motion.div>

              {/* Calendar Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button 
                  variant="outline"
                  className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Add to Calendar
                </Button>
                <Link href="/services">
                  <Button className="bg-[#2563EB] hover:bg-[#1E3A5F] text-white">
                    Book Another Service
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
