import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Today's bookings
    const todayBookings = await Booking.countDocuments({
      scheduledAt: { $gte: today, $lt: tomorrow },
      deleted: { $ne: true },
    });

    // Weekly revenue (confirmed + completed bookings)
    const weeklyBookings = await Booking.find({
      createdAt: { $gte: weekAgo },
      status: { $in: ['confirmed', 'completed'] },
      deleted: { $ne: true },
    });
    const weeklyRevenue = weeklyBookings.reduce((sum, b) => sum + b.amountPaid, 0);

    // Total bookings
    const totalBookings = await Booking.countDocuments({
      deleted: { $ne: true },
    });

    // Pending bookings
    const pendingBookings = await Booking.countDocuments({
      status: 'pending',
      deleted: { $ne: true },
    });

    return NextResponse.json({
      todayBookings,
      weeklyRevenue,
      totalBookings,
      pendingBookings,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
