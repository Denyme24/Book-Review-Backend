import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import Book from "./models/bookModel.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/bookstore", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Endpoint to fetch books
app.get("/books", async (req, res) => {
  const { page = 1, search = "", genre = "", rating = "" } = req.query;
  const PAGE_SIZE = 9;

  let query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { author: { $regex: search, $options: "i" } },
    ];
  }

  if (genre) {
    query.genre = genre;
  }

  if (rating) {
    query.rating = { $gte: parseInt(rating, 10) };
  }

  const totalBooks = await Book.countDocuments(query);
  const totalPages = Math.ceil(totalBooks / PAGE_SIZE);
  const books = await Book.find(query)
    .limit(PAGE_SIZE)
    .skip((page - 1) * PAGE_SIZE);

  res.json({ books, totalPages });
});

// Endpoint to fetch a book by ID
app.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to fetch reviews for a book
app.get("/reviews/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book.reviews || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to submit a review for a book
app.post("/reviews/:id", async (req, res) => {
  const { review } = req.body;
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    book.reviews = book.reviews || [];
    book.reviews.push(review);
    await book.save();
    res.status(201).json({ message: "Review added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
