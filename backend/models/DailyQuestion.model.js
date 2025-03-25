import mongoose from 'mongoose';

const DailyQuestionSchema = new mongoose.Schema({
  date: {
    type: Date,
    unique: true,
    default: Date.now,
  },
  problem: {
    contestId: { type: Number},
    index: { type: String},
    name: { type: String},
    rating: { type: Number },
  },
});

const DailyQuestion = mongoose.model('DailyQuestion', DailyQuestionSchema);

export default DailyQuestion;