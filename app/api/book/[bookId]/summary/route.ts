import connectDB from "@/app/lib/db";
import Book from "@/app/models/Book";
import BookSummary from "@/app/models/BookSummary";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

/**
 * Extract plain text from markdown string
 */
function extractPlainText(markdown: string): string {
  return markdown
    .replace(/!\[.*?\]\(.*?\)/g, "") // remove images
    .replace(/\[([^\]]+)\]\((.*?)\)/g, "$1") // links → keep text
    .replace(/[#>*`~\-]/g, "") // remove markdown symbols
    .replace(/\n+/g, " ")
    .trim();
}

/**
 * Calculate reading time (200 wpm avg)
 */
function calculateReadingTime(text: string): number {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/* =====================================================
   GET SUMMARY
===================================================== */
export async function GET(
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

    const book = await Book.findById(bookId);
    if (!book) {
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
        { success: false, message: "Summary not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: summary },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET summary error:", error);
    return NextResponse.json(
      { success: false, message: "Server error while fetching summary" },
      { status: 500 }
    );
  }
}

/* =====================================================
   CREATE SUMMARY (POST)
===================================================== */
export async function POST(
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

    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json(
        { success: false, message: "Book not found" },
        { status: 404 }
      );
    }

    const existingSummary = await BookSummary.findOne({ book: bookId });
    if (existingSummary) {
      return NextResponse.json(
        { success: false, message: "Summary already exists" },
        { status: 409 }
      );
    }

    const body = await req.json();
    const { title, content } = body;

    if (
      !title ||
      typeof title !== "string" ||
      !content ||
      typeof content !== "string"
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid markdown content" },
        { status: 400 }
      );
    }

    const plainText = extractPlainText(content);
    const readingTime = calculateReadingTime(plainText);

    const summary = await BookSummary.create({
      book: bookId,
      title: title.trim(),
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
  } catch (error) {
    console.error("POST summary error:", error);
    return NextResponse.json(
      { success: false, message: "Server error while creating summary" },
      { status: 500 }
    );
  }
}

/* =====================================================
   UPDATE SUMMARY (PATCH)
===================================================== */
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

    const existingSummary = await BookSummary.findOne({ book: bookId });
    if (!existingSummary) {
      return NextResponse.json(
        { success: false, message: "Summary not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const update: any = {};

    if (body.title && typeof body.title === "string") {
      update.title = body.title.trim();
    }

    if (body.content && typeof body.content === "string") {
      update.content = body.content;

      const plainText = extractPlainText(body.content);
      update.plainText = plainText;
      update.readingTime = calculateReadingTime(plainText);
    }

    const updatedSummary = await BookSummary.findOneAndUpdate(
      { book: bookId },
      update,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: "Summary updated successfully",
      data: updatedSummary,
    });
  } catch (error) {
    console.error("PATCH summary error:", error);
    return NextResponse.json(
      { success: false, message: "Server error while updating summary" },
      { status: 500 }
    );
  }
}