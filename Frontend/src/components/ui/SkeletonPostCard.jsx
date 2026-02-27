function SkeletonPostCard() {
  return (
    <div className="glass-surface overflow-hidden rounded-2xl">
      <div className="flex items-center gap-3 p-4">
        <div className="h-10 w-10 animate-pulse rounded-full bg-slate-300/60 dark:bg-slate-700/60" />
        <div className="h-4 w-32 animate-pulse rounded bg-slate-300/60 dark:bg-slate-700/60" />
      </div>
      <div className="aspect-square w-full animate-pulse bg-slate-300/60 dark:bg-slate-700/60" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-full animate-pulse rounded bg-slate-300/60 dark:bg-slate-700/60" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-300/60 dark:bg-slate-700/60" />
      </div>
    </div>
  );
}

export default SkeletonPostCard;
