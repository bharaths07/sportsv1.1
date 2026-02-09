import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ id: string }>
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { id } = await params;
  
  return {
    title: `Match ${id} Details`,
    description: `Live scores and details for match ${id}`,
  };
}

export default async function MatchPage({ params }: Props) {
  const { id } = await params;

  // Simulate data fetching
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (id === 'error') {
      throw new Error("Failed to load match data");
  }
  
  if (id === '404') {
      notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Match Details: {id}</h1>
      <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
            <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Live</span>
            <span className="text-gray-500 text-sm">Today, 14:00</span>
        </div>
        <div className="flex justify-between items-center text-xl font-semibold">
            <span>Team A</span>
            <span className="bg-gray-100 px-3 py-1 rounded">2 - 1</span>
            <span>Team B</span>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-gray-600">Match statistics and details will appear here.</p>
        </div>
      </div>
    </div>
  );
}
