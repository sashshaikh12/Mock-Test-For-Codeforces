import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js';
import User from './models/user.model.js';
import DailyQuestion from './models/DailyQuestion.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import userAuth from './middleware/userAuth.js';
import { OAuth2Client } from 'google-auth-library';
import mongoose from 'mongoose';
import axios from 'axios';


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

      const token = jwt.sign({ id: user._id , name: user.name}, process.env.JWT_SECRET, {
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

          const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, {
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
  try {
    const { userId, name } = req.body;  // Extract from request

    // If userId is a valid MongoDB ObjectId, fetch user details from DB
    if (mongoose.Types.ObjectId.isValid(userId)) {
      const user = await User.findById(userId);
      if (user) {
        const { name, email } = user;
        return res.status(200).json({ name, email });
      }
    }

    // If userId is not a valid ObjectId (Google Sign-In case), return name from token
    if (name) {
      return res.status(200).json({ name });  // Google users don't have an email stored in DB
    }

    return res.status(404).json({ message: "User not found" });

  } catch (error) {
    console.error("User data fetch error:", error);
    res.status(500).json({ message: "Server Could not get user data" });
  }
});

app.post("/google-login", async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, name, email } = payload; // Extract name and email from the Google payload

    // Generate a session JWT token using Google's sub as id
    const sessionToken = jwt.sign(
      { id: sub, name: name },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Set token in HTTP-only cookie
    res.cookie("token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", name, email });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ message: "Invalid Google token" });
  }
});

app.get('/random-problem', async (req, res) => {
  try {
    const response = await axios.get('https://codeforces.com/api/problemset.problems');
    
    // Get all problems
    const allProblems = response.data.result.problems;
    
    // Filter problems to only keep those with a rating
    const problemsWithRating = allProblems.filter(problem => problem.rating !== undefined && problem.rating >= 800 && problem.rating <= 1800);

    // Select a random problem from the filtered list
    const randomIndex = Math.floor(Math.random() * problemsWithRating.length);
    const randomProblem = problemsWithRating[randomIndex];
    
    return res.status(200).json({
      message: "Problems fetched", 
      problem: randomProblem,
    });
  } catch (error) {
    console.error("Error fetching problems:", error);
    return res.status(500).json({message: "Failed to fetch problems"});
  }
});

app.get('/daily-question', async (req, res) => {
  try {
    // Step 1: Check if today's question already exists
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const question = await DailyQuestion.findOne({
      date: { 
        $gte: today, 
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) 
      }
    });

    if (question) {
      return res.json({ success: true, question });
    }

    // Step 2: Fetch a new problem if not found
    const response = await axios.get('https://codeforces.com/api/problemset.problems');
    const allProblems = response.data.result.problems;
    
    // Filter problems with a valid rating
    const problemsWithRating = allProblems.filter(problem => problem.rating !== undefined && problem.rating >= 800 && problem.rating <= 1800);
    
    if (problemsWithRating.length === 0) {
      return res.status(500).json({ success: false, message: "No suitable problems found" });
    }

    // Select a random problem
    const randomIndex = Math.floor(Math.random() * problemsWithRating.length);
    const problem = problemsWithRating[randomIndex];

    const newDailyQuestion = new DailyQuestion({
      date: today,
      problem: {
        contestId: problem.contestId,
        index: problem.index,
        name: problem.name,
        rating: problem.rating,
        tags: problem.tags
      }
    });

    await newDailyQuestion.save();

    // Step 3: Return the new question
    res.json({ success: true, question: newDailyQuestion });

  } catch (error) {
    console.error("Error fetching daily question:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


app.listen(5000, () => {
connectDB();
  console.log('backend Server started');
});