import express from "express";
import {   genratesetting, getAllPosts, getAllUsers, getuserdata, login, logout, register, server, verification } from "../../services/auth/index.js";
import { cheack } from "../../middleware/jwt/index.js";



const routes = express.Router();
//post routes
routes.post('/login', login);
routes.post('/logout',cheack, logout);
routes.post('/register', register);

//get routes
routes.get('/getuser',cheack, getuserdata);
routes.get('/verify', verification);
routes.get('/all-post', getAllPosts);
routes.get('/all-users', getAllUsers);
routes.get('/setting',cheack, genratesetting);
routes.get('/connection', server);




export default routes;
