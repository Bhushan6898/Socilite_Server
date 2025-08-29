import { PostModel, SocialiteUserModel } from "../../models/Userchema/index.js";
import crypto from 'crypto'
import fs from "fs";
import { uploadToCloudinary, uploadToCloudinarypost } from "../../middleware/cluodenary/index.js";
import { NotificationModel } from "../../models/auth Schema/index.js";
import { log } from "console";

export const updatedate = async (req, res) => {
  const { id } = req.user;
  const { name, username, email, number, bio } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const user = await SocialiteUserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let profilePicture = user.profilePicture;

    if (req.files && req.files.profileImage) {
      const imageFile = req.files.profileImage;
      const filePath = imageFile.tempFilePath;

      try {
        const fileBuffer = fs.readFileSync(filePath);
        const fileHash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

        const cloudinaryResult = await uploadToCloudinary(filePath, `product_${fileHash}`, "socilite-user");

        if (cloudinaryResult.existing) {
          return res.status(400).json({ message: "Profile image already exists in Cloudinary." });
        }

        profilePicture = cloudinaryResult?.secure_url || profilePicture;
      } catch (err) {
        console.error("Image Upload Error:", err);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    const updatedUser = await SocialiteUserModel.findByIdAndUpdate(
      id,
      {
        name,
        username,
        email,
        bio,
        number,
        profilePicture,
      },
      { new: true }
    );

    const newNotification = new NotificationModel({
      userId: id,
      message: "Your profile has been updated successfully!",
      type: "success",
    });


    await newNotification.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getNotification = async (req, res) => {
  try {
    const { id } = req.user;

    const Notification = await NotificationModel.find({ userId: id });

    if (!Notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({
      message: "Notification data retrieved successfully",
      Notification,
    });
  } catch (error) {
    console.error("Error retrieving user data:", error); // Log the error
    res.status(500).json({ message: "Server error, please try again later" });
  }
  
};


export const postdata = async (req, res) => {
  const { id } = req.user;
  const { caption, location, music, type } = req.body; // make sure type is sent from frontend

  try {
    const user = await SocialiteUserModel.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!req.files) {
      return res.status(400).json({ message: "No media files uploaded" });
    }

    const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];

    const mediaUploads = await Promise.all(
      files.map(async (file) => {
        const uploadResult = await uploadToCloudinarypost(file.tempFilePath);
        fs.unlinkSync(file.tempFilePath); // remove temp file

        return {
          url: uploadResult.secure_url,
          type: uploadResult.resource_type === "video" ? "video" : "image",
          publicId: uploadResult.public_id, // store public_id for future deletion
        };
      })
    );

    await SocialiteUserModel.findByIdAndUpdate(
      id,
      { $inc: { postsCount: 1 } },
      { new: true }
    );

    const newPost = new PostModel({
      userId: id,
      caption,
      location,
      music,
      media: mediaUploads,
    });
    await newPost.save();

    const newNotification = new NotificationModel({
      userId: id,
      message: `Your ${type || "post"} has been created successfully.`,
      type: "success",
    });
    await newNotification.save();

    return res.status(200).json({ message: "Post created successfully!", post: newPost });
  } catch (error) {
    console.error("Error in postdata:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getAllPostsByUser = async (req, res) => {
  const { id } = req.user; 

  try {
    const user = await SocialiteUserModel.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const posts = await PostModel.find({ userId: id }).sort({ createdAt: -1 });

    return res.status(200).json({ message: 'Posts fetched successfully', posts,user});
  } catch (error) {
    console.error('Error in getAllPostsByUser:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



