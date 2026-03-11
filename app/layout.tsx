import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-jetbrains-mono'
});

export const metadata: Metadata = {
  title: 'BookEase - Service Booking Platform',
  description: 'Book services easily with secure payment and instant confirmation. Zero-friction booking for modern service businesses.',
  keywords: ['booking', 'services', 'appointments', 'scheduling', 'payments'],
  authors: [{ name: 'BookEase' }],
  openGraph: {
    title: 'BookEase - Service Booking Platform',
    description: 'Book services easily with secure payment and instant confirmation.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1E3A5F',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
