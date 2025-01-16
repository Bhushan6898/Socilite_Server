import mongoose from "mongoose";

const otpSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
     
    },
    code: {
      type: String,
      required: [true, 'OTP code is required']
    },
   
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '5m' 
    }
  });
  module.exports = mongoose.model('OTP', otpSchema, 'OTP');

const notificationSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    
    message: {
      type: String,
      required: [true, 'Notification message is required']
    },
    status: {
      type: String,
      enum: ['read', 'unread'],
      default: 'unread'
    },
    sentAt: {
      type: Date
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  // Export Notification Model
  module.exports = mongoose.model('Notification', notificationSchema, 'Notification');
  
