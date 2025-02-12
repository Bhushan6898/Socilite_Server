import express from "express";
import {  genrateotp, getuserdata, login, register, server } from "../../services/auth/index.js";
import { cheack } from "../../middleware/jwt/index.js";



const routes = express.Router();
routes.get('/connection', server);
routes.post('/otp',genrateotp);
routes.post('/login', login);
routes.post('/register', register);
routes.get('/getuser',cheack, getuserdata);





export default routes;
