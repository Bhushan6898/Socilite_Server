import express from "express";
import { login, register, server } from "../../services/auth/index.js";



const routes = express.Router();
routes.get('/connection', server);
routes.post('/login', login);
routes.post('/register', register);





export default routes;
