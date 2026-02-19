'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { bookSchema, genres, type Book } from '../utils/bookSchema';

export default function AddBookPage() {
    const {
        register,
        handleSubmit, 
        formState: { errors },
    } = useForm<Book>({
        resolver: zodResolver(bookSchema),
    });

    const onSubmit = (data: Book) => {
        console.log(data);
        alert('Title successfully added to your library.');
    }

    const inputBaseClasses = "w-full bg-background border border-divider rounded-lg px-4 py-2.5 text-foreground placeholder:text-secondary/50 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all duration-200";
    const labelClasses = "block text-sm font-medium text-primary mb-1.5";
    const errorClasses = "text-red-400 text-xs mt-1.5 font-medium";

    return (
        <section className="min-h-screen px-4 py-12 md:py-20 flex flex-col items-center justify-center">
            
            <div className="text-center flex flex-col gap-3 mb-10 w-full max-w-2xl">
                <h1 className="text-3xl md:text-4xl font-serif text-accent">Curate Your Collection</h1>
                <p className="text-secondary text-sm md:text-base leading-relaxed max-w-md mx-auto">
                    Archive your next great read. Catalog your literary discoveries and build a collection that speaks to your tastes.
                </p>
            </div>

            <div className="w-full max-w-2xl bg-card border border-divider rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/50">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    
                    <div>
                        <label className={labelClasses}>Book Title</label>
                        <input 
                            placeholder="e.g. The Picture of Dorian Gray"
                            {...register("title")} 
                            className={inputBaseClasses} 
                        />
                        {errors.title && <p className={errorClasses}>{errors.title.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClasses}>Author</label>
                            <input 
                                placeholder="e.g. Oscar Wilde"
                                {...register("author")} 
                                className={inputBaseClasses} 
                            />
                            {errors.author && <p className={errorClasses}>{errors.author.message}</p>}
                        </div>

                        <div>
                            <label className={labelClasses}>Publish Year</label>
                            <input 
                                type="number"
                                placeholder="e.g. 1890"
                                {...register("year", { valueAsNumber: true })} 
                                className={inputBaseClasses} 
                            />
                            {errors.year && <p className={errorClasses}>{errors.year.message}</p>}
                        </div>

                        <div>
                            <label className={labelClasses}>Genre</label>
                            <select 
                                {...register("genre")} 
                                className={`${inputBaseClasses} appearance-none cursor-pointer`}
                            >
                                <option value="">Select a genre...</option>
                                {genres && genres.map((g) => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                            {errors.genre && <p className={errorClasses}>{errors.genre.message}</p>}
                        </div>

                        <div>
                            <label className={labelClasses}>Rating (1-5)</label>
                            <input 
                                type="number" 
                                step="0.1"
                                placeholder="e.g. 4.5"
                                {...register("rating", { valueAsNumber: true })} 
                                className={inputBaseClasses} 
                            />
                            {errors.rating && <p className={errorClasses}>{errors.rating.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className={labelClasses}>Description & Thoughts</label>
                        <textarea 
                            rows={4}
                            placeholder="Briefly describe the plot or your personal thoughts..."
                            {...register("description")} 
                            className={`${inputBaseClasses} resize-none`} 
                        />
                        {errors.description && <p className={errorClasses}>{errors.description.message}</p>}
                    </div>

                    <div>
                        <label className={labelClasses}>Cover Image</label>
                        <input 
                            type="file" 
                            accept="image/*"
                            {...register("coverImage")} 
                            className="w-full text-sm text-secondary 
                            file:mr-4 file:py-2 file:px-4 
                            file:rounded-lg file:border-0 
                            file:text-sm file:font-semibold 
                            file:bg-divider file:text-primary 
                            hover:file:bg-opacity-80 
                            transition-all cursor-pointer" 
                        />
                        {errors.coverImage && <p className={errorClasses}>{errors.coverImage.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-4 bg-accent text-[#1A1A1A] font-bold py-3 px-4 rounded-lg 
                        hover:bg-[#a697ff] hover:scale-[1.02] active:scale-95 
                        transition-all duration-200 ease-out shadow-[0_0_15px_rgba(147,129,255,0.15)]"
                    >
                        Add to Library
                    </button>
                </form>
            </div>
        </section>
    );
}