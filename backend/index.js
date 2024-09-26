import express from "express";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { connectDB } from "./config/db.js";

import authRoute from './routes/authRoute.js';
import benefitRoute from './routes/benefitRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.NODE_ENV === "production"
      ? "https://hr3.jjm-manufacturing.com/"
      : "http://localhost:5173",
    credentials: true
  }));
  app.use(cookieParser());
app.use(express.json());

app.use("/api/auth",authRoute);
app.use("/api/benefit",benefitRoute);

app.listen(PORT,() => {
    connectDB();
    console.log(`Server is running PORT: ${PORT}`);
});
