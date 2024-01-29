import { create } from "zustand";
import { persist, StateStorage, createJSONStorage } from "zustand/middleware";

interface SearchState {
  searchInput: string;
  setInput: (input: string) => void;
}

interface MovieState {
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
}

const hashStorage: StateStorage = {
  getItem: (key): string => {
    const searchParams = new URLSearchParams(location.hash.slice(1));
    const storedValue = searchParams.get(key) ?? "";
    return JSON.parse(storedValue);
  },
  setItem: (key, newValue): void => {
    const searchParams = new URLSearchParams(location.hash.slice(1));
    searchParams.set(key, JSON.stringify(newValue));
    location.hash = searchParams.toString();
  },
  removeItem: (key): void => {
    const searchParams = new URLSearchParams(location.hash.slice(1));
    searchParams.delete(key);
    location.hash = searchParams.toString();
  },
};

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      searchInput: "",
      setInput: (input) => set({ searchInput: input }),
    }),
    {
      name: "search",
      storage: createJSONStorage(() => hashStorage),
    },
  ),
);

export const useMoviesStore = create<MovieState>()(
  persist(
    (set) => ({
      movies: [],
      setMovies: (movies) => set({ movies }),
    }),
    {
      name: "movies-storage",
    },
  ),
);
