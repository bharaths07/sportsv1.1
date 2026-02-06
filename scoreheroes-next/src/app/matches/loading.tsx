export default function Loading() {
  return (
    <div className="container py-8">
      <div className="h-9 w-32 bg-muted rounded mb-6 animate-pulse" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 rounded-lg border bg-card p-6 shadow-sm animate-pulse">
            <div className="flex justify-between mb-4">
              <div className="h-5 w-16 bg-muted rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-2/3 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
