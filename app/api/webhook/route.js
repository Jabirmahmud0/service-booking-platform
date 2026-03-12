import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import stripe from '@/lib/stripe';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import Booking from '@/models/Booking';
import { sendConfirmationEmail } from '@/lib/email';

// Disable Next.js body parser to read raw body for Stripe signature verification
export const runtime = 'nodejs';

export async function POST(request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    console.log('Processing checkout.session.completed for session:', session.id);

    try {
      try {
        await connectDB();
      } catch (dbConnError) {
        console.error('Webhook: Database connection failed. Proceeding with email only.', dbConnError.message);
      }

      // 1. Database Operations (Try-Catch)
      let booking = null;
      try {
        if (mongoose.connection.readyState === 1) { // Only if connected
          // Check if booking already processed (idempotency)
          const existingBooking = await Booking.findOne({
            stripeSessionId: session.id,
            status: 'confirmed',
          });

          if (existingBooking) {
            console.log('Booking already confirmed:', existingBooking.bookingRef);
            return NextResponse.json({ received: true });
          }

          booking = await Booking.findOne({ stripeSessionId: session.id });

          if (booking) {
            booking.status = 'confirmed';
            await booking.save();
            console.log('Existing booking updated to confirmed');
          } else {
            booking = await Booking.create({
              customerName: session.metadata.customerName,
              customerEmail: session.metadata.customerEmail,
              customerPhone: session.metadata.customerPhone,
              scheduledAt: new Date(session.metadata.scheduledAt),
              status: 'confirmed',
              stripeSessionId: session.id,
              amountPaid: session.amount_total || parseInt(session.metadata.servicePrice),
              currency: session.currency || 'usd',
              serviceId: session.metadata.serviceId,
            });
            console.log('New booking created from webhook fallback');
          }
        }
      } catch (dbError) {
        console.error('Webhook: Database operation failed:', dbError.message);
      }

      // 2. Email Delivery (Always attempt if we have data)
      const emailTo = booking?.customerEmail || session.metadata.customerEmail || session.customer_details?.email;
      const bookingRef = booking?.bookingRef || session.id.slice(-8).toUpperCase();

      if (emailTo) {
        try {
          console.log('Attempting resilient email delivery to:', emailTo);
          const emailResult = await sendConfirmationEmail({
            to: emailTo,
            bookingRef: bookingRef,
            serviceName: session.metadata.serviceName || 'Service',
            scheduledAt: booking?.scheduledAt || new Date(session.metadata.scheduledAt),
            amount: booking?.amountPaid || session.amount_total,
            customerName: booking?.customerName || session.metadata.customerName,
          });

          if (emailResult.success && booking && mongoose.connection.readyState === 1) {
            booking.emailSent = true;
            await booking.save();
          }
          console.log('Resilient email delivery status:', emailResult.success);
        } catch (emailError) {
          console.error('Webhook: Resilient email delivery failed:', emailError.message);
        }
      }

    } catch (error) {
      console.error('Error processing webhook:', error.message);
      return NextResponse.json(
        { error: 'Error processing webhook' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
