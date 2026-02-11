import React, { useState } from 'react';
import { Match } from '../../../domain/match';
import { useGlobalState } from '../../../app/AppProviders';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Activity } from 'lucide-react';

interface FootballLiveScorerProps {
  match: Match;
  onEndMatch: () => void;
  isEnding: boolean;
}

export const FootballLiveScorer: React.FC<FootballLiveScorerProps> = ({ match, onEndMatch, isEnding }) => {
  const { scoreMatch, players } = useGlobalState();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'goal' | 'card' | null>(null);
  
  // Helper to get player details
  const getPlayer = (id: string) => players.find(p => p.id === id);

  const handleGoalClick = (teamId: string) => {
    setSelectedTeamId(teamId);
    setActionType('goal');
  };

  // const handleCardClick = (teamId: string) => {
  //   setSelectedTeamId(teamId);
  //   setActionType('card');
  // };

  const confirmGoal = (scorerId?: string, assistId?: string) => {
    if (!selectedTeamId) return;

    scoreMatch(match.id, {
      type: 'goal',
      teamId: selectedTeamId,
      points: 1,
      scorerId: scorerId,
      assistId: assistId,
      description: 'Goal'
    });

    resetSelection();
  };

  const confirmCard = (cardType: 'yellow' | 'red', playerId: string) => {
    if (!selectedTeamId) return;

    scoreMatch(match.id, {
      type: 'card',
      teamId: selectedTeamId,
      cardType: cardType,
      scorerId: playerId, // In this context, scorerId is the player receiving the card
      points: 0,
      description: `${cardType === 'yellow' ? 'Yellow' : 'Red'} Card`
    });

    resetSelection();
  };

  const resetSelection = () => {
    setSelectedTeamId(null);
    setActionType(null);
  };

  // Get squad for selected team
  const getSquad = (teamId: string) => {
    const participant = match.homeParticipant.id === teamId ? match.homeParticipant : match.awayParticipant;
    return participant.squad?.playerIds || [];
  };

  return (
    <div className="space-y-6">
      {/* Scoreboard */}
      <Card className="bg-slate-900 text-white border-slate-800 p-6">
        <div className="flex justify-between items-center text-center">
          <div className="flex-1">
            <h3 className="text-slate-400 text-sm font-bold uppercase mb-2">{match.homeParticipant.name}</h3>
            <div className="text-5xl font-bold">{match.homeParticipant.score || 0}</div>
          </div>
          <div className="px-4">
            <div className="text-slate-500 font-bold text-xl">VS</div>
            <div className="text-slate-600 text-xs mt-1">
                {Math.floor((Date.now() - new Date(match.actualStartTime || match.date).getTime()) / 60000)}'
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-slate-400 text-sm font-bold uppercase mb-2">{match.awayParticipant.name}</h3>
            <div className="text-5xl font-bold">{match.awayParticipant.score || 0}</div>
          </div>
        </div>
      </Card>

      {/* Action Area */}
      {selectedTeamId ? (
        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">
              Select {actionType === 'goal' ? 'Scorer' : 'Player'}
            </h3>
            <Button variant="ghost" size="sm" onClick={resetSelection}>Cancel</Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {getSquad(selectedTeamId).map(playerId => {
              const player = getPlayer(playerId);
              return (
                <button
                  key={playerId}
                  onClick={() => {
                    if (actionType === 'goal') confirmGoal(playerId);
                    else if (actionType === 'card') confirmCard('yellow', playerId); // Default to yellow first, can add toggle later
                  }}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-left border border-slate-200 transition-colors"
                >
                  <div className="font-bold text-slate-800 truncate">{player ? `${player.firstName} ${player.lastName}` : 'Unknown'}</div>
                  <div className="text-xs text-slate-500">#{playerId.slice(0, 4)}</div>
                </button>
              );
            })}
             <button
                  onClick={() => {
                     if (actionType === 'goal') confirmGoal(undefined);
                     else if (actionType === 'card') confirmCard('yellow', 'unknown');
                  }}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-left border border-slate-200 border-dashed text-slate-500"
                >
                  <div className="font-bold italic">Unknown / Own Goal</div>
             </button>
          </div>

          {actionType === 'card' && (
             <div className="flex gap-2 mt-4 pt-4 border-t">
                <div className="text-sm font-bold text-slate-500 flex items-center">Card Type:</div>
                 <Button 
                    variant="outline" 
                    className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
                    onClick={() => {
                        // This is a bit hacky, normally we'd select player then card type. 
                        // For now let's just show players and default to yellow. 
                        // To support red, we might need a better UI flow.
                        // Let's just keep it simple: Select Player -> Confirm Goal/Card.
                        // Ideally: Click Card -> Select Team -> Select Player -> Select Color.
                        // Current flow: Click Team Card -> Select Player (defaults yellow).
                    }}
                 >
                    Yellow
                 </Button>
                 <Button 
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                    onClick={() => {
                        // Implement Red Card Logic if needed
                    }}
                 >
                    Red
                 </Button>
             </div>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {/* Home Actions */}
          <div className="space-y-3">
             <div className="text-center font-bold text-slate-400 text-xs uppercase mb-1">{match.homeParticipant.name}</div>
             <Button 
                className="w-full h-16 text-xl bg-green-600 hover:bg-green-700" 
                onClick={() => handleGoalClick(match.homeParticipant.id)}
                icon={<Activity className="w-5 h-5 mr-2" />}
             >
                GOAL
             </Button>
             <div className="flex gap-2">
                <Button 
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white border-none"
                    onClick={() => {
                        setSelectedTeamId(match.homeParticipant.id);
                        setActionType('card');
                    }}
                >
                    Card
                </Button>
             </div>
          </div>

          {/* Away Actions */}
          <div className="space-y-3">
             <div className="text-center font-bold text-slate-400 text-xs uppercase mb-1">{match.awayParticipant.name}</div>
             <Button 
                className="w-full h-16 text-xl bg-blue-600 hover:bg-blue-700" 
                onClick={() => handleGoalClick(match.awayParticipant.id)}
                icon={<Activity className="w-5 h-5 mr-2" />}
             >
                GOAL
             </Button>
             <div className="flex gap-2">
                <Button 
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white border-none"
                    onClick={() => {
                        setSelectedTeamId(match.awayParticipant.id);
                        setActionType('card');
                    }}
                >
                    Card
                </Button>
             </div>
          </div>
        </div>
      )}

      {/* Match Control */}
      <div className="pt-8 border-t border-slate-200">
         <Button 
            variant="danger" 
            size="lg" 
            className="w-full"
            onClick={onEndMatch}
            disabled={isEnding}
         >
            {isEnding ? 'Ending Match...' : 'End Match'}
         </Button>
      </div>
      
      {/* Event Feed Preview (Optional) */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase">Recent Events</h4>
        {match.events?.slice().reverse().slice(0, 5).map(event => (
            <div key={event.id} className="text-sm p-2 bg-white border rounded flex justify-between items-center">
                <span>{event.description}</span>
                <span className="text-xs text-slate-400">{new Date(event.timestamp).toLocaleTimeString()}</span>
            </div>
        ))}
      </div>
    </div>
  );
};
