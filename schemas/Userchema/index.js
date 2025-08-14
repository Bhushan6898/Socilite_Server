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
  
  follower: { type: mongoose.Schema.Types.ObjectId, ref: 'SocialiteUser' }, 
  following: { type: mongoose.Schema.Types.ObjectId, ref: 'SocialiteUser' },
  

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



const postSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SocialiteUser',
    required: true,
  },
  caption: {
    type: String,
    trim: true,
  },
  media: [
    {
      url: { type: String, required: true },
      type: {
        type: String,
        enum: ['image', 'video'],

      }
    }
  ],
   music: {
    type: String, 
    trim: true,
  },
  likes: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'SocialiteUser' },
      likedAt: { type: Date, default: Date.now }
    }
  ],
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'SocialiteUser' },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
}, {
  timestamps: true 
});

 export const PostModel= mongoose.model('Post', postSchema);
