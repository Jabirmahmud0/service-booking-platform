import mongoose from 'mongoose';

function generateBookingRef() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'BK-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const BookingSchema = new mongoose.Schema({
  bookingRef: {
    type: String,
    unique: true,
    default: generateBookingRef,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Service is required'],
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
  },
  customerEmail: {
    type: String,
    required: [true, 'Customer email is required'],
    trim: true,
    lowercase: true,
  },
  customerPhone: {
    type: String,
    required: [true, 'Customer phone is required'],
    trim: true,
  },
  scheduledAt: {
    type: Date,
    required: [true, 'Scheduled date/time is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  stripeSessionId: {
    type: String,
    required: true,
  },
  amountPaid: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'usd',
  },
  emailSent: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    default: '',
  },
  deleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

BookingSchema.index({ scheduledAt: 1, serviceId: 1 });
BookingSchema.index({ customerEmail: 1 });
BookingSchema.index({ status: 1 });

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
