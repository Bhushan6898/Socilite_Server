

import dotenv from 'dotenv';
import { FarmingUserModel } from '../../schemas/Userchema/index.js';
import { createToken } from '../../middleware/jwt/index.js';
import createOtp from 'otp-generator'
import { otpmodel } from '../../schemas/auth Schema/index.js';
import {  senderMail } from '../../middleware/email/email.sender.js';

dotenv.config();


export const server = (req, res) => {

  res.status(200).send('Server is alive and working!');
console.log("connect");

};
export const genrateotp = async (req, res) => {
  const { email } = req.body;
  try {
    // Find user by email
    const user = await FarmingUserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }
   

    // Generate OTP
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
      from: "patil.bhushan6898@gmail.com",
      to: email,
      subject: "Your OTP Verification Code from FarmData365",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>FarmData365 OTP Verification</title>
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
                    background: linear-gradient(90deg, #4CAF50, #388E3C);
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
                    color: #388E3C;
                    background-color: #e8f5e9;
                    padding: 15px;
                    border-radius: 8px;
                    text-align: center;
                    margin: 20px 0;
                    width: fit-content;
                    margin-left: auto;
                    margin-right: auto;
                    border: 2px solid #388E3C;
                }
                .button {
                    display: inline-block;
                    padding: 12px 24px;
                    color: #ffffff;
                    background-color: #388E3C;
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
                    color: #388E3C;
                    text-decoration: none;
                }
                .footer a {
                    color: #388E3C;
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">FarmData365 OTP Verification</div>
                <div class="content">
                    <p>Dear Customer,</p>
                    <p>We received a request to verify your email on FarmData365. Please use the OTP below to complete your verification:</p>
                    <div class="otp">${otp}</div>
                    <p>If you didn’t request this verification, feel free to ignore this email or contact our support team.</p>
                    <a href="https://farmdata365.com" class="button">Visit FarmData365</a>
                    <p>Thank you for choosing FarmData365 for your farming data needs!</p>
                </div>
                <div class="footer">
                    <p>FarmData365, Your partner in smart farming.</p>
                    <p>Need help? <a href="mailto:support@farmdata365.com">Contact Support</a></p>
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
    const { email, password, otp } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user by email
    const user = await FarmingUserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // If OTP is provided, validate OTP
    if (otp) {
      const otpRecord = await otpmodel.findOne({ email, otp });
      if (!otpRecord) {
        return res.status(401).json({ message: 'Invalid OTP' });
      }

      // Successfully validated OTP
      return res.status(200).json({ message: 'Login successful with OTP!', user });
    }

    // If no OTP, continue with password validation
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Compare the provided password with the hashed password in the database
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Password is correct, create token and set cookies
    const accessToken = createToken(user); // Assuming createToken function is defined elsewhere

    const cookieOptions = {
      maxAge: 24 * 60 * 60 * 1000,  
      httpOnly: true,                
      sameSite: 'None',              
      secure: process.env.NODE_ENV === 'production', 
    };

    // Set cookies
    res.cookie('token', accessToken, cookieOptions);
    res.cookie('role', user.role, cookieOptions); 

    // Return success message with user details
    return res.status(200).json({
      message: "Login successful with Password",
      user: user
    });

  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const register = async (req, res) => {

  const {name,email,password, mobileNumber,country,state,city,farmName}=req.body;
try{
  const existfarmer= await FarmingUserModel.findOne({
    $or: [{ email: email }, { mobileNumber: mobileNumber }]
  })
  if (existfarmer) {
    if (existfarmer.email === email) {
      return res.status(401).json({ message: "Email already exists" });
    } else if (existfarmer.mobileNumber === mobileNumber) {
      return res.status(401).json({ message: "Mobile number already exists" });
    }
  }
  const farmer= await new FarmingUserModel({
    name,
    email,
    password,
     mobileNumber,
     country,
     state,
     city,
     farmName
  })
await farmer.save();

return res.status(200).json({ message: "farmer registered successfully" });
} catch (error) {
  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
}
  
  };

  export const getuserdata = async (req, res) => {
    try {
      const { id} = req.user; 
     
  
     
      const user = await FarmingUserModel.findOne({ _id: id });
  
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
  