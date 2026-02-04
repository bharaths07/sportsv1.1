import React from 'react';
import { useGlobalState } from '../app/AppProviders';

interface FollowButtonProps {
  id: string;
  type: 'team' | 'tournament';
  label?: boolean; // If true, show text "Follow"/"Following"
  style?: React.CSSProperties;
}

export const FollowButton: React.FC<FollowButtonProps> = ({ id, type, label = false, style }) => {
  const { followedTeams, followedTournaments, toggleFollowTeam, toggleFollowTournament } = useGlobalState();

  const isFollowing = type === 'team' 
    ? followedTeams.includes(id) 
    : followedTournaments.includes(id);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card clicks if placed inside cards
    if (type === 'team') {
      toggleFollowTeam(id);
    } else {
      toggleFollowTournament(id);
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: label ? '8px 16px' : '8px',
        borderRadius: '20px',
        border: `1px solid ${isFollowing ? '#d32f2f' : '#ccc'}`,
        backgroundColor: isFollowing ? '#fff0f0' : 'white',
        color: isFollowing ? '#d32f2f' : '#666',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        fontFamily: 'Inter, Roboto, sans-serif',
        transition: 'all 0.2s ease',
        ...style
      }}
    >
      <span style={{ fontSize: label ? '16px' : '18px' }}>
        {isFollowing ? '❤️' : '🤍'}
      </span>
      {label && (
        <span>{isFollowing ? 'Following' : 'Follow'}</span>
      )}
    </button>
  );
};
