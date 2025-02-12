import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  rating: { type: Number, required: true },
  cover: { type: String, required: true },
  description: { type: String, required: false },
  reviews: { type: [String], default: [] },
});

export default mongoose.model("Book", bookSchema);
