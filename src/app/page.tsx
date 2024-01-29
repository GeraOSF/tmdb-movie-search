import SearchMovieForm from "@/components/search-movie-form";
import SearchResults from "@/components/search-results";

export default async function Home() {
  return (
    <main className="container p-2 text-center">
      <h1 className="mb-2 py-4 text-4xl font-black">TMDB Movie Search 🎥</h1>
      <section className="flex flex-col items-center gap-6">
        <SearchMovieForm />
        <SearchResults />
      </section>
    </main>
  );
}
