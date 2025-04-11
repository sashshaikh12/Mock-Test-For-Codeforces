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
import testAuth from './middleware/testAuth.js';
import MockTest from './models/MockTest.model.js';
import FavouriteQuestion from './models/FavouriteQuestion.model.js';
import { OAuth2Client } from 'google-auth-library';
import mongoose from 'mongoose';
import axios from 'axios';
import crypto from 'crypto';



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

      return res.status(200).json({message: "User registered"});

    });
  }catch(error){
    res.status(500).json({message: "Server Could not register"});
  }
}
);

app.post('/google-register', async (req, res) => {

  const { token } = req.body;

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const {name, email } = payload; // Extract name and email from the Google payload

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new User({ name, email });
    await newUser.save();


    res.status(200).json({ message: "User registered", email });

  } catch (error) {
    console.error("Google Register Error:", error);
    res.status(401).json({ message: "Invalid Google token" });
  }

});

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

          if (!user.codeforcesHandle) {
            // If not set, send back response indicating this
            return res.status(200).json({ 
              message: "Login successful but Codeforces handle not set",
              codeforcesVerificationRequired: true,
              email: user.email
            });
          }

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

app.post('/is-test-ongoing', testAuth, (req, res) => {
  try{
    return res.status(200).json({message: "Test ongoing"});
  }catch(error){
    res.status(500).json({message: "Server Could not find test"}); 
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
        return res.status(200).json({ name, email, userId });
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

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // User exists - check if they have a Codeforces handle
      if (!existingUser.codeforcesHandle) {
        // No Codeforces handle set - require verification
        return res.status(200).json({
          message: "Login successful but Codeforces handle not set",
          codeforcesVerificationRequired: true,
          email: email
        });
      }
      else
      {
        // Generate a session JWT token using Google's sub as id
        const sessionToken = jwt.sign(
          { id: existingUser._id, name: name },
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

        return res.status(200).json({ message: "Login successful", name, email });
      }
    }
    else
    {
        const newUser = new User({ name, email });
        await newUser.save();
        return res.status(200).json({
          message: "Login successful but Codeforces handle not set",
          codeforcesVerificationRequired: true,
          email: email
        });
    }

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

app.post("/last-submission", async (req, res) => {
  try {
    const { handle } = req.body;
    const CheckHandle = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
    if (CheckHandle.data.status === "FAILED") {
      return res.status(400).json({ message: "Invalid Codeforces handle" });
    }
    const response = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=1`);
    const lastSubmission = response.data.result[0];
    return res.status(200).json({ message: "Last submission fetched", submission: lastSubmission });
  } catch (error) {
    console.error("Error fetching last submission:", error);
    return res.status(500).json({ message: "Failed to fetch last submission" });
  }
}
);

app.post("/get-token", async (req, res) => {
  try {
    const { handle, email } = req.body;
    
    if (!handle || !email) {
      return res.status(400).json({ message: "Handle and email are required" });
    }
    
    // Find user by email
    let user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Update the user's Codeforces handle if not already set
    if (!user.codeforcesHandle) {
      user = await User.findByIdAndUpdate(
        user._id,
        { codeforcesHandle: handle },
        { new: true } // Return the updated document
      );
    }
    
    // Generate token with MongoDB _id
    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    
    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    
    // Return success response with user data
    return res.status(200).json({ 
      message: "Codeforces handle added", 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        codeforcesHandle: user.codeforcesHandle
      }
    });
    
  } catch (error) {
    console.error("Error setting Codeforces handle:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/test-questions", testAuth, async (req, res) => {
  
  const {selectedTags, lowerBound, upperBound, problems, userId, testId} = req.body;

  try {
    // Handle existing test from testId (page refresh case)
    if (testId) {
      // Try to find the test in MongoDB
      const existingTest = await MockTest.findById(testId);

      
      if (existingTest) {
        // Fetch all problems to get full details
        const response = await axios.get('https://codeforces.com/api/problemset.problems');
        const allProblems = response.data.result.problems;
        
        // Extract the question identifiers from MongoDB
        const testProblems = existingTest.questions.map(q => ({
          contestId: q.contestId,
          index: q.index,
          name: q.title,
        }));
        
        // Find the full problem details for each problem identifier
        const testQuestions = testProblems.map(problem => {
          const fullProblem = allProblems.find(p => 
            p.contestId === problem.contestId && p.index === problem.index
          );
          
          return fullProblem || problem; // Fallback to the identifier if full problem not found
        }).filter(problem => problem); // Remove any undefined entries
        
        if (testQuestions.length === 4) {
          return res.status(200).json({
            message: "Test questions retrieved from MongoDB",
            testQuestions,
            testId,
            fromCookie: true
          });
        }
      }
      else{
        // Test not found in MongoDB, handle accordingly
        return res.status(404).json({ message: "Test not found in mongoDB but is in cookie" });
      }
    }
    
    
    // Validation: Make sure we have the required parameters
    if (!selectedTags || !lowerBound || !upperBound) {
      return res.status(400).json({
        message: "Missing required parameters for new test creation"
      });
    }

    // Generate new questions
    const response = await axios.get('https://codeforces.com/api/problemset.problems');
    const allProblems = response.data.result.problems;
    
    let problemsWithRating;
    
    // Check if only the "Mixed" tag is selected
    if (selectedTags.length === 1 && selectedTags[0] === 'Mixed') {
      // For Mixed, only filter by rating and make sure problems have tags
      problemsWithRating = allProblems.filter(problem => 
        problem.rating !== undefined && 
        problem.rating >= lowerBound && 
        problem.rating <= upperBound &&
        problem.tags.length > 0
      );
    } else {
      // Normal tag filtering for specific tags
      problemsWithRating = allProblems.filter(problem => 
        problem.rating !== undefined && 
        problem.rating >= lowerBound && 
        problem.rating <= upperBound &&
        problem.tags.length > 0 &&
        problem.tags.every(tag => selectedTags.includes(tag))
      );
    }
    
    if(problemsWithRating.length < 4){
      return res.status(400).json({message: "Not enough problems found"});
    }

    const testQuestions = [];
    const testQuestionIndices = new Set();

    while (testQuestions.length < 4) {
      const randomIndex = Math.floor(Math.random() * problemsWithRating.length);
      if (!testQuestionIndices.has(randomIndex)) {
        testQuestionIndices.add(randomIndex);
        testQuestions.push(problemsWithRating[randomIndex]);
      }
    }

    // Save the test to MongoDB
    const newTest = new MockTest({
      userId: userId,
      questions: testQuestions.map(question => ({
        index: question.index,
        contestId: question.contestId,
        title: question.name,
        difficulty: question.rating,
        tags: question.tags
      })),
      responses: [] // Empty initially
    });

    const savedTest = await newTest.save();

    const testToken = jwt.sign(
      { 
        testId: savedTest._id
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: "30d"
      }
    );

    res.cookie("testToken", testToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Test questions fetched", 
      testQuestions,
      testId: savedTest._id,
      fromCookie: false
    });

  } catch(error) {
    console.error("Error fetching test questions:", error);
    res.status(500).json({message: "Server Could not fetch test questions"});
  }
});

app.post('/submit-test', testAuth, async (req, res) => {
  try {
    const {testId} = req.body;
    const test = await MockTest.findById(testId);

    // Generate a shareable token (alternative to cookie)
    const reportToken = crypto.randomBytes(16).toString('hex');
    test.shareableLink = reportToken;
    await test.save();

    res.clearCookie('testToken',{
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    });
    res.json({ 
      success: true,
      reportLink: `/test-report/${reportToken}` // Use token instead of testId
    });
  } catch (error) {
    res.status(500).json({ error: 'Submission failed' });
  }
});

app.get('/api/tests/by-token/:token', async (req, res) => {
  try {
    const test = await MockTest.findOne({ shareableLink: req.params.token });

    if (!test) return res.status(404).json({ error: 'Test not found' });
    res.json({message: "Test fetched", questions: test.questions});
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/mock-test-history', userAuth, async (req, res) => {
  try {
    const { userId } = req.body;
    const tests = await MockTest.find({ userId });
    if (!tests || tests.length === 0) {
      return res.status(404).json({ error: 'No tests found for this user' });
    }
    // Return the tests with only the required fields
    res.json({message: "Tests fetched", tests});
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/save-notes', async (req, res) => {
  try {
    const { testId, notes } = req.body;

    // Find the test by ID and update the notes
    const updatedTest = await MockTest.findByIdAndUpdate(
      testId,
      { testNotes: notes },
      { new: true }
    );

    if (!updatedTest) {
      return res.status(404).json({ message: 'Test not found' });
    }

    res.status(200).json({ message: 'Notes saved successfully', notes: updatedTest.testNotes });
  } catch (error) {
    console.error('Error saving notes:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
);

app.get('/get-test-notes/:testId', async (req, res) => {
  try {
    const { testId } = req.params;
    const test = await MockTest.findById(testId);
    
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    // Return just the notes
    res.status(200).json({ notes: test.testNotes || '' });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/get-favourite-questions', userAuth, async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch favourite questions from the database
    const favouriteQuestions = await FavouriteQuestion.find({ userId });

    if (!favouriteQuestions || favouriteQuestions.length === 0) {
      return res.status(404).json({ message: 'No favourite questions found' });
    }

    res.status(200).json({ message: "Favourite questions fetched", favouriteQuestions });
  } catch (error) {
    console.error('Error fetching favourite questions:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
);

app.post('/add-favourite-question', userAuth, async (req, res) => {
  try {
    const { userId, contestId, index, question } = req.body;

    // Check if the question already exists for the user
    const existingQuestion = await FavouriteQuestion.findOne({ 
      userId, 
      contestId, 
      index 
    });

    if (existingQuestion) {
      return res.status(400).json({ message: 'Question already exists in favourites' });
    }

    // Create a new favourite question with the complete data
    const favouriteQuestion = new FavouriteQuestion({ 
      userId, 
      contestId, 
      index,
      question
    });
    await favouriteQuestion.save();

    res.status(200).json({ message: 'Question added to favourites' });
  } catch (error) {
    console.error('Error adding favourite question:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/remove-favourite-question', userAuth, async (req,res) => {
  try {
    const { userId, contestId, index } = req.body;

    // Find and remove the question from the database
    const result = await FavouriteQuestion.findOneAndDelete({ 
      userId, 
      contestId, 
      index 
    });

    if (!result) {
      return res.status(404).json({ message: 'Question not found in favourites' });
    }

    res.status(200).json({ message: 'Question removed from favourites' });
  } catch (error) {
    console.error('Error removing favourite question:', error);
    res.status(500).json({ message: 'Server error' });
  }
}); 


// Save notes for a question
app.post('/save-question-notes', async (req, res) => {
  try {
    const { questionId, notes } = req.body;

    // Find the question by ID and update the notes
    const updatedQuestion = await FavouriteQuestion.findByIdAndUpdate(
      questionId,
      { favouriteNotes: notes },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json({ message: 'Notes saved successfully', notes: updatedQuestion.notes });
  } catch (error) {
    console.error('Error saving notes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get notes for a question
app.get('/get-question-notes/:questionId', async (req, res) => {
  try {
    const { questionId } = req.params;
    const question = await FavouriteQuestion.findById(questionId);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Return just the notes
    res.status(200).json({ notes: question.favouriteNotes || '' });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(5000, () => {
connectDB();
  console.log('backend Server started');
});