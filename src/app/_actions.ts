"use server";
import { formSchema } from "@/lib/schema";

export async function searchMovies({
  search,
  page = 1,
}: {
  search: string;
  page?: number;
}) {
  try {
    // Revalidate server side
    formSchema.parse({ searchQuery: search });

    console.log("searching for", search, "page", page);
    return await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${search}&page=${page}&api_key=${process.env.TMDB_API_KEY}`,
    ).then((res) => res.json());
  } catch (error) {
    console.error(error);
  }
}
