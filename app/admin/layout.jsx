import { SessionProvider } from 'next-auth/react';

export const metadata = {
  title: 'Admin Dashboard - BookEase',
  description: 'BookEase admin dashboard for managing bookings and services',
};

export default function AdminLayout({ children }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
