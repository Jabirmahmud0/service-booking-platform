'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  CreditCard,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import Navbar from '@/components/Navbar';

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 500 : -500,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 500 : -500,
    opacity: 0,
  }),
};

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '01:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM'
];

export default function BookingPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`/api/services/${resolvedParams.serviceId}`);
        if (res.ok) {
          const data = await res.json();
          setService(data);
        } else {
          console.error('Service not found');
          setService(null);
        }
      } catch (error) {
        console.error('Error fetching service:', error);
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [resolvedParams.serviceId]);

  const validateStep1 = () => {
    if (!selectedDate) {
      setErrors({ date: 'Please select a date' });
      return false;
    }
    if (!selectedTime) {
      setErrors({ time: 'Please select a time slot' });
      return false;
    }
    setErrors({});
    return true;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToNextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setDirection(1);
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const goToPrevStep = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Combine date and time
      const [time, period] = selectedTime.split(' ');
      const [hours, minutes] = time.split(':');
      let hour = parseInt(hours);
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      
      const scheduledAt = new Date(selectedDate);
      scheduledAt.setHours(hour, parseInt(minutes), 0, 0);

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service._id,
          serviceName: service.name,
          servicePrice: service.price,
          scheduledAt: scheduledAt.toISOString(),
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
        }),
      });

      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setErrors({ submit: 'Failed to create checkout session. Please try again.' });
      setIsSubmitting(false);
    }
  };

  const formattedPrice = service
    ? (service.price / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })
    : '$0.00';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.push('/services')}
            className="mb-6 text-[#6B7280] hover:text-[#1F2937]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Button>

          {/* Service Info Card */}
          {!service ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-red-100 p-8 mb-8 text-center"
            >
              <h1 className="text-2xl font-bold text-[#1F2937] mb-2">Service Not Found</h1>
              <p className="text-[#6B7280] mb-6">The service you are looking for does not exist or has been removed.</p>
              <Button onClick={() => router.push('/services')} className="bg-[#2563EB] hover:bg-[#1E3A5F]">
                Browse Other Services
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-[#DBEAFE] text-[#2563EB] rounded-full mb-2">
                    {service?.category || 'General'}
                  </span>
                  <h1 className="text-2xl font-bold text-[#1F2937]">{service?.name}</h1>
                  <p className="text-[#6B7280] mt-1">{service?.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm text-[#6B7280]">Duration</p>
                    <p className="text-lg font-semibold text-[#1E3A5F]">{service?.duration} min</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-[#6B7280]">Price</p>
                    <p className="text-2xl font-bold text-[#2563EB]">{formattedPrice}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {service && (
            <>
              {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    s === step
                      ? 'bg-[#2563EB] text-white'
                      : s < step
                      ? 'bg-[#16A34A] text-white'
                      : 'bg-[#E2E8F0] text-[#6B7280]'
                  }`}
                >
                  {s < step ? <CheckCircle className="h-5 w-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-colors ${
                      s < step ? 'bg-[#16A34A]' : 'bg-[#E2E8F0]'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Labels */}
          <div className="flex justify-between mb-8 px-4">
            <span className={`text-sm ${step === 1 ? 'text-[#2563EB] font-medium' : 'text-[#6B7280]'}`}>
              Date & Time
            </span>
            <span className={`text-sm ${step === 2 ? 'text-[#2563EB] font-medium' : 'text-[#6B7280]'}`}>
              Your Details
            </span>
            <span className={`text-sm ${step === 3 ? 'text-[#2563EB] font-medium' : 'text-[#6B7280]'}`}>
              Confirm & Pay
            </span>
          </div>

          {/* Step Content */}
          <motion.div
            className="bg-white rounded-2xl border border-[#E2E8F0] p-8 min-h-[400px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnimatePresence mode="wait" custom={direction}>
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <h2 className="text-xl font-semibold text-[#1F2937] mb-6 flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-[#2563EB]" />
                    Select Date & Time
                  </h2>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <Label className="mb-2 block text-[#1F2937]">Choose a Date</Label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date() || date.getDay() === 0}
                        className="rounded-lg border border-[#E2E8F0]"
                      />
                      {errors.date && (
                        <p className="text-sm text-red-500 mt-2">{errors.date}</p>
                      )}
                    </div>

                    <div>
                      <Label className="mb-2 block text-[#1F2937]">Choose a Time</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                              selectedTime === time
                                ? 'bg-[#2563EB] text-white'
                                : 'bg-[#F8FAFC] text-[#1F2937] hover:bg-[#DBEAFE]'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                      {errors.time && (
                        <p className="text-sm text-red-500 mt-2">{errors.time}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <h2 className="text-xl font-semibold text-[#1F2937] mb-6 flex items-center gap-2">
                    <User className="h-5 w-5 text-[#2563EB]" />
                    Your Details
                  </h2>

                  <div className="space-y-6 max-w-md">
                    <div>
                      <Label htmlFor="name" className="mb-2 block text-[#1F2937]">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
                          className="pl-10 bg-[#F8FAFC] border-[#E2E8F0] focus:border-[#2563EB]"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email" className="mb-2 block text-[#1F2937]">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                          className="pl-10 bg-[#F8FAFC] border-[#E2E8F0] focus:border-[#2563EB]"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone" className="mb-2 block text-[#1F2937]">
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 (555) 123-4567"
                          className="pl-10 bg-[#F8FAFC] border-[#E2E8F0] focus:border-[#2563EB]"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <h2 className="text-xl font-semibold text-[#1F2937] mb-6 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-[#2563EB]" />
                    Review & Confirm
                  </h2>

                  <div className="bg-[#F8FAFC] rounded-xl p-6 space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-[#E2E8F0]">
                      <span className="text-[#6B7280]">Service</span>
                      <span className="font-semibold text-[#1F2937]">{service?.name}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-[#E2E8F0]">
                      <span className="text-[#6B7280]">Date</span>
                      <span className="font-semibold text-[#1F2937]">
                        {selectedDate?.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-[#E2E8F0]">
                      <span className="text-[#6B7280]">Time</span>
                      <span className="font-semibold text-[#1F2937]">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-[#E2E8F0]">
                      <span className="text-[#6B7280]">Duration</span>
                      <span className="font-semibold text-[#1F2937]">{service?.duration} minutes</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-[#E2E8F0]">
                      <span className="text-[#6B7280]">Name</span>
                      <span className="font-semibold text-[#1F2937]">{formData.name}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-[#E2E8F0]">
                      <span className="text-[#6B7280]">Email</span>
                      <span className="font-semibold text-[#1F2937]">{formData.email}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-semibold text-[#1F2937]">Total</span>
                      <span className="text-2xl font-bold text-[#2563EB]">{formattedPrice}</span>
                    </div>
                  </div>

                  {errors.submit && (
                    <p className="text-sm text-red-500 mt-4">{errors.submit}</p>
                  )}

                  <p className="text-sm text-[#6B7280] mt-6">
                    By clicking &ldquo;Confirm & Pay&rdquo;, you agree to our terms of service. 
                    You will be redirected to Stripe for secure payment.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button
                variant="outline"
                onClick={goToPrevStep}
                className="border-[#E2E8F0] text-[#6B7280] hover:bg-[#F8FAFC]"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button
                onClick={goToNextStep}
                className="bg-[#2563EB] hover:bg-[#1E3A5F] text-white"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#2563EB] hover:bg-[#1E3A5F] text-white min-w-[160px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Confirm & Pay
                  </>
                )}
              </Button>
            )}
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
