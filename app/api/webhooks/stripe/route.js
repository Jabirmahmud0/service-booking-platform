import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import stripe from '@/lib/stripe';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { sendConfirmationEmail } from '@/lib/email';

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

    try {
      await connectDB();

      // Check if booking already processed (idempotency)
      const existingBooking = await Booking.findOne({
        stripeSessionId: session.id,
        status: 'confirmed',
      });

      if (existingBooking) {
        console.log('Booking already confirmed:', existingBooking.bookingRef);
        return NextResponse.json({ received: true });
      }

      // Update booking status
      const booking = await Booking.findOneAndUpdate(
        { stripeSessionId: session.id },
        { status: 'confirmed' },
        { new: true }
      ).populate('serviceId');

      if (booking) {
        // Send confirmation email
        if (!booking.emailSent) {
          const emailResult = await sendConfirmationEmail({
            to: booking.customerEmail,
            bookingRef: booking.bookingRef,
            serviceName: booking.serviceId?.name || session.metadata.serviceName,
            scheduledAt: booking.scheduledAt,
            amount: booking.amountPaid,
            customerName: booking.customerName,
          });

          if (emailResult.success) {
            await Booking.findByIdAndUpdate(booking._id, { emailSent: true });
          }
        }

        console.log('Booking confirmed:', booking.bookingRef);
      } else {
        // Create booking if it doesn't exist (fallback)
        const newBooking = await Booking.create({
          serviceId: session.metadata.serviceId,
          customerName: session.metadata.customerName,
          customerEmail: session.metadata.customerEmail,
          customerPhone: session.metadata.customerPhone,
          scheduledAt: new Date(session.metadata.scheduledAt),
          status: 'confirmed',
          stripeSessionId: session.id,
          amountPaid: session.amount_total,
          currency: session.currency,
        });

        // Send confirmation email
        await sendConfirmationEmail({
          to: newBooking.customerEmail,
          bookingRef: newBooking.bookingRef,
          serviceName: session.metadata.serviceName,
          scheduledAt: newBooking.scheduledAt,
          amount: newBooking.amountPaid,
          customerName: newBooking.customerName,
        });

        await Booking.findByIdAndUpdate(newBooking._id, { emailSent: true });

        console.log('New booking created from webhook:', newBooking.bookingRef);
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
      return NextResponse.json(
        { error: 'Error processing webhook' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
