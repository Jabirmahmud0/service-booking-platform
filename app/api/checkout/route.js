import { NextResponse } from 'next/server';
import stripe from '@/lib/stripe';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      serviceId,
      serviceName,
      servicePrice,
      scheduledAt,
      customerName,
      customerEmail,
      customerPhone,
    } = body;
    
    // Connect to database early to fail fast if auth/connection is broken
    try {
      await connectDB();
      console.log('Database connected successfully');
    } catch (dbError) {
      console.error('CRITICAL: Database connection failed:', dbError.message);
      return NextResponse.json(
        { 
          error: 'Database connection failed', 
          details: dbError.message,
          hint: 'Check your MONGODB_URI in .env.local. Ensure the password and database name are correct.'
        },
        { status: 503 }
      );
    }

    // Validate required fields
    if (!serviceId || !serviceName || !servicePrice || !scheduledAt || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: serviceName,
              description: `Appointment on ${new Date(scheduledAt).toLocaleDateString()}`,
            },
            unit_amount: servicePrice,
          },
          quantity: 1,
        },
      ],
      customer_email: customerEmail,
      success_url: `${process.env.NEXT_PUBLIC_URL || 'https://service-booking-platform-bay.vercel.app'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'https://service-booking-platform-bay.vercel.app'}/cancel`,
      metadata: {
        serviceId,
        serviceName,
        scheduledAt,
        customerName,
        customerEmail,
        customerPhone,
      },
    });

    // Create pending booking
    try {
      await Booking.create({
        serviceId,
        customerName,
        customerEmail,
        customerPhone,
        scheduledAt: new Date(scheduledAt),
        status: 'pending',
        stripeSessionId: session.id,
        amountPaid: servicePrice,
        currency: 'usd',
      });
      console.log('Pending booking created:', session.id);
    } catch (dbError) {
      console.error('Error creating pending booking:', dbError.message);
      // We don't fail here because the session is already created, 
      // but we log it for the webhook fallback.
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
