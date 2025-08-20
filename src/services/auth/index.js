

import dotenv from 'dotenv';
import { PostModel, SocialiteUserModel } from '../../schemas/Userchema/index.js';
import { createToken } from '../../middleware/jwt/index.js';

import jwt from 'jsonwebtoken';
import { NotificationModel } from '../../schemas/auth Schema/index.js';

dotenv.config();


export const server = (req, res) => {

  res.status(200).send('Server is alive and working!');


};

export const verification = (req, res, next) => {
  const cookies = req.cookies;
  const { token, role } = cookies;


  if (!token || !role) {
    return res.status(401).json({ message: 'User not authorized. Token or role is missing.' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ message: 'Token is not valid.' });
    }
    req.user = decodedUser;
    const { id } = decodedUser;


    return res.status(200).json({ id, role,token });
  });
};


export const login = async (req, res) => {
  try {
    const { email,password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await SocialiteUserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    if (password!==user.password) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const accessToken = createToken(user);

    const cookieOptions = {
      maxAge:  30 * 24 * 60 * 60 * 1000 ,
      httpOnly: true,
      sameSite: 'None',
      secure: process.env.NODE_ENV === 'production',
    };
    res.cookie('token', accessToken, cookieOptions);
    res.cookie('role', user.role, cookieOptions);

    // Return success message with user details
    return res.status(200).json({
      message: "Login successfully !",
      user: user
    });

  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const logout = async (req, res, next) => {
  try {

    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'None',
      secure: process.env.NODE_ENV === 'production',

    });
    res.clearCookie('role', {
      httpOnly: true,
      sameSite: 'None',
      secure: process.env.NODE_ENV === 'production',

    });

    return res.status(200).json({ message: "Logout successful!" });
  } catch (error) {
    return next(createError(500, "An error occurred while logging out"))
  }
}


export const register = async (req, res) => {

  const { name, username, email, password,number } = req.body;
  console.log("Registering user:", { name, username, email, password });
  
  try {
    const existuser = await SocialiteUserModel.findOne({
      $or: [{ email: email }, { username: username },{number:number}]
    })
    if (existuser) {
      if (existuser.email === email) {
        return res.status(401).json({ message: "Email already exists" });
      } else if (existuser.username === username) {
        return res.status(401).json({ message: "Username name already exists" });
      }
      else if (existuser.number === number) {
        return res.status(401).json({ message: "number  already exists" });
      }
    }
    const user = await new SocialiteUserModel({
      name,
      email,
      password,
      username,
      number
    })
    await user.save();
     const newNotification = new NotificationModel({
          userId: user._id,
          message: "Welcome! Your account has been created successfully.",
          type: "success",
        });
    
    
        await newNotification.save();

    return res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }

};

export const getuserdata = async (req, res) => {
  try {
    const { id } = req.user;


    const user = await SocialiteUserModel.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    res.status(200).json({
      message: "User data retrieved successfully",
      user,
    });
  } catch (error) {
    console.error("Error retrieving user data:", error); // Log the error
    res.status(500).json({ message: "Server error, please try again later" });
  }
  
};


export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate('userId', 'name username email profilePicture bio') // Post author
      .populate('likes.userId', 'name username profilePicture')     // Like authors
      .populate('comments.userId', 'name username profilePicture')  // Comment authors
      .sort({ createdAt: -1 })
      .lean(); // returns plain JS objects instead of Mongoose docs

    // Remove duplicates based on _id
    const uniquePosts = Array.from(
      new Map(posts.map(post => [post._id.toString(), post])).values()
    );

    return res.status(200).json({
      message: 'Posts fetched successfully',
      posts: uniquePosts
    });

  } catch (error) {
    console.error('Error in getAllPosts:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



export const getAllUsers = async (req, res) => {
  try {
    const users = await SocialiteUserModel.find().lean();

    // For each user, fetch their posts
    const usersWithPosts = await Promise.all(
      users.map(async (user) => {
        const posts = await PostModel.find({ userId: user._id }).lean();
        return {
          ...user,
          posts,
        };
      })
    );
    console.log('Users fetched successfully:', usersWithPosts.length);

    return res.status(200).json({
      message: 'Users fetched successfully',
      users: usersWithPosts
    });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

