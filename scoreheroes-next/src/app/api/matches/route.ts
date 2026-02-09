import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { id: '1', team1: 'Mumbai Indians', team2: 'Chennai Super Kings', score: '180/4 - 175/6', status: 'Finished' },
    { id: '2', team1: 'Arsenal', team2: 'Liverpool', score: '2-2', status: 'Live' },
    { id: '3', team1: 'Lakers', team2: 'Warriors', score: '110 - 108', status: 'Finished' },
  ]);
}
