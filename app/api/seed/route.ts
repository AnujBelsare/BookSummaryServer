import connectDB from "@/app/lib/db";
import Book from "@/app/models/Book";
import { NextResponse } from "next/server";

// Cleaned data ready for Mongoose insertion
const seedData = [
  {
    title: "1984",
    author: "George Orwell",
    description: "A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=1984",
    publishedDate: "1949-06-08T00:00:00.000Z",
    isbn: "978-0451524935",
    genres: ["Sci-Fi", "Dystopian"],
    averageRating: 4.8
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "A novel about the serious issues of rape and racial inequality, told through the eyes of a child.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=To+Kill+a+Mockingbird",
    publishedDate: "1960-07-11T00:00:00.000Z",
    isbn: "978-0060935467",
    genres: ["Fiction", "Classic"],
    averageRating: 4.9
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    description: "A sweeping science fiction epic set on the desert planet Arrakis.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=Dune",
    publishedDate: "1965-08-01T00:00:00.000Z",
    isbn: "978-0441172719",
    genres: ["Sci-Fi", "Adventure"],
    averageRating: 4.7
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description: "A fantasy novel that follows the quest of home-loving Bilbo Baggins.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=The+Hobbit",
    publishedDate: "1937-09-21T00:00:00.000Z",
    isbn: "978-0547928227",
    genres: ["Fantasy", "Adventure"],
    averageRating: 4.8
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    description: "Explores the history of the human species from the Stone Age up to the twenty-first century.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=Sapiens",
    publishedDate: "2011-01-01T00:00:00.000Z",
    isbn: "978-0062316097",
    genres: ["Non-Fiction", "History"],
    averageRating: 4.6
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    description: "An easy and proven way to build good habits and break bad ones.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=Atomic+Habits",
    publishedDate: "2018-10-16T00:00:00.000Z",
    isbn: "978-0735211292",
    genres: ["Non-Fiction", "Self-Help"],
    averageRating: 4.9
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A novel about the American dream, wealth, and tragedy in the roaring twenties.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=The+Great+Gatsby",
    publishedDate: "1925-04-10T00:00:00.000Z",
    isbn: "978-0743273565",
    genres: ["Fiction", "Classic"],
    averageRating: 4.4
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "A romantic novel that charts the emotional development of the protagonist Elizabeth Bennet.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=Pride+and+Prejudice",
    publishedDate: "1813-01-28T00:00:00.000Z",
    isbn: "978-1503290563",
    genres: ["Romance", "Classic"],
    averageRating: 4.7
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    description: "The story of Holden Caulfield's experiences in New York City after being expelled from prep school.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=The+Catcher+in+the+Rye",
    publishedDate: "1951-07-16T00:00:00.000Z",
    isbn: "978-0316769488",
    genres: ["Fiction", "Coming-of-Age"],
    averageRating: 4.2
  },
  {
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    description: "A dystopian novel about a future American society where books are outlawed.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=Fahrenheit+451",
    publishedDate: "1953-10-19T00:00:00.000Z",
    isbn: "978-1451673319",
    genres: ["Sci-Fi", "Dystopian"],
    averageRating: 4.5
  },
  {
    title: "The Diary of a Young Girl",
    author: "Anne Frank",
    description: "The writings from the Dutch-language diary kept by Anne Frank while she was in hiding.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=The+Diary+of+a+Young+Girl",
    publishedDate: "1947-06-25T00:00:00.000Z",
    isbn: "978-0553296983",
    genres: ["Biography", "Non-Fiction"],
    averageRating: 4.7
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    description: "Explains the two systems that drive the way we think.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=Thinking+Fast+and+Slow",
    publishedDate: "2011-10-25T00:00:00.000Z",
    isbn: "978-0374533557",
    genres: ["Non-Fiction", "Psychology"],
    averageRating: 4.6
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    description: "A novel about an Andalusian shepherd boy who yearns to travel in search of a worldly treasure.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=The+Alchemist",
    publishedDate: "1988-01-01T00:00:00.000Z",
    isbn: "978-0062315007",
    genres: ["Fiction", "Fantasy"],
    averageRating: 4.3
  },
  {
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    description: "The story of Amir, a young boy from the Wazir Akbar Khan district of Kabul.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=The+Kite+Runner",
    publishedDate: "2003-05-29T00:00:00.000Z",
    isbn: "978-1594631931",
    genres: ["Historical Fiction", "Drama"],
    averageRating: 4.8
  },
  {
    title: "A Game of Thrones",
    author: "George R.R. Martin",
    description: "The first book in the epic fantasy series A Song of Ice and Fire.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=A+Game+of+Thrones",
    publishedDate: "1996-08-01T00:00:00.000Z",
    isbn: "978-0553593716",
    genres: ["Fantasy", "Epic"],
    averageRating: 4.7
  },
  {
    title: "The Book Thief",
    author: "Markus Zusak",
    description: "Narrated by Death, a story about a young girl living with a foster family in Nazi Germany.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=The+Book+Thief",
    publishedDate: "2005-09-01T00:00:00.000Z",
    isbn: "978-0375842207",
    genres: ["Historical Fiction", "Young Adult"],
    averageRating: 4.9
  },
  {
    title: "Animal Farm",
    author: "George Orwell",
    description: "A satirical allegorical novella that tells the story of a group of farm animals who rebel against their human farmer.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=Animal+Farm",
    publishedDate: "1945-08-17T00:00:00.000Z",
    isbn: "978-0451526342",
    genres: ["Fiction", "Satire"],
    averageRating: 4.6
  },
  {
    title: "The Martian",
    author: "Andy Weir",
    description: "An American astronaut is stranded on Mars and must use his ingenuity to survive.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=The+Martian",
    publishedDate: "2011-09-27T00:00:00.000Z",
    isbn: "978-0553418026",
    genres: ["Sci-Fi", "Thriller"],
    averageRating: 4.8
  },
  {
    title: "Gone Girl",
    author: "Gillian Flynn",
    description: "A thriller novel exploring the mysteries of a marriage when the wife goes missing on their fifth anniversary.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=Gone+Girl",
    publishedDate: "2012-05-24T00:00:00.000Z",
    isbn: "978-0307588371",
    genres: ["Mystery", "Thriller"],
    averageRating: 4.5
  },
  {
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    description: "A psychological thriller featuring a disgraced journalist and a brilliant computer hacker.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=The+Girl+with+the+Dragon+Tattoo",
    publishedDate: "2005-08-01T00:00:00.000Z",
    isbn: "978-0307949486",
    genres: ["Mystery", "Crime"],
    averageRating: 4.6
  },
  {
    title: "Educated",
    author: "Tara Westover",
    description: "A memoir about a young woman who grows up in a survivalist family in Idaho and eventually escapes to earn a PhD.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=Educated",
    publishedDate: "2018-02-20T00:00:00.000Z",
    isbn: "978-0399590504",
    genres: ["Biography", "Memoir"],
    averageRating: 4.8
  },
  {
    title: "Becoming",
    author: "Michelle Obama",
    description: "The memoir of former United States First Lady Michelle Obama.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=Becoming",
    publishedDate: "2018-11-13T00:00:00.000Z",
    isbn: "978-1524763138",
    genres: ["Biography", "Memoir"],
    averageRating: 4.9
  },
  {
    title: "The Silent Patient",
    author: "Alex Michaelides",
    description: "A psychological thriller about a woman's act of violence against her husband and the therapist obsessed with uncovering her motive.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=The+Silent+Patient",
    publishedDate: "2019-02-05T00:00:00.000Z",
    isbn: "978-1250301697",
    genres: ["Thriller", "Mystery"],
    averageRating: 4.4
  },
  {
    title: "Project Hail Mary",
    author: "Andy Weir",
    description: "A lone astronaut must save the earth from disaster in this science fiction thriller.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=Project+Hail+Mary",
    publishedDate: "2021-05-04T00:00:00.000Z",
    isbn: "978-0593135204",
    genres: ["Sci-Fi", "Adventure"],
    averageRating: 4.9
  },
  {
    title: "Good Omens",
    author: "Neil Gaiman & Terry Pratchett",
    description: "A comedy about the birth of the son of Satan and the coming of the End Times.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=Good+Omens",
    publishedDate: "1990-05-01T00:00:00.000Z",
    isbn: "978-0060853983",
    genres: ["Fantasy", "Comedy"],
    averageRating: 4.6
  },
  {
    title: "The Da Vinci Code",
    author: "Dan Brown",
    description: "A symbologist and a cryptologist attempt to solve a murder in the Louvre Museum.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=The+Da+Vinci+Code",
    publishedDate: "2003-03-18T00:00:00.000Z",
    isbn: "978-0307474278",
    genres: ["Mystery", "Thriller"],
    averageRating: 4.1
  },
  {
    title: "Neuromancer",
    author: "William Gibson",
    description: "One of the best-known works in the cyberpunk genre, following a washed-up computer hacker hired for a grand heist.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=Neuromancer",
    publishedDate: "1984-07-01T00:00:00.000Z",
    isbn: "978-0441569595",
    genres: ["Sci-Fi", "Cyberpunk"],
    averageRating: 4.3
  },
  {
    title: "The Hunger Games",
    author: "Suzanne Collins",
    description: "In a dystopian future, teens are selected to fight to the death in a televised spectacle.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=The+Hunger+Games",
    publishedDate: "2008-09-14T00:00:00.000Z",
    isbn: "978-0439023481",
    genres: ["Sci-Fi", "Young Adult"],
    averageRating: 4.7
  },
  {
    title: "Steve Jobs",
    author: "Walter Isaacson",
    description: "The exclusive biography of Steve Jobs, based on more than forty interviews with him.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=Steve+Jobs",
    publishedDate: "2011-10-24T00:00:00.000Z",
    isbn: "978-1451648539",
    genres: ["Biography", "Business"],
    averageRating: 4.6
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    description: "A dystopian novel exploring the loss of individual identity in a technologically advanced society.",
    coverImage: "https://placehold.co/300x450/eeeeee/999999?text=Brave+New+World",
    publishedDate: "1932-01-01T00:00:00.000Z",
    isbn: "978-0060850524",
    genres: ["Sci-Fi", "Dystopian"],
    averageRating: 4.4
  }
];

export async function POST(req: Request) {
    try {
        await connectDB();

        // ⚠️ UNCOMMENT THE LINE BELOW if you want to wipe existing books before seeding!
        // await Book.deleteMany({});

        // Insert the array of books into the database
        const insertedBooks = await Book.insertMany(seedData);

        return NextResponse.json(
            {
                success: true,
                message: "Database seeded successfully!",
                count: insertedBooks.length,
                data: insertedBooks
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Seeding error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error while seeding the database.",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}