import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionId: Number,
  questionText: String,
  options: [String],
  correctAnswer: Number,
  imageUrl: String
});

const quizSchema = new mongoose.Schema({
  quizId: { type: String, required: true },
  title: { type: String, required: true },
  questions: [questionSchema],
  image_url: String,
});

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
