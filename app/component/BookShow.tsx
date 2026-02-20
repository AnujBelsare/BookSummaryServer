'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import toast from 'react-hot-toast';

export interface Book {
    _id: string; 
    title: string;
    author: string;
    isbn?: string;
    description?: string;
    genres: string[];
    averageRating: number; 
    coverImage: string; 
}

const toastStyle = {
    background: '#222222',
    color: '#F0ECE2',
    border: '1px solid #2A2A2A',
};

function BookShow() {
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true); // Changed to isLoading & default to true
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        total: 0
    });

    const fetchBook = async (page = 1, search = "", genre = "") => {
        try {
            setIsLoading(true);

            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: "10",
            });

            if (search) queryParams.append("search", search);
            if (genre) queryParams.append("genre", genre);

            const res = await fetch(`/api/book?${queryParams.toString()}`, {
                method: "GET"
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "failed to get the books");
            }

            setBooks(result.data || []);
            setPagination({
                page: result.page,
                totalPages: result.totalPages,
                total: result.total
            });
        }
        catch (error: any) {
            console.error("Fetch Error:", error);
            toast.error(error.message || "An unexpected error occurred.", {
                style: toastStyle,
            });
            setBooks([]);
        }
        finally {
            setIsLoading(false);
        }
    }

    // ✨ NEW: This tells React to run the fetch when the page loads
    useEffect(() => {
        fetchBook();
    }, []);

    return (
        <section className="max-w-7xl mx-auto px-2 py-12">
            {/* Cool linear Heading */}
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-sm font-serif">
                    Books To Read
                </h2>
                <div className="h-1 flex-1 bg-linear-to-r from-indigo-500/20 to-transparent ml-6 rounded-full hidden sm:block"></div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <BeatLoader color="#8b5cf6" size={15} /> 
                </div>
            ) : books.length === 0 ? (
                <div className="text-center text-gray-400 py-20">
                    <p className="text-xl">No books found.</p>
                </div>
            ) : (
                /* Responsive Grid */
                <div className="z-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-2.5">
                    {books.map((book) => (
                        <div
                            key={book._id}
                            className="group relative flex flex-col bg-card rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl transition-all duration-300 ease-out overflow-hidden"
                        >
                            {/* Image Container */}
                            <div className="relative w-full h-44 bg-divider flex items-center justify-center overflow-hidden p-6">
                                <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/5 z-0"></div>

                                {/* Frosted Glass Genre Badge - Updated to grab the first genre */}
                                <div className="absolute top-3 right-3 z-10 bg-[#4929c833] backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[10px] font-bold text-gray-700 dark:text-gray-200 uppercase tracking-widest shadow-sm">
                                    {book.genres?.[0] || 'Unknown'} 
                                </div>

                                <Image
                                    height={240}
                                    width={180}
                                    src={book.coverImage}
                                    alt={book.title}
                                    className="relative z-0 w-auto h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                                    loading="lazy"
                                />
                            </div>

                            {/* Content Container */}
                            <div className="flex flex-col flex-1 p-2">
                                <div className="text-center mb-5 flex-1">
                                    <p className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-1">
                                        {book.author}
                                    </p>
                                    <h3 className="text-lg font-bold text-white line-clamp-2 mb-2">
                                        {book.title}
                                    </h3>

                                    {/* Rating Indicator */}
                                    <div className="flex items-center justify-center gap-1.5">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-4 h-4 text-amber-400"
                                        >
                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm font-semibold text-gray-300">
                                            {book.averageRating}
                                        </span>
                                    </div>
                                </div>

                                {/* Call to Action Button */}
                                <Link
                                    href={'/'}
                                    className="block w-full text-center py-3 px-6 hover:bg-indigo-400 bg-accent text-gray-200 font-semibold rounded-xl transition-colors duration-300"
                                >
                                    Read Summary
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default BookShow;