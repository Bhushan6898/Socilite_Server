import mongoose from "mongoose";

const Schema = mongoose.Schema;


const socialiteUserSchema = new Schema({
  firstname: { 
    type: String, 
    required: [true, 'First name is required'], 
    trim: true 
  },
  
  lastname: { 
    type: String, 
    required: [true, 'Last name is required'], 
    trim: true 
  },

  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    trim: true 
  },
  
  username: { 
    type: String, 
    required: [true, 'Username is required'], 
    unique: true, 
    trim: true 
  },
  
  
  number: { 
    type: String, 
    required: [true, 'Mobile number is required'], 
    unique: true, 
  },
  
  country: { 
    type: String, 
    trim: true 
  },
  
  state: { 
    type: String, 
    trim: true 
  },
  
  city: { 
    type: String, 
    trim: true 
  },

  profilePicture: { 
    type: String, 
    default: "default-avatar.png", // Default profile picture
  },
  
  bio: { 
    type: String, 
    trim: true 
  },
  
  followersCount: { 
    type: Number, 
    default: 0 
  },

  followingCount: { 
    type: Number, 
    default: 0 
  },

  postsCount: { 
    type: Number, 
    default: 0 
  },

  role: { 
    type: String, 
    enum: ["User", "Admin", "Moderator"], 
    default: "User" 
  },
  
  status: { 
    type: String, 
    enum: ["Active", "Inactive", "Banned"], 
    default: "Active" 
  },

  // notificationsEnabled: { 
  //   type: Boolean, 
  //   default: true 
  // },

  // isVerified: { 
  //   type: Boolean, 
  //   default: false 
  // },
  
  lastLogin: { 
    type: Date 
  },

  permissions: { 
    type: String, 
    enum: ["Granted", "NotGranted"], 
    default: "Granted" 
  }

}, { timestamps: true });

export const SocialiteUserModel = mongoose.model("SocialiteUser", socialiteUserSchema, "SocialiteUser");
