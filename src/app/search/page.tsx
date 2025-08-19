"use client";
import { QueryClientProvider, useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import api from "@/lib/api";
import MovieCard from "@/components/MovieCard";
import { useState } from "react";
import Loader from "@/components/Loader";

function SearchView() {
  const [title, setTitle] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const { data: savedMovies = [], refetch: refetchSaved } = useQuery({
    queryKey: ["savedMovies"],
    queryFn: async () => {
      const { data } = await api.get("/api/movies/list");
      return data.movies as any[];
    },
  });

  const searchMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.get("/api/movies/search", { params: { title } });
      return data;
    },
    onMutate: () => setResults([]),
    onSuccess: (data) => setResults(data.results || []),
    onError: () => setResults([]),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title) return;
    searchMutation.mutate();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Search Movies</h1>
      <form onSubmit={handleSubmit} className="card p-4 flex gap-3">
        <input className="input flex-1" placeholder="Enter a movie title (e.g., Batman)"
          value={title} onChange={(e) => setTitle(e.target.value)} />
        <button type="submit" className="btn btn-primary whitespace-nowrap"
          disabled={!title || searchMutation.isPending}>
          {searchMutation.isPending ? "Searching..." : "Search"}
        </button>
      </form>

      {searchMutation.isPending ? (
        <Loader />
      ) : results.length === 0 ? (
        <div className="text-center text-white/60">Please Search Movies...!</div>
      ) : (
        <div className="grid grid-auto-fit gap-4">
          {results.map((m) => {
            const isSaved = savedMovies.some((sm) => sm.imdbID === m.imdbID);
            return (
              <MovieCard
                key={m.imdbID}
                {...m}
                saved={isSaved}
                showDelete={isSaved}
                onSaved={() => refetchSaved()}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return <QueryClientProvider client={queryClient}><SearchView /></QueryClientProvider>;
}
