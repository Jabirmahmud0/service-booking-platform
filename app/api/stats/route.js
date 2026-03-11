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

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [stats] = await Booking.aggregate([
      {
        $match: { deleted: { $ne: true } }
      },
      {
        $facet: {
          todayBookings: [
            { $match: { scheduledAt: { $gte: today, $lt: tomorrow } } },
            { $count: 'count' }
          ],
          weeklyRevenue: [
            { 
              $match: { 
                createdAt: { $gte: weekAgo },
                status: { $in: ['confirmed', 'completed'] }
              } 
            },
            { $group: { _id: null, total: { $sum: '$amountPaid' } } }
          ],
          totalBookings: [
            { $count: 'count' }
          ],
          pendingBookings: [
            { $match: { status: 'pending' } },
            { $count: 'count' }
          ]
        }
      },
      {
        $project: {
          todayBookings: { $ifNull: [{ $arrayElemAt: ['$todayBookings.count', 0] }, 0] },
          weeklyRevenue: { $ifNull: [{ $arrayElemAt: ['$weeklyRevenue.total', 0] }, 0] },
          totalBookings: { $ifNull: [{ $arrayElemAt: ['$totalBookings.count', 0] }, 0] },
          pendingBookings: { $ifNull: [{ $arrayElemAt: ['$pendingBookings.count', 0] }, 0] }
        }
      }
    ]);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
