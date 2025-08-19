"use client";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import api from "@/lib/api";
import MovieCard from "@/components/MovieCard";
import { useState } from "react";
import Loader from "@/components/Loader";

function SavedView() {
  const [refreshIndex, setRefreshIndex] = useState(0);
  const { data, isLoading } = useQuery({
    queryKey: ["savedMovies", refreshIndex],
    queryFn: async () => {
      const { data } = await api.get("/api/movies/list");
      return data.movies as any[];
    },
  });

  if (isLoading) return <Loader />;

  const movies = data || [];
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center">Your Saved Movies</h1>
      {movies.length === 0 ? (
        <div className="text-center text-white/60">You haven’t saved any movies yet.</div>
      ) : (
        <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
          {movies.map((m) => (
            <MovieCard key={m.imdbID} {...m} saved showDelete
              onSaved={() => setRefreshIndex((i) => i + 1)} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return <QueryClientProvider client={queryClient}><SavedView /></QueryClientProvider>;
}
