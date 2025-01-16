import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import  { dirname } from 'path';
import cookieParser from 'cookie-parser';
import userroutes from './routes/user/index.js';

import routes from './routes/auth/index.js';



dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: [
    'http://localhost:3000' ,
    'https://farmdata365.netlify.app' 

  ],
  
  credentials: true  
}));

app.use(bodyParser.json());
app.use(cookieParser());


app.use("/", routes);
app.use("/user", userroutes);

const DB_URI = process.env.DB_URI;

// Connect to MongoDB
mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`DB Connection Error: ${err.message}`);
    process.exit(1); 
  });
