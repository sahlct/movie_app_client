"use client";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

type Props = {
  title: string;
  year: string;
  poster: string;
  imdbID: string;
  onSaved?: () => void;
  saved?: boolean;
  showDelete?: boolean;
};

export default function MovieCard({ title, year, poster, imdbID, onSaved, saved, showDelete }: Props) {
  const saveMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/api/movies/save", { title, year, poster, imdbID });
      return data;
    },
    onSuccess: () => onSaved?.(),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(`/api/movies/${imdbID}`);
      return data;
    },
    onSuccess: () => onSaved?.(),
  });

  return (
    <div className="card overflow-hidden flex flex-col">
      {/* Poster smaller height (was aspect-[2/3]) */}
      <div className="aspect-[2/2.8] bg-white/5 flex items-center justify-center">
        {poster && poster !== "N/A" ? (
          <img src={poster} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-white/40">No Poster</div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title + Year (fixed height area to keep alignment) */}
        <div className="mb-3 min-h-[3.5rem]">
          <div className="font-semibold line-clamp-2">{title}</div>
          <div className="text-white/60 text-sm">{year}</div>
        </div>

        {/* Action Buttons pinned to bottom */}
        <div className="mt-auto flex gap-2">
          {!showDelete && (
            <button
              disabled={saved || saveMutation.isPending}
              onClick={() => saveMutation.mutate()}
              className="btn btn-primary w-full disabled:opacity-50"
            >
              {saved ? "Saved" : saveMutation.isPending ? "Saving..." : "Save"}
            </button>
          )}
          {showDelete && (
            <button
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}
              className="btn btn-outline w-full disabled:opacity-50"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
