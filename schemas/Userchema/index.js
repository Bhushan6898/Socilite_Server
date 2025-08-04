import mongoose from "mongoose";

const Schema = mongoose.Schema;


const socialiteUserSchema = new Schema({
  name: { 
    type: String, 
    required: [true, 'First name is required'], 
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
  
  password: { 
    type: String, 
    trim: true
  },
  number: { 
    type: String, 
    unique: true, 
  },
  
  profilePicture: { 
    type: String, 
    default: "", // Default profile picture
  },
  
  bio: { 
    type: String, 
    trim: true ,
    default: "This is my bio"
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
