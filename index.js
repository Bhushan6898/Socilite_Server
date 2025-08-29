import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import  { dirname } from 'path';
import cookieParser from 'cookie-parser';
import userroutes from './src/routes/user/index.js';
import routes from './src/routes/auth/index.js';
import fileUpload from 'express-fileupload';
dotenv.config();
 

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:3000", 
  "https://socilite.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(fileUpload({
  useTempFiles:true,
  tempFileDir: "/tmp/" 
}))

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
