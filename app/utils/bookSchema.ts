import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const genres = [
    "Fiction",
    "Non-Fiction",
    "Sci-Fi",
    "Fantasy",
    "Biography",
] as const;

export const bookSchema = z.object({
    title: z
        .string()
        .min(2, "Title must be at least 2 characters")
        .max(100, "Title is too long"),
    author: z.string().min(2, "Author name must be at least 2 characters"),
    description: z.string().min(10, { message: "Description should be clear" }),
    year: z
        .number("Year must be a number")
        .int("Year must be an integer")
        .gte(1450, "Year must be after the invention of the printing press")
        .lte(new Date().getFullYear(), "Year cannot be in the future"),
    genre: z.enum(genres, "Please select a genre"),
    rating: z
        .number("Rating must be a number")
        .min(1, "Minimum rating is 1")
        .max(5, "Maximum rating is 5"),

    coverImage: z
        .custom<FileList>()
        .refine((files) => files && files.length > 0, "Cover image is required.")
        .refine((files) => files[0]?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files[0]?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        )
});

export type Book = z.infer<typeof bookSchema>;