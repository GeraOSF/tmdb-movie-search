"use client";
import { useEffect, useState, useRef } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { CircleDashedIcon, ArrowUpIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMoviesStore } from "@/lib/store";
import { searchMovies } from "@/app/_actions";

export default function SearchResults() {
  const queryClient = useQueryClient();
  const spinnerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [moviePages, setMoviePages, solidQuery] = useMoviesStore((state) => [
    state.moviePages,
    state.setMoviePages,
    state.solidQuery,
  ]);
  const initialMoviePages = moviePages || [];
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["movie-pages"],
      queryFn: async ({ pageParam }) => {
        const response: TMDBResponse = await searchMovies({
          search: solidQuery,
          page: pageParam,
        });
        if (response) setMoviePages([...initialMoviePages, response]);
        return response;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage: TMDBResponse | undefined) => {
        if (!lastPage) return 1;
        return lastPage.page < lastPage.total_pages
          ? lastPage.page + 1
          : undefined;
      },
      initialData: initialMoviePages.length
        ? {
            pages: initialMoviePages,
            pageParams: initialMoviePages.length
              ? Array.from(
                  { length: initialMoviePages.length },
                  (_, i) => i + 1,
                )
              : [1],
          }
        : undefined,
      enabled: ready,
    });

  useEffect(() => {
    if (!ready && moviePages) {
      queryClient.setQueryData(["movie-pages"], {
        pages: moviePages,
        pageParams: Array.from({ length: moviePages.length }, (_, i) => i + 1),
      });
      setReady(true);
    }
  }, [moviePages, ready, queryClient]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.8,
      },
    );
    if (spinnerRef.current) {
      observer.observe(spinnerRef.current);
    }

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinnerRef]);

  const movieCards =
    (data?.pages[0] &&
      data.pages
        .flatMap((page) => page.results)
        .map((movie) => (
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
                  <span className="font-bold text-foreground">
                    Release date:
                  </span>{" "}
                  {movie.release_date.toString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))) ||
    [];

  return (
    <section className="flex flex-col items-center gap-2">
      {movieCards.length > 0 && movieCards}
      {/* Spinner */}
      <div
        ref={spinnerRef}
        className="my-10 flex h-20 w-full flex-col items-center gap-2"
      >
        {isFetchingNextPage && (
          <CircleDashedIcon className="h-20 w-20 animate-spin text-center" />
        )}
        {!hasNextPage && movieCards.length > 0 && (
          <>
            <p className="italic">Nothing more to load</p>
            <Button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group gap-1"
            >
              <span className="">Move to top</span>
              <ArrowUpIcon className="transition-transform group-hover:-translate-y-1" />
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
