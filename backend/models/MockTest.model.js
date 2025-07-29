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
        status: String, // solved or not solved.
      }],
    shareableLink: { type: String, index: true, unique: true },
    testNotes: String,
    startTime: { type: Date, default: Date.now },
});

const MockTest = mongoose.model("MockTest", mockTestSchema);

export default MockTest;