export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] p-24 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
        Welcome to ScoreHeroes
      </h1>
      <p className="text-xl text-muted-foreground max-w-[600px] mb-8">
        The ultimate platform to manage your sports tournaments, track live scores, and engage with your community.
      </p>
      <div className="flex gap-4">
        <a
          href="/matches"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          View Matches
        </a>
        <a
          href="/teams"
          className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          Find Teams
        </a>
      </div>
    </main>
  );
}
