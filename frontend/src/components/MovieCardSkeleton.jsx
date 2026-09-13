function MovieCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03]">
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden bg-white/[0.04]">
        <div className="h-full w-full animate-pulse bg-white/[0.06]" />

        {/* Fake rating badge */}
        <div className="absolute right-3 top-3 h-7 w-12 animate-pulse rounded-lg bg-white/[0.08]" />
      </div>

      {/* Movie information */}
      <div className="p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-white/[0.08]" />

        <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-white/[0.05]" />

        <div className="mt-4 h-3 w-1/3 animate-pulse rounded bg-white/[0.05]" />
      </div>
    </div>
  );
}

export default MovieCardSkeleton;
