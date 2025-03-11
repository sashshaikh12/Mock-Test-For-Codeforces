import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js';
import User from './models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import userAuth from './middleware/userAuth.js';


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true, origin: 'http://localhost:5173'}));
dotenv.config({ path: '../.env' });

const saltRounds = 10;


app.post('/register', async (req, res) => {
  try{
    const { name, email, password } = req.body;

    //password hashing:

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if(err){
        return res.status(500).json({message: "Server Could not hash password"});
      }
      const user = await User.create({ name, email, password: hash });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 1 * 24 * 60 * 60 * 1000
      });

      return res.json({message: "User registered"});

    });
  }catch(error){
    res.status(500).json({message: "Server Could not register"});
  }
}
);

app.post('/login', async (req, res) => {
  try{
    const { email, password } = req.body;
    const user = await User.findOne({ email});  //find user with the email  
    if(user){
      bcrypt.compare(password, user.password, (err, result) => {
        if(err){
          return res.status(500).json({message: "Server Could not compare password"});
        }
        if(result){

          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
          });
    
          res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 1 * 24 * 60 * 60 * 1000
          });

          return res.status(200).json({message: "Logged in"});

        }else{
          res.status(400).json({message: "Invalid Credentials"});
        }
      });
    }
    else{
      res.status(404).json({message: "User not found"});
    }
  }catch(error){
    res.status(500).json({message: "Server Could not login"});
  }
}
);

app.post('/logout', (req, res) => {
  try{
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    });

    return res.json({message: "Logged out"});

  }catch(error){
    res.status(500).json({message: "Server Could not logout"}); 
}
});

app.post('/is-auth', userAuth, (req, res) => {
  try{
    return res.json({message: "Authenticated"});
  }catch(error){
    res.status(500).json({message: "Server Could not authenticate"}); 
}
});

app.get('/user-data', userAuth, async (req, res) => {
  try{
    const user = await User.findById(req.body.userId);
    if(!user)
    {
      return res.status(404).json({message: "User not found"});
    }
    const {name, email} = user;
    return res.json({name, email});
  }catch(error){
    res.status(500).json({message: "Server Could not get user data"});
  }
}
);

app.listen(5000, () => {
connectDB();
  console.log('backend Server started');
});