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

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4
- **Animation**: Framer Motion 11, Lucide Icons
- **Backend**: Next.js API Routes, MongoDB Atlas, Mongoose
- **Payments**: Stripe SDK + Webhooks
- **Email**: Nodemailer + Gmail SMTP
- **Auth**: Auth.js (v5)

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
```

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

- **Live Site**: [View on Vercel](https://service-booking-platform-one.vercel.app/)
- **GitHub**: [Source Code](https://github.com/Jabirmahmud0/service-booking-platform)

---

*Developed with efficiency and precision using AI-Assisted Modern Web Development.*
