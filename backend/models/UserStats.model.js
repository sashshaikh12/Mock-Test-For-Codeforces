import mongoose from "mongoose";

const UserStatsSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    
    // Difficulty statistics (from 800 to 2200)
    difficultyStats: {
      type: Map,
      of: Number,
      default: () => new Map()  // Will store '800': 5, '1200': 10, etc.
    },
    
    // Tag statistics
    tagStats: {
      type: Map,
      of: Number,
      default: () => new Map()  // Will store 'dp': 7, 'graphs': 3, etc.
    },
    
    // List of solved problems
    solvedProblems: [{
      contestId: { type: Number, required: true },
      index: { type: String, required: true },  // 'A', 'B', etc.
      name: { type: String },
      rating: { type: Number },
      tags: [{ type: String }],
      solvedAt: { type: Date, default: Date.now }
    }],
    
    // Total solved count
    totalSolved: { type: Number, default: 0 },

  });

const UserStats = mongoose.model("UserStats", UserStatsSchema);

export default UserStats;