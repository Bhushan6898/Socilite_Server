import mongoose from "mongoose";
const Schema = mongoose.Schema;
const otp = new Schema({
  otp: { type: String },
  email: { type: String },
  created_at: { type: Date, default: Date.now, expires: '2m' }
})
export const otpmodel = mongoose.model("otp", otp, "otp");


const notificationSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SocialiteUser',
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'], 
    default: 'info',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

 export const NotificationModel = mongoose.model('Notification', notificationSchema);
