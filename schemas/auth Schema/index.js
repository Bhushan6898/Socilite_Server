import mongoose from "mongoose";
const Schema = mongoose.Schema;
const otp = new Schema({
  otp: { type: String },
  email: { type: String },
  created_at: { type: Date, default: Date.now, expires: '2m' }
})
export const otpmodel = mongoose.model("otp", otp, "otp");
