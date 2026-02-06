import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Matches",
  description: "Check out the ongoing and upcoming matches.",
};

async function getMatches() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return [
    { id: 1, teamA: "Thunderbolts", teamB: "Titans", score: "145/4 - 142/9", status: "Live" },
    { id: 2, teamA: "Warriors", teamB: "Royals", score: "Pending", status: "Upcoming" },
    { id: 3, teamA: "Eagles", teamB: "Sharks", score: "210/5 - 180/10", status: "Completed" },
  ];
}

export default async function MatchesPage() {
  const matches = await getMatches();

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Matches</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => (
          <div key={match.id} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                match.status === 'Live' ? 'bg-red-100 text-red-700' :
                match.status === 'Completed' ? 'bg-green-100 text-green-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {match.status}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{match.teamA}</span>
              <span className="text-muted-foreground">vs</span>
              <span className="font-semibold">{match.teamB}</span>
            </div>
            <div className="text-center text-sm font-medium mt-4">
              {match.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
