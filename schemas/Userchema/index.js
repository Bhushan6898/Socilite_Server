import mongoose from "mongoose";


const Schema = mongoose.Schema;

// Farming User Schema
const farmingUserSchema = new Schema({
  name: { 
    type: String, 
    required: [true, 'First name is required'], 
    trim: true 
  },
 
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    trim: true 
  },
  mobileNumber: { 
    type: String, 
    required: [true, 'Mobile number is required'], 
   
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'], 
  },
  country: { type: String, trim: true },
  state: { type: String, trim: true },
  city: { type: String, trim: true },
  farmName: { 
    type: String, 
    trim: true 
  },
 
  role: { 
    type: String, 
    enum: ["Farmer", "Buyer", "Admin"], 
    default: "Farmer" 
  },
  profileImage: { type: String }, // Optional field for profile picture
  status: { 
    type: String, 
    enum: ["Active", "Inactive"], 
    default: "Inactive" 
  },
  permissions: { 
    type: String, 
    enum: ["Granted", "NotGranted"], 
    default: "NotGranted" 
  }
}, { timestamps: true }); 


export const FarmingUserModel = mongoose.model("FarmingUser", farmingUserSchema, "FarmingUser");
