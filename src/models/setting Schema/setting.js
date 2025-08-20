import mongoose from "mongoose";

const Schema = mongoose.Schema;

const settingSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SocialiteUser',
    required: true,
    unique: true,
  },
  privacy: {
    isPrivateAccount: { type: Boolean, default: false }, 
    showActivityStatus: { type: Boolean, default: true },
    allowMessageRequestsFromEveryone: { type: Boolean, default: true },
    allowTagging: { type: Boolean, default: true }
  },

  security: {
    twoFactorAuthEnabled: { type: Boolean, default: false },
    loginAlerts: { type: Boolean, default: true },
    recentLogins: [
      {
        device: String,
        ip: String,
        location: String,
        date: { type: Date, default: Date.now }
      }
    ]
  },
  notifications: {
    likes: { type: Boolean, default: true },
    comments: { type: Boolean, default: true },
    newFollowers: { type: Boolean, default: true },
    directMessages: { type: Boolean, default: true },
    mentions: { type: Boolean, default: true },
    liveVideos: { type: Boolean, default: false }
  },

  contentPreferences: {
    autoplayVideos: { type: Boolean, default: true },
    sensitiveContentFilter: { type: Boolean, default: true },
    personalizedAds: { type: Boolean, default: true }
  },

  mutedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SocialiteUser' }],
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SocialiteUser' }],

  linkedAccounts: [
    {
      provider: { type: String, enum: ['Facebook', 'Twitter', 'TikTok', 'Threads'], required: false },
      username: String,
      linkedAt: { type: Date, default: Date.now }
    }
  ]

}, { timestamps: true });

export const SettingModel = mongoose.model('Setting', settingSchema, 'Settings');
