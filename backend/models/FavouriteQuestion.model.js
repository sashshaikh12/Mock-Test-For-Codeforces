import mongoose from "mongoose";

const favouriteQuestionSchema = mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    contestId: String,
    index: String,
    question: {
        contestId: String,
        index: String,
        title: String,
        difficulty: Number,
        tags: [String]
    },
    favouriteNotes: String,
});

const FavouriteQuestion = mongoose.model("FavouriteQuestion", favouriteQuestionSchema);

export default FavouriteQuestion;