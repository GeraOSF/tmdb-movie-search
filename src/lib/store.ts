import { create } from "zustand";
import { persist, StateStorage, createJSONStorage } from "zustand/middleware";

interface SearchState {
  searchInput: string;
  setInput: (input: string) => void;
}

interface MovieState {
  moviePages: TMDBResponse[] | undefined;
  setMoviePages: (moviePages: TMDBResponse[]) => void;
  solidQuery: string;
  setSolidQuery: (query: string) => void;
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
      moviePages: undefined,
      setMoviePages: (pages) => set({ moviePages: pages }),
      solidQuery: "",
      setSolidQuery: (query) => set({ solidQuery: query }),
    }),
    {
      name: "movies-storage",
    },
  ),
);
