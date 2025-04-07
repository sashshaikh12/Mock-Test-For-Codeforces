import mongoose from "mongoose";

const favouriteQuestionSchema = mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    questions: [{
      index: String, 
      contestId: String, 
      title: String,
      difficulty: Number,
      tags: [String]
    }],
});

const FavouriteQuestion = mongoose.model("FavouriteQuestion", favouriteQuestionSchema);

export default FavouriteQuestion;