import connectDB from "@/app/lib/db";
import Book from "@/app/models/Book";
import { NextResponse } from "next/server";
import cloudinary from "@/app/lib/cloudinary";

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

        const formData = await req.formData();
        
        const title = formData.get("title") as string;
        const author = formData.get("author") as string;
        const isbn = formData.get("isbn") as string;
        const description = formData.get("description") as string;
        const year = formData.get("year") as string;
        const genre = formData.get("genre") as string;
        const rating = formData.get("rating") as string;
        const coverImage = formData.get("coverImage") as File | null;

        if (!title || !author || !isbn) {
            return NextResponse.json(
                { success: false, message: "Title, author, and ISBN are required." },
                { status: 400 }
            );
        }

        const existing = await Book.findOne({ isbn });
        if (existing) {
            return NextResponse.json(
                { success: false, message: "A book with this ISBN already exists in the library." },
                { status: 409 }
            );
        }

        let coverImageUrl = "";
        
        if (coverImage && coverImage.size > 0) {
            const arrayBuffer = await coverImage.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            
            const base64Image = `data:${coverImage.type};base64,${buffer.toString("base64")}`;

            const uploadResponse = await cloudinary.uploader.upload(base64Image, {
                folder: "aquilastudios_library", 
            });
            
            coverImageUrl = uploadResponse.secure_url;
        }

        const book = await Book.create({
            title,
            author,
            isbn,
            description,
            publishedDate: year ? new Date(parseInt(year), 0, 1) : undefined,
            genres: genre ? [genre.trim()] : [],
            averageRating: rating ? parseFloat(rating) : 0,
            coverImage: coverImageUrl,
        });

        return NextResponse.json(
            { success: true, data: book },
            { status: 201 }
        );

    } catch (error) {
        console.error("Book creation error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error while creating book." },
            { status: 500 }
        );
    }
}

