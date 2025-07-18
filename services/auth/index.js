

import dotenv from 'dotenv';
import { SocialiteUserModel } from '../../schemas/Userchema/index.js';
import { createToken } from '../../middleware/jwt/index.js';
import createOtp from 'otp-generator'
import { otpmodel } from '../../schemas/auth Schema/index.js';
import {  senderMail } from '../../middleware/email/email.sender.js';
import jwt from 'jsonwebtoken';
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
  
    
    return res.status(200).json({ id, role });
  });
};
export const genrateotp = async (req, res) => {
  const { email } = req.body;
  try {
   
    const user = await SocialiteUserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }
   
    const otp = createOtp.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true
    });

    // Save OTP in the database
    const sendotp = await otpmodel({
      email,
      otp,
      created_at: new Date(Date.now())
    });
    sendotp.save();
   

    // Send email with the OTP
    senderMail.sendMail({
      from: "no-reply@socialite.com",
      to: email,
      subject: "Your OTP Verification Code from Socialite",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Socialite OTP Verification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f3f4f6;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 40px auto;
                    background-color: #ffffff;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background: linear-gradient(90deg, #1DA1F2, #0084B4);
                    color: white;
                    text-align: center;
                    font-size: 28px;
                    font-weight: bold;
                    padding: 20px;
                    border-radius: 8px 8px 0 0;
                }
                .content {
                    font-size: 16px;
                    color: #333;
                    line-height: 1.6;
                    padding: 20px;
                }
                .otp {
                    font-size: 30px;
                    font-weight: bold;
                    color: #0084B4;
                    background-color: #e8f5e9;
                    padding: 15px;
                    border-radius: 8px;
                    text-align: center;
                    margin: 20px 0;
                    width: fit-content;
                    margin-left: auto;
                    margin-right: auto;
                    border: 2px solid #0084B4;
                }
                .button {
                    display: inline-block;
                    padding: 12px 24px;
                    color: #ffffff;
                    background-color: #0084B4;
                    border-radius: 8px;
                    text-decoration: none;
                    font-size: 16px;
                    font-weight: bold;
                    margin-top: 20px;
                    text-align: center;
                }
                .footer {
                    text-align: center;
                    font-size: 14px;
                    color: #777;
                    margin-top: 20px;
                    background-color: #f9f9f9;
                    padding: 20px;
                    border-radius: 0 0 8px 8px;
                }
                a {
                    color: #0084B4;
                    text-decoration: none;
                }
                .footer a {
                    color: #0084B4;
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">Socialite OTP Verification</div>
                <div class="content">
                    <p>Dear User,</p>
                    <p>We received a request to verify your email on Socialite. Please use the OTP below to complete your verification:</p>
                    <div class="otp">${otp}</div>
                    <p>If you didn’t request this verification, feel free to ignore this email or contact our support team.</p>
                    <a href="" class="button">Visit Socialite</a>
                    <p>Thank you for choosing Socialite for your social networking needs!</p>
                </div>
                <div class="footer">
                    <p>Socialite, Your platform for global connections.</p>
                    <p>Need help? <a href="">Contact Support</a></p>
                </div>
            </div>
        </body>
        </html>
      `,
    });
    
    

    return res.status(200).json({ message: 'OTP sent successfully!' });
  } catch (error) {
    console.error('Error during OTP generation:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email,  otp } = req.body;
    
  
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await SocialiteUserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
      const otpRecord = await otpmodel.findOne({ email, otp });
      if (!otpRecord) {
        return res.status(401).json({ message: 'Invalid OTP' });
      }
    const accessToken = createToken(user); 

    const cookieOptions = {
      maxAge: 24 * 60 * 60 * 1000,  
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

  const {firstname,lastname,email, number,username}=req.body;
try{
  const existuser= await SocialiteUserModel.findOne({
    $or: [{ email: email }, { number: number }]
  })
  if (existuser) {
    if (existuser.email === email) {
      return res.status(401).json({ message: "Email already exists" });
    } else if (existuser.number === number) {
      return res.status(401).json({ message: "Mobile number already exists" });
    }
  }
  const user= await new SocialiteUserModel({
    firstname,
    lastname,
    email,
    number,
     username
  })
await user.save();

return res.status(200).json({ message: "User registered successfully" });
} catch (error) {
  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
}
  
  };

  export const getuserdata = async (req, res) => {
    try {
      const { id} = req.user; 

     
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
  