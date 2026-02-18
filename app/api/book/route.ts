import connectDB from "@/app/lib/db";
import Book from "@/app/models/Book";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);

        // Search queries...
        const search = searchParams.get("search") || "";
        const author = searchParams.get("author");
        const genre = searchParams.get("genre");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        const filter: any = {};

        if (search) {
            filter.title = { $regex: search, $options: "i" };
        }

        if (author) {
            filter.author = author;
        }

        if (genre) {
            filter.genre = genre;
        }

        const skip = (page - 1) * limit;

        const books = await Book.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();


        if (!books) {
            return NextResponse.json({ message: 'No books found' }, { status: 404 });
        }

        const total = await Book.countDocuments(filter);

        return NextResponse.json(
            {
                success: true,
                total,
                page,
                totalPages: Math.ceil(total / limit),
                data: books,
            },
            { status: 200 });
    }
    catch (err) {
        return NextResponse.json(
            {
                success: false,
                message: "Server error while loading books",
            },
            { status: 500 }
        );
    }
}



export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();
        const { title, author, isbn, genres } = body;

        if (!title || !author) {
            return NextResponse.json(
                { success: false, message: "Title and author are required" },
                { status: 400 }
            );
        }

        // Prevent duplicate ISBN
        if (isbn) {
            const existing = await Book.findOne({ isbn });
            if (existing) {
                return NextResponse.json(
                    { success: false, message: "Book with this ISBN already exists" },
                    { status: 409 }
                );
            }
        }

        const book = await Book.create({
            ...body,
            genres: genres?.map((g: string) => g.trim().toLowerCase()),
        });

        return NextResponse.json(
            { success: true, data: book },
            { status: 201 }
        );

    } catch (error) {
        console.error("Book create error:", error);

        return NextResponse.json(
            { success: false, message: "Error creating book" },
            { status: 500 }
        );
    }
}

