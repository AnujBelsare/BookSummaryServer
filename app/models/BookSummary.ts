import { model, models, Schema, Types } from "mongoose";

const BookSummarySchema = new Schema(
  {
    book: {
      type: Types.ObjectId,
      ref: "Book",
      required: true,
      index: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String, // 🔥 Markdown string now
      required: true,
    },
    plainText: {
      type: String,
    },
    readingTime: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const BookSummary =
  models.BookSummary || model("BookSummary", BookSummarySchema);

export default BookSummary;