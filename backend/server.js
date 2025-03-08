import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js';
import User from './models/user.model.js';

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config({ path: '../.env' });

app.listen(5000, () => {
connectDB();
  console.log('backend Server started');
});