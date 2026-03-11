import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Service from '@/models/Service';
import { auth } from '@/lib/auth';

// GET - Fetch all bookings (admin only)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const stripeSessionId = searchParams.get('stripeSessionId');
    const session = await auth();
    
    // Only require auth if we're not fetching a specific result by stripeSessionId
    if (!session && !stripeSessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const status = searchParams.get('status');
    const sort = searchParams.get('sort') || '-createdAt';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;

    await connectDB();

    const query = { $or: [{ deleted: false }, { deleted: { $exists: false } }] };
    if (status && status !== 'all') {
      query.status = status;
    }
    if (stripeSessionId) {
      query.stripeSessionId = stripeSessionId;
    }

    const totalCount = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('serviceId')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      bookings,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
