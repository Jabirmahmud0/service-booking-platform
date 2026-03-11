# 🚀 BookEase - Premium Service Booking Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue) ![Status](https://img.shields.io/badge/status-Active%20Development-green) ![Delivery](https://img.shields.io/badge/delivery-Vercel-orange)

BookEase is a production-grade service booking platform designed for modern businesses. It features a polished, mobile-first UI with smooth animations, secure Stripe payments, and a powerful real-time Admin Panel.

---

## ✨ Key Features

### 🛡️ Customer Experience
- **Multi-step Booking Flow**: Smooth Date/Time selection and customer detail entry.
- **Secure Payments**: Fully integrated with **Stripe Checkout Sessions**.
- **Instant Confirmation**: Automated email notifications powered by **Nodemailer/Gmail**.
- **Mobile-First Design**: Fully responsive across all devices (320px to 1440px+).

### 🛠️ Admin Panel
- **Real-time Dashboard**: KPI cards for weekly revenue, today's bookings, and total volume.
- **Booking Management**: View, Filter (by status), and Update (Confirm/Complete/Cancel) bookings.
- **Soft-Delete**: Securely remove invalid bookings with a single click.
- **Service Catalog CRUD**: Add, Edit, and Manage services with image support.
- **Secure Authentication**: Credentials-based login using **Auth.js (NextAuth v5)**.

### 📧 Email Notifications
- **Booking Confirmation**: Beautiful HTML emails with booking details.
- **Cancellation Notices**: Automated emails for cancelled bookings.
- **Dev Mode Support**: Mock email logging for local development.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS v4, TypeScript
- **Animation**: Framer Motion 11, Lucide Icons
- **Backend**: Next.js API Routes, MongoDB Atlas, Mongoose
- **Payments**: Stripe SDK + Webhooks
- **Email**: Nodemailer + Gmail SMTP
- **Auth**: Auth.js (NextAuth v5)
- **Deployment**: Vercel

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- MongoDB Atlas Account
- Stripe Account (for API keys)
- Gmail App Password (for email delivery)

### 2. Installation
```bash
git clone https://github.com/Jabirmahmud0/service-booking-platform.git
cd service-booking-platform
npm install
```

### 3. Environment Setup
Create a `.env.local` file with the following variables:
```env
MONGODB_URI=your_mongodb_uri
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_URL=http://localhost:3000
AUTH_SECRET=your_auth_secret
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password
EMAIL_DEV_MODE=true
ADMIN_EMAIL=admin@bookease.app
ADMIN_PASSWORD=admin123
```

**Generate AUTH_SECRET:**
```bash
openssl rand -base64 32
```

**For Vercel Deployment**, add these environment variables in your Vercel project settings:
- `MONGODB_URI` - Your MongoDB connection string
- `STRIPE_SECRET_KEY` - Stripe secret key (sk_live_...)
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `NEXT_PUBLIC_URL` - Your production URL (e.g., https://your-app.vercel.app)
- `AUTH_SECRET` - Same secret as local
- `GMAIL_USER` - Your Gmail address
- `GMAIL_APP_PASSWORD` - Gmail app-specific password
- `ADMIN_EMAIL` - Admin login email (default: admin@bookease.app)
- `ADMIN_PASSWORD` - Admin login password (default: admin123)

**Default Admin Credentials:**
- Email: `admin@bookease.app`
- Password: `admin123`

### 4. Run Development Server
```bash
npm run dev
```

---

## 📂 Project Structure

- `app/ (public)`: Landing page, service catalog, and booking flow.
- `app/ (admin)`: Protected admin dashboard and management tools.
- `app/api/`: RESTful API endpoints for services, bookings, and payments.
- `lib/`: Shared utility functions and database connection logic.
- `models/`: Mongoose schemas for Bookings, Services, and Users.

---

## 🔗 Live Implementation

- **Live Site**: [View on Vercel](https://service-booking-platform-bay.vercel.app/)
- **GitHub**: [Source Code](https://github.com/Jabirmahmud0/service-booking-platform)

---

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

---

## 👨‍💻 Author

**Jabir Mahmud**

---

*Developed with efficiency and precision using AI-Assisted Modern Web Development.*
