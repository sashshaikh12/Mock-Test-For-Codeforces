import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js';
import User from './models/user.model.js';
import bcrypt from 'bcrypt';

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config({ path: '../.env' });

const saltRounds = 10;

app.post('/register', async (req, res) => {
  try{
    const { name, email, password } = req.body;

    //password hashing:

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if(err){
        res.status(500).json({message: "Server Could not hash password"});
      }
      const user = await User.create({ name, email, password: hash });
      res.status(201).json(user);
    });
  }catch(error){
    res.status(500).json({message: "Server Could not register"});
  }
}
);


app.listen(5000, () => {
connectDB();
  console.log('backend Server started');
});