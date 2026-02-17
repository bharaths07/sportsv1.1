import React, { useState } from 'react';
import { Match } from '../../../domain/match';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface Props {
  match: Match;
  onEndMatch: () => void;
  isEnding: boolean;
  onScore: (event: Partial<Match['events'][number]>) => void;
}

export const BasketballLiveScorer: React.FC<Props> = ({ match, onEndMatch, isEnding, onScore }) => {
  const [teamId, setTeamId] = useState<string>(match.homeParticipant.id);
  const [scorerId, setScorerId] = useState<string>('');
  const [assistId, setAssistId] = useState<string>('');

  const submitBasket = (points: number) => {
    onScore({
      type: 'basket',
      teamId,
      points,
      scorerId: scorerId || undefined,
      assistId: assistId || undefined,
      description: `${points}-point basket`
    });
    setAssistId('');
  };

  const submitFoul = () => {
    onScore({
      type: 'foul',
      teamId,
      scorerId: scorerId || undefined,
      description: 'Personal foul'
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-600">Team</label>
            <select
              value={teamId}
              onChange={e => setTeamId(e.target.value)}
              className="w-full px-3 py-2 border rounded text-sm"
            >
              <option value={match.homeParticipant.id}>{match.homeParticipant.name}</option>
              <option value={match.awayParticipant.id}>{match.awayParticipant.name}</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Scorer ID</label>
            <input
              value={scorerId}
              onChange={e => setScorerId(e.target.value)}
              className="w-full px-3 py-2 border rounded text-sm"
              placeholder="player_id"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Assist ID (optional)</label>
            <input
              value={assistId}
              onChange={e => setAssistId(e.target.value)}
              className="w-full px-3 py-2 border rounded text-sm"
              placeholder="player_id"
            />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="grid grid-cols-3 gap-3">
          <Button variant="secondary" onClick={() => submitBasket(1)}>+1 Free Throw</Button>
          <Button variant="secondary" onClick={() => submitBasket(2)}>+2 Field Goal</Button>
          <Button variant="secondary" onClick={() => submitBasket(3)}>+3 Three Pointer</Button>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <Button variant="outline" onClick={submitFoul}>Personal Foul</Button>
        </div>
      </Card>

      <div className="pt-4 border-t">
        <Button variant="danger" className="w-full" onClick={onEndMatch} disabled={isEnding}>
          {isEnding ? 'Ending Match...' : 'End Match'}
        </Button>
      </div>
    </div>
  );
};
