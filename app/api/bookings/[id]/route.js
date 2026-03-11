import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { auth } from '@/lib/auth';
import { sendCancellationEmail } from '@/lib/email';

// GET - Fetch a single booking (admin only)
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const booking = await Booking.findById(id).populate('serviceId');

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

// PATCH - Update booking status (admin only)
export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, notes } = body;

    await connectDB();

    const previousBooking = await Booking.findById(id).populate('serviceId');
    
    if (!previousBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { 
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
      { new: true }
    ).populate('serviceId');

    // Send cancellation email if status changed to cancelled
    if (status === 'cancelled' && previousBooking.status !== 'cancelled') {
      await sendCancellationEmail({
        to: booking.customerEmail,
        bookingRef: booking.bookingRef,
        serviceName: booking.serviceId?.name || 'Service',
        scheduledAt: booking.scheduledAt,
        customerName: booking.customerName,
      });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete a booking (admin only)
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const booking = await Booking.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
}
