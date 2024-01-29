"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useMoviesStore } from "@/lib/store";

export default function SearchResults() {
  const movies = useMoviesStore((state) => state.movies);

  return (
    <section className="flex flex-col items-center gap-2">
      {movies.map((movie) => (
        <Card key={movie.id} className="flex w-full items-center">
          <CardContent className="flex items-center gap-4 p-4">
            {/* Using picture>img instead of Image from Next to avoid optimization costs
              (https://vercel.com/docs/image-optimization/limits-and-pricing) I usually use Image for static images */}
            <picture>
              <img
                src={`https://image.tmdb.org/t/p/w185/${movie.poster_path}`}
                alt={`${movie.title} movie poster`}
                className="h-48 min-h-48 w-36 min-w-36 rounded-md object-cover shadow-md"
              />
            </picture>
            <div className="flex h-full flex-col items-start gap-4">
              <CardTitle>{movie.title}</CardTitle>
              <CardDescription className="text-left text-base">
                <span className="font-black text-foreground">Overview:</span>{" "}
                {movie.overview}
              </CardDescription>
              <p className="text-sm font-light">
                <span className="font-bold text-foreground">Release date:</span>{" "}
                {movie.release_date.toString()}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
