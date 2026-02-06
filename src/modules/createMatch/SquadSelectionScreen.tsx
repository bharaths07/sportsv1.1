import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../app/AppProviders';
import { Match } from '../../domain/match';
import { Team } from '../../domain/team';
import { ChevronLeft, Crown, Shield, Plus } from 'lucide-react';
import { Player } from '../../domain/player';

export const SquadSelectionScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  const matchId = searchParams.get('matchId');
  const navigate = useNavigate();
  const { matches, teams, players, updateMatch } = useGlobalState();
  const [match, setMatch] = useState<Match | null>(null);
  
  // Team A State
  const [teamASquad, setTeamASquad] = useState<Set<string>>(new Set());
  const [teamACaptainId, setTeamACaptainId] = useState<string | undefined>();
  const [teamAWicketKeeperId, setTeamAWicketKeeperId] = useState<string | undefined>();

  // Team B State
  const [teamBSquad, setTeamBSquad] = useState<Set<string>>(new Set());
  const [teamBCaptainId, setTeamBCaptainId] = useState<string | undefined>();
  const [teamBWicketKeeperId, setTeamBWicketKeeperId] = useState<string | undefined>();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resolved Data
  const [teamA, setTeamA] = useState<Team | undefined>();
  const [teamB, setTeamB] = useState<Team | undefined>();

  useEffect(() => {
    if (matchId && matches.length > 0) {
      const foundMatch = matches.find(m => m.id === matchId);
      if (foundMatch) {
        setMatch(foundMatch);
        const tA = teams.find(t => t.id === foundMatch.homeParticipant.id);
        const tB = teams.find(t => t.id === foundMatch.awayParticipant.id);
        setTeamA(tA);
        setTeamB(tB);

        // Pre-fill if already exists (optional, but good for editing if we supported it)
        if (foundMatch.homeParticipant.squad) {
             setTeamASquad(new Set(foundMatch.homeParticipant.squad.playerIds));
             setTeamACaptainId(foundMatch.homeParticipant.squad.captainId);
             setTeamAWicketKeeperId(foundMatch.homeParticipant.squad.wicketKeeperId);
        }
        if (foundMatch.awayParticipant.squad) {
             setTeamBSquad(new Set(foundMatch.awayParticipant.squad.playerIds));
             setTeamBCaptainId(foundMatch.awayParticipant.squad.captainId);
             setTeamBWicketKeeperId(foundMatch.awayParticipant.squad.wicketKeeperId);
        }
      }
    }
  }, [matchId, matches, teams]);

  const togglePlayer = (teamId: string, playerId: string) => {
    if (!match) return;
    
    if (teamId === match.homeParticipant.id) {
        const newSet = new Set(teamASquad);
        if (newSet.has(playerId)) {
            newSet.delete(playerId);
            if (teamACaptainId === playerId) setTeamACaptainId(undefined);
            if (teamAWicketKeeperId === playerId) setTeamAWicketKeeperId(undefined);
        } else {
            newSet.add(playerId);
        }
        setTeamASquad(newSet);
    } else {
        const newSet = new Set(teamBSquad);
        if (newSet.has(playerId)) {
            newSet.delete(playerId);
            if (teamBCaptainId === playerId) setTeamBCaptainId(undefined);
            if (teamBWicketKeeperId === playerId) setTeamBWicketKeeperId(undefined);
        } else {
            newSet.add(playerId);
        }
        setTeamBSquad(newSet);
    }
  };

  const setCaptain = (teamId: string, playerId: string) => {
      if (!match) return;
      if (teamId === match.homeParticipant.id) {
          setTeamACaptainId(prev => prev === playerId ? undefined : playerId);
      } else {
          setTeamBCaptainId(prev => prev === playerId ? undefined : playerId);
      }
  };

  const setWicketKeeper = (teamId: string, playerId: string) => {
      if (!match) return;
      if (teamId === match.homeParticipant.id) {
          setTeamAWicketKeeperId(prev => prev === playerId ? undefined : playerId);
      } else {
          setTeamBWicketKeeperId(prev => prev === playerId ? undefined : playerId);
      }
  };

  const handleConfirmSquads = () => {
      if (!match) return;
      setIsSubmitting(true);

      const updatedMatch = {
          ...match,
          homeParticipant: {
              ...match.homeParticipant,
              squad: {
                  playerIds: Array.from(teamASquad),
                  captainId: teamACaptainId,
                  wicketKeeperId: teamAWicketKeeperId
              }
          },
          awayParticipant: {
              ...match.awayParticipant,
              squad: {
                  playerIds: Array.from(teamBSquad),
                  captainId: teamBCaptainId,
                  wicketKeeperId: teamBWicketKeeperId
              }
          }
      };

      // In a real app we might call an API. Here we update global state.
      setTimeout(() => {
          updateMatch(match.id, {
            homeParticipant: updatedMatch.homeParticipant,
            awayParticipant: updatedMatch.awayParticipant
          });
          setIsSubmitting(false);
          navigate(`/match/${match.id}/live`);
      }, 500);
  };

  if (!match || !teamA || !teamB) {
      return <div className="p-4">Loading squads...</div>;
  }

  const renderTeamSection = (team: Team, squad: Set<string>, captainId: string | undefined, wkId: string | undefined, isHome: boolean) => {
      // Resolve players
      const teamPlayers = team.members.map(m => {
          const p = players.find(pl => pl.id === m.playerId);
          return { ...m, details: p };
      }).filter(m => m.details); // Only show if player details found

      return (
          <div className="bg-white mb-6 shadow-sm border-b border-slate-200">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center sticky top-[60px] z-10">
                  <h2 className="font-bold text-slate-800">{team.name} <span className="font-normal text-slate-500 text-sm">— Squad</span></h2>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${squad.size >= 7 ? 'bg-teal-100 text-teal-800' : 'bg-orange-100 text-orange-800'}`}>
                      Selected: {squad.size} / 11
                  </span>
              </div>
              <div>
                  {teamPlayers.map(member => {
                      const isSelected = squad.has(member.playerId);
                      const isCaptain = captainId === member.playerId;
                      const isWK = wkId === member.playerId;
                      const isInvited = member.details?.status === 'invited';

                      return (
                          <div key={member.playerId} className={`flex items-center justify-between p-4 border-b border-slate-100 last:border-0 ${isSelected ? 'bg-white' : 'bg-slate-50/50'}`}>
                              <div className="flex items-center gap-3 flex-1" onClick={() => togglePlayer(team.id, member.playerId)}>
                                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-teal-600 border-teal-600' : 'border-slate-300 bg-white'}`}>
                                      {isSelected && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                  </div>
                                  <div>
                                      <div className={`font-medium flex items-center gap-2 ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
                                          {member.details?.firstName} {member.details?.lastName}
                                          {isInvited && <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100 font-bold uppercase tracking-wider">Invited</span>}
                                      </div>
                                      <div className="text-xs text-slate-400 capitalize">{member.role}</div>
                                  </div>
                              </div>
                              
                              {isSelected && (
                                  <div className="flex items-center gap-2">
                                      <button 
                                        onClick={() => setCaptain(team.id, member.playerId)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center border text-xs font-bold transition-all ${isCaptain ? 'bg-yellow-100 border-yellow-400 text-yellow-700 shadow-sm' : 'border-slate-200 text-slate-300 hover:border-slate-300'}`}
                                        title="Captain"
                                      >
                                          C
                                      </button>
                                      <button 
                                        onClick={() => setWicketKeeper(team.id, member.playerId)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center border text-xs font-bold transition-all ${isWK ? 'bg-blue-100 border-blue-400 text-blue-700 shadow-sm' : 'border-slate-200 text-slate-300 hover:border-slate-300'}`}
                                        title="Wicket Keeper"
                                      >
                                          WK
                                      </button>
                                  </div>
                              )}
                          </div>
                      );
                  })}
                  
                  <button 
                    onClick={() => navigate(`/start-match/add-player?teamId=${team.id}&matchId=${match?.id}`)}
                    className="w-full py-4 text-teal-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                  >
                      <Plus className="w-4 h-4" />
                      Add player
                  </button>
              </div>
          </div>
      );
  };

  const isTeamAValid = teamASquad.size >= 7;
  const isTeamBValid = teamBSquad.size >= 7;
  const canConfirm = isTeamAValid && isTeamBValid;

  return (
    <div className="min-h-screen bg-slate-100 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 flex items-center sticky top-0 z-20 shadow-sm">
        <button onClick={() => navigate(-1)} className="mr-3 p-1 rounded-full hover:bg-slate-100">
          <ChevronLeft className="w-6 h-6 text-slate-700" />
        </button>
        <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">Select squads</h1>
            <p className="text-xs text-slate-500">Select players who will play this match</p>
        </div>
      </div>

      <div className="pt-2">
          {renderTeamSection(teamA, teamASquad, teamACaptainId, teamAWicketKeeperId, true)}
          {renderTeamSection(teamB, teamBSquad, teamBCaptainId, teamBWicketKeeperId, false)}
      </div>

      {/* Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20">
          <button
            onClick={handleConfirmSquads}
            disabled={!canConfirm || isSubmitting}
            className={`
                w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2
                ${canConfirm && !isSubmitting
                  ? 'bg-teal-600 text-white shadow-lg hover:bg-teal-700 active:scale-[0.98]' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
            `}
          >
            {isSubmitting ? 'Saving squads...' : 'Confirm squads'}
          </button>
          {!canConfirm && (
              <p className="text-center text-xs text-slate-400 mt-2">
                  Select at least 7 players for both teams to continue
              </p>
          )}
      </div>
    </div>
  );
};
