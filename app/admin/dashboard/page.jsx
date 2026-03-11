'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarDays, 
  DollarSign, 
  TrendingUp, 
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Badge } from '@/components/ui/badge';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    todayBookings: 0,
    weeklyRevenue: 0,
    totalBookings: 0,
    pendingBookings: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch stats and recent bookings in parallel
        const [statsRes, bookingsRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/bookings?limit=5')
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setRecentBookings(bookingsData.bookings || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const kpiCards = [
    {
      title: "Today's Bookings",
      value: stats.todayBookings,
      icon: CalendarDays,
      color: 'bg-blue-500',
    },
    {
      title: 'Weekly Revenue',
      value: `$${(stats.weeklyRevenue / 100).toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      title: 'Pending',
      value: stats.pendingBookings,
      icon: Clock,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminSidebar />

      <main className="lg:ml-64 p-6 pt-20 lg:pt-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1F2937]">Dashboard</h1>
            <p className="text-[#6B7280] mt-1">
              Welcome back! Here is an overview of your business.
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.color}`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-sm text-[#6B7280] mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-[#1F2937]">
                  {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : card.value}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm"
          >
            <div className="p-6 border-b border-[#E2E8F0]">
              <h2 className="text-xl font-semibold text-[#1F2937]">Recent Bookings</h2>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#2563EB] mx-auto" />
              </div>
            ) : recentBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F8FAFC]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                        Reference
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {recentBookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-[#F8FAFC]">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono text-sm text-[#1E3A5F]">
                            #{booking.bookingRef}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-[#1F2937]">
                              {booking.customerName}
                            </p>
                            <p className="text-xs text-[#6B7280]">
                              {booking.customerEmail}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1F2937]">
                          {booking.serviceId?.name || 'Service'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                          {new Date(booking.scheduledAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={statusColors[booking.status]}>
                            {booking.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-[#6B7280]">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No bookings yet</p>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
