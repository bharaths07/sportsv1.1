import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HelpCircle, Trophy, Activity, Users, Shield } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { PageHeader } from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';

interface GameOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
}

const GAMES: GameOption[] = [
  {
    id: 'cricket',
    name: 'Cricket',
    description: 'Score full matches with ball-by-ball tracking and detailed stats.',
    icon: <Trophy size={32} className="text-blue-600" />,
  },
  {
    id: 'football',
    name: 'Football',
    description: 'Track goals, assists, and match events in real-time.',
    icon: <Activity size={32} className="text-emerald-500" />,
    comingSoon: false,
  },
  {
    id: 'badminton',
    name: 'Badminton',
    description: 'Keep score for singles and doubles matches.',
    icon: <Users size={32} className="text-amber-500" />,
    comingSoon: true,
  },
  {
    id: 'kabaddi',
    name: 'Kabaddi',
    description: 'Raid points, tackle points, and team standings.',
    icon: <Shield size={32} className="text-purple-500" />,
    comingSoon: true,
  },
];

export const SelectGameScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleGameSelect = (gameId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('game', gameId);
    if (gameId === 'cricket' || gameId === 'football') {
        navigate(`/start-match/select-teams?${params.toString()}`);
    } else {
        alert(`${gameId} coming soon!`);
    }
  };

  return (
    <PageContainer>
        <PageHeader 
            title="Select Game" 
            description="Choose a sport to start scoring"
            actions={<button className="text-slate-400 hover:text-slate-600"><HelpCircle size={24}/></button>}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GAMES.map((game) => (
                <Card 
                    key={game.id}
                    onClick={() => !game.comingSoon && handleGameSelect(game.id)}
                    hoverable={!game.comingSoon}
                    className={`p-6 flex flex-col items-center text-center ${game.comingSoon ? 'opacity-60 cursor-not-allowed bg-slate-50' : ''}`}
                >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${game.comingSoon ? 'bg-slate-200' : 'bg-blue-50'}`}>
                        {game.icon}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{game.name}</h3>
                    <p className="text-sm text-slate-500 mb-4">{game.description}</p>
                    {game.comingSoon && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                            Coming Soon
                        </span>
                    )}
                </Card>
            ))}
        </div>
    </PageContainer>
  );
};
