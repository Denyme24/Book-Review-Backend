import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Book from "./models/bookModel.js";

const booksFilePath = path.resolve("books.json");
const books = JSON.parse(fs.readFileSync(booksFilePath, "utf8"));

mongoose.connect("mongodb://localhost:27017/bookstore", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const loadBooks = async () => {
  try {
    await Book.deleteMany({});
    await Book.insertMany(books);
    console.log("Books data loaded successfully");
  } catch (err) {
    console.error("Error loading books data:", err);
  } finally {
    mongoose.connection.close();
  }
};

loadBooks();
