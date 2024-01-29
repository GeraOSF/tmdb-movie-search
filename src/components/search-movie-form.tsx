"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SearchIcon } from "lucide-react";

import { formSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { searchMovies } from "@/app/_actions";
import { useSearchStore, useMoviesStore } from "@/lib/store";

export default function SearchMovieForm() {
  const [searchInput, setSearchInput] = useSearchStore((state) => [
    state.searchInput,
    state.setInput,
  ]);
  const setMovies = useMoviesStore((state) => state.setMovies);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchQuery: searchInput,
    },
  });

  async function onSubmit({ searchQuery }: z.infer<typeof formSchema>) {
    const response: TMDBResponse = await searchMovies(searchQuery);
    setMovies(response.results);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full max-w-prose gap-2"
      >
        <FormField
          control={form.control}
          name="searchQuery"
          render={({ field }) => (
            <FormItem className="grow">
              <FormControl>
                <Input
                  placeholder="Search movie"
                  type="search"
                  autoComplete="off"
                  onChangeCapture={(e) => setSearchInput(e.currentTarget.value)}
                  {...field}
                  value={searchInput}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="gap-1">
          <SearchIcon />
          <span>Search</span>
        </Button>
      </form>
    </Form>
  );
}
