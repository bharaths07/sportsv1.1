import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../app/AppProviders';
import { generateRoundRobinMatches } from '../../utils/scheduling/generateRoundRobin';

export const TournamentAutoScheduleScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tournaments, teams: allTeams, matches, addMatch } = useGlobalState();

  useEffect(() => {
    const tournament = tournaments.find(t => t.id === id);

    if (!tournament) {
      navigate('/tournaments');
      return;
    }

    // Guardrail: Check format
    if (tournament.structure?.format !== 'LEAGUE') {
      alert('Only League (Round Robin) format is supported currently.');
      navigate(`/tournament/${id}`);
      return;
    }

    // Guardrail: Check existing matches
    const existingMatches = matches.filter(m => m.tournamentId === id);
    if (existingMatches.length > 0) {
      // If matches exist, we assume this is a revisit or accidental click.
      // We alert and redirect. 
      // Note: If this component re-renders after adding matches but before unmounting, 
      // this check might trigger. However, navigate() usually handles unmounting.
      alert('Matches already exist for this tournament. Clear them first to auto-schedule.');
      navigate(`/tournament/${id}`);
      return;
    }

    const tournamentTeams = allTeams.filter(team => tournament.teams?.includes(team.id));

    if (tournamentTeams.length < 2) {
      alert('At least 2 teams are required to generate fixtures.');
      navigate(`/tournament/${id}`);
      return;
    }

    // Generate
    const generatedMatches = generateRoundRobinMatches(tournamentTeams, tournament.id);

    // Persist
    generatedMatches.forEach(addMatch);

    // Redirect
    navigate(`/tournament/${id}`);

  }, [id, tournaments, allTeams, matches, addMatch, navigate]);

  return (
    <div className="p-6 flex items-center justify-center h-full">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Generating Fixtures...</h2>
        <p className="text-gray-500">Please wait while we schedule matches for your tournament.</p>
      </div>
    </div>
  );
};
