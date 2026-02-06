import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, UserPlus, Phone, Link, Share2 } from 'lucide-react';
import { useGlobalState } from '../../app/AppProviders';
import { Player } from '../../domain/player';

export const AddPlayerOptionsScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get('teamId');
  const matchId = searchParams.get('matchId');
  const navigate = useNavigate();
  const { addPlayer, addTeamMember } = useGlobalState();
  
  const [view, setView] = useState<'options' | 'phone'>('options');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleBack = () => {
    if (view === 'phone') {
      setView('options');
    } else {
      navigate(-1);
    }
  };

  const handleAddByPhone = () => {
    if (!name || !phone || !teamId) return;

    const newPlayer: Player = {
      id: `new-${Date.now()}`,
      firstName: name,
      lastName: '',
      active: true,
      status: 'invited',
      // Default stats
      stats: {
          matchesPlayed: 0,
          wins: 0,
          losses: 0,
          draws: 0,
          scoreAccumulated: 0
      },
      history: []
    } as Player; // Cast to Player to satisfy optional fields if strict

    addPlayer(newPlayer);
    addTeamMember(teamId, {
      playerId: newPlayer.id,
      role: 'member',
      joinedAt: new Date().toISOString()
    });

    navigate(-1);
  };

  const handleAddByContacts = () => {
    // Simulate contact picker
    if (!teamId) return;
    
    // Simulate picking a contact
    const randomName = "Contact " + Math.floor(Math.random() * 100);
    const newPlayer: Player = {
        id: `contact-${Date.now()}`,
        firstName: randomName,
        lastName: '',
        active: true,
        status: 'invited',
        stats: {
            matchesPlayed: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            scoreAccumulated: 0
        },
        history: []
      } as Player;
  
      addPlayer(newPlayer);
      addTeamMember(teamId, {
        playerId: newPlayer.id,
        role: 'member',
        joinedAt: new Date().toISOString()
      });
  
      navigate(-1);
  };

  const handleShareLink = () => {
    // Just simulation
    if (navigator.share) {
        navigator.share({
            title: 'Join Team',
            text: 'Join my team on ScoreHeroes!',
            url: window.location.origin + `/join-team?teamId=${teamId}`
        }).catch(console.error);
    } else {
        alert(`Link copied: ${window.location.origin}/join-team?teamId=${teamId}`);
    }
  };

  if (!teamId || !matchId) return <div>Invalid parameters</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-white border-b border-slate-200 px-4 py-4 flex items-center sticky top-0 z-10">
        <button onClick={handleBack} className="mr-3 p-1 rounded-full hover:bg-slate-100">
          <ChevronLeft className="w-6 h-6 text-slate-700" />
        </button>
        <h1 className="text-lg font-bold text-slate-800">Add player</h1>
      </div>

      <div className="flex-1 p-4">
        {view === 'options' ? (
          <div className="space-y-4">
            <button 
                onClick={handleAddByContacts}
                className="w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 hover:bg-slate-50 transition-colors"
            >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <UserPlus className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                    <h3 className="font-bold text-slate-900">Add via contacts</h3>
                    <p className="text-sm text-slate-500">Select from your phone book</p>
                </div>
            </button>

            <button 
                onClick={() => setView('phone')}
                className="w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 hover:bg-slate-50 transition-colors"
            >
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                    <Phone className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                    <h3 className="font-bold text-slate-900">Add via phone number</h3>
                    <p className="text-sm text-slate-500">Enter name and number</p>
                </div>
            </button>

            <button 
                onClick={handleShareLink}
                className="w-full bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 hover:bg-slate-50 transition-colors"
            >
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <Share2 className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                    <h3 className="font-bold text-slate-900">Add via send link</h3>
                    <p className="text-sm text-slate-500">Share invite link</p>
                </div>
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
             <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Player Name <span className="text-red-500">*</span></label>
                 <input 
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-teal-500 transition-colors"
                    placeholder="Enter full name"
                 />
             </div>
             <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                 <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">
                        +91
                    </span>
                    <input 
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="flex-1 p-3 border border-slate-300 rounded-r-lg outline-none focus:border-teal-500 transition-colors"
                        placeholder="9876543210"
                    />
                 </div>
             </div>
             <button
                onClick={handleAddByPhone}
                disabled={!name || !phone}
                className={`w-full py-3 rounded-lg font-bold text-white transition-all ${name && phone ? 'bg-teal-600 hover:bg-teal-700' : 'bg-slate-300 cursor-not-allowed'}`}
             >
                 Add Player
             </button>
          </div>
        )}
      </div>
    </div>
  );
};
