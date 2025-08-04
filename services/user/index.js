import { SocialiteUserModel } from "../../schemas/Userchema/index.js";
import crypto from 'crypto'
import fs from "fs";
import { uploadToCloudinary } from "../../middleware/cluodenary/index.js";


export const updatedate = async (req, res) => {
  const { id } = req.user;
  const { name, username, email, number, bio } = req.body;

  // Basic email validation
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
          return res.status(400).json({ message: "Product image already exists in Cloudinary." });
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

    return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};