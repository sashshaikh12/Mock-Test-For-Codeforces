import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js';
import User from './models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import userAuth from './middleware/userAuth.js';
import { OAuth2Client } from 'google-auth-library';


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true, origin: 'http://localhost:5173'}));
dotenv.config({ path: '../.env' });

const saltRounds = 10;

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


app.post('/register', async (req, res) => {
  try{
    const { name, email, password } = req.body;

    const user = await User.findOne({ email });
    console.log(user);

    if(user) 
    {
      return res.status(400).json({message: "User already exists"});
    }

    //password hashing:

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if(err){
        return res.status(500).json({message: "Server Could not hash password"});
      }
      const user = await User.create({ name, email, password: hash });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      return res.status(200).json({message: "User registered"});

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
            expiresIn: '30d',
          });
    
          res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
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
    return res.status(200).json({message: "Authenticated"});
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
    return res.status(200).json({name, email});
  }catch(error){
    res.status(500).json({message: "Server Could not get user data"});
  }
}
);

app.post("/google-login", async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    // console.log("Google User Verified:", payload);

    // Generate a session JWT token
    const sessionToken = jwt.sign(
      { id: payload.sub },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Set token in HTTP-only cookie
    res.cookie("token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ message: "Invalid Google token" });
  }
});


app.listen(5000, () => {
connectDB();
  console.log('backend Server started');
});