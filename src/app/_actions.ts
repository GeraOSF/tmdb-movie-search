"use server";
import { formSchema } from "@/lib/schema";

export async function searchMovies(search: string) {
  try {
    // Revalidate server side
    formSchema.parse({ searchQuery: search });

    return await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${search}&api_key=${process.env.TMDB_API_KEY}`,
    ).then((res) => res.json());
  } catch (error) {
    console.error(error);
  }
}
