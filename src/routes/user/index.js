import express from "express";
import { getAllPostsByUser, getNotification, postdata, updatedate } from "../../services/user/index.js";
import { cheack } from "../../middleware/jwt/index.js";
const userroutes = express.Router();

userroutes.post("/user-update",cheack,updatedate)

userroutes.post("/user-post",cheack,postdata)
userroutes.get("/notification",cheack,getNotification)
userroutes.get("/get-post",cheack,getAllPostsByUser)

export default userroutes;
