import connectDB from "@/app/lib/db";
import Book from "@/app/models/Book";
import BookSummary from "@/app/models/BookSummary";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ bookId: string }> }
) {
    try {
        await connectDB();

        const { bookId } = await params;

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return NextResponse.json(
                { success: false, message: "Invalid book ID" },
                { status: 400 }
            );
        }

        const body = await req.json();

        const allowedFields = [
            "title",
            "author",
            "description",
            "coverImage",
            "publishedDate",
            "isbn",
            "genres",
            "averageRating",
        ];

        const updates: any = {};

        for (const key of allowedFields) {
            if (body[key] !== undefined) {
                updates[key] = body[key];
            }
        }

        // Prevent duplicate ISBN
        if (updates.isbn) {
            const existing = await Book.findOne({
                isbn: updates.isbn,
                _id: { $ne: bookId },
            });

            if (existing) {
                return NextResponse.json(
                    { success: false, message: "ISBN already in use" },
                    { status: 409 }
                );
            }
        }

        const updatedBook = await Book.findByIdAndUpdate(
            bookId,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedBook) {
            return NextResponse.json(
                { success: false, message: "Book not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: updatedBook,
        });

    } catch (error) {
        console.error("Book update error:", error);

        return NextResponse.json(
            { success: false, message: "Error updating book" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ bookId: string }> }
) {
    try {
        await connectDB();

        // ✅ Await params to extract bookId properly
        const { bookId } = await params;

        // ✅ Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return NextResponse.json(
                { success: false, message: "Invalid book ID" },
                { status: 400 }
            );
        }

        // 1️⃣ Check if book exists using bookId
        const book = await Book.findById(bookId);

        if (!book) {
            return NextResponse.json(
                { success: false, message: "Book not found" },
                { status: 404 }
            );
        }

        // 2️⃣ Delete summary linked to this book using bookId
        await BookSummary.findOneAndDelete({ book: bookId });

        // 3️⃣ Delete book using bookId
        await Book.findByIdAndDelete(bookId);

        return NextResponse.json({
            success: true,
            message: "Book and its summary deleted successfully",
        });

    } catch (error) {
        console.error("Delete error:", error);

        return NextResponse.json(
            { success: false, message: "Error deleting book" },
            { status: 500 }
        );
    }
}