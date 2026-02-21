import connectDB from "@/app/lib/db";
import Book from "@/app/models/Book";
import BookSummary from "@/app/models/BookSummary";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// Helper: Extract plain text from Editor.js blocks
function extractPlainText(content: any): string {
    if (!content?.blocks || !Array.isArray(content.blocks)) return "";

    return content.blocks
        .map((block: any) => {
            if (block?.data?.text) return block.data.text;
            return "";
        })
        .join(" ")
        .replace(/<[^>]*>/g, "");
}

// GET...
export async function GET(req: Request, { params }: { params: Promise<{ bookId: string }> }) {
    try {
        await connectDB();

        const { bookId } = await params;

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return NextResponse.json(
                { success: false, message: "Book id is not valid" },
                { status: 400 }
            );
        }

        const bookExist = await Book.findById(bookId);

        if (!bookExist) {
            return NextResponse.json(
                { success: false, message: "Book not found" },
                { status: 404 }
            );
        }

        const summary = await BookSummary.findOne({ book: bookId })
            .select("-__v")
            .lean();

        if (!summary) {
            return NextResponse.json(
                { success: false, message: "Book summary not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, data: summary },
            { status: 200 }
        );

    }
    catch (err) {
        return NextResponse.json(
            {
                success: false,
                message: "Server error while fetching summary",
            },
            { status: 500 }
        );
    }
}

// POST...
export async function POST(req: Request, { params }: { params: Promise<{ bookId: string }> }) {
    try {
        await connectDB();

        const { bookId } = await params;

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return NextResponse.json({ success: false, message: "Invalid book ID" }, { status: 400 });
        }

        const book = await Book.findById(bookId);

        if (!book) {
            return NextResponse.json({ success: false, message: "Book not found" }, { status: 404 });
        }

        const existingSummary = await BookSummary.findOne({ book: bookId });

        if (existingSummary) {
            return NextResponse.json(
                { success: false, message: "Summary already exists for this book" },
                { status: 409 }
            );
        }

        const body = await req.json();

        const { title, content } = body;

        if (!title || !content || !content.blocks) {
            return NextResponse.json(
                { success: false, message: "Invalid Editor.js content" },
                { status: 400 }
            );
        }

        const plainText = extractPlainText(content);

        const wordCount = plainText.split(/\s+/).filter(Boolean).length;
        const readingTime = Math.max(1, Math.ceil(wordCount / 200));

        const summary = await BookSummary.create({
            book: bookId,
            title,
            content,
            plainText,
            readingTime,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Summary created successfully",
                data: summary,
            },
            { status: 201 }
        );
    }
    catch (err) {
        return NextResponse.json(
            {
                success: false,
                message: "Server error while creating summary",
            },
            { status: 500 }
        );
    }
}

// PATCH...
export async function PATCH(req: Request, { params }: { params: Promise<{ bookId: string }> }) {
    try {
        await connectDB();

        const { bookId } = await params;

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return NextResponse.json(
                { success: false, message: "Invalid Book id" },
                { status: 400 }
            );
        }

        const existingSummary = await BookSummary.findOne({ book: bookId });

        if (!existingSummary) {
            return NextResponse.json(
                { success: false, message: 'Summary not found' },
                { status: 404 }
            );
        }

        const body = await req.json();
        const update: any = {};

        if (body.title) {
            update.title = body.title;
        }

        if (body.content) {
            if (!body.content.blocks) {
                return NextResponse.json(
                    { success: false, message: "Invalid Editor.js format" },
                    { status: 400 }
                );
            }

            update.content = body.content;

            const plainText = extractPlainText(body.content);
            const wordCount = plainText.split(/\s+/).filter(Boolean).length;
            const readingTime = Math.max(1, Math.ceil(wordCount / 200));
            update.plainText = plainText;
            update.readingTime = readingTime;
        }

        const updateSummary = await BookSummary.findOneAndUpdate(
            { book: bookId },
            update,
            {
                new: true,
                runValidators: true,
            }
        );

        return NextResponse.json({
            success: true,
            message: "Summary updated successfully",
            data: updateSummary,
        });

    }
    catch (err) {
        return NextResponse.json(
            {
                success: false,
                message: "Server error while updating summary",
            },
            { status: 500 }
        );
    }
}
