import mongoose from "mongoose";

const mockTestSchema = mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    questions: [{
      index: String, 
      contestId: String, 
      title: String,
      difficulty: Number,
      tags: [String]
    }],
    responses: [{
        contestId: String,
        index: String,
        status: String, // "AC", "WA", "TLE", etc.
        timeTaken: Number, // in seconds
      }]
});

const MockTest = mongoose.model("MockTest", mockTestSchema);

export default MockTest;