import express from "express";
import { updatedate } from "../../services/user/index.js";
import { cheack } from "../../middleware/jwt/index.js";
const userroutes = express.Router();

userroutes.post("/user-update",cheack,updatedate)

export default userroutes;
