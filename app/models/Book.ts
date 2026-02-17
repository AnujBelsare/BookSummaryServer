import mongoose, { Schema, model, models, Types } from "mongoose";

const BookSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },

        author: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },

        description: {
            type: String,
            maxlength: 2000,
        },

        coverImage: {
            type: String,
            default: "",
        },

        publishedDate: {
            type: Date,
        },

        isbn: {
            type: String,
            trim: true,
            index: true,
        },

        genres: [
            {
                type: String,
                trim: true,
            },
        ],

        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

    },
    {
        timestamps: true,
    }
);

const Book = models.Book || model("Book", BookSchema);

export default Book;
