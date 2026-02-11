import React, { useState } from 'react';
import { useGlobalState } from '../../../app/AppProviders';
// import { User } from '../../../domain/user';

interface ScorerAssignmentProps {
  matchId: string;
}

export const ScorerAssignment: React.FC<ScorerAssignmentProps> = ({ matchId }) => {
  const { 
    users, 
    // matchScorers, 
    assignScorer, 
    removeScorer, 
    getMatchScorers,
    currentUser
  } = useGlobalState();

  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const assignedScorers = getMatchScorers(matchId);
  
  // Filter users who are eligible to score (role='scorer' or 'admin')
  // and not already assigned
  const availableUsers = users.filter(u => 
    (u.role === 'admin') && 
    !assignedScorers.some(as => as.userId === u.id)
  );

  const handleAssign = () => {
    if (selectedUserId) {
      assignScorer(matchId, selectedUserId);
      setSelectedUserId('');
    }
  };

  const handleRemove = (userId: string) => {
    if (window.confirm('Are you sure you want to remove this scorer?')) {
      removeScorer(matchId, userId);
    }
  };

  if (currentUser?.role !== 'admin') {
    return null;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Manage Scorers</h3>
      
      {/* List Assigned Scorers */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '14px', color: '#666', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assigned Scorers</h4>
        {assignedScorers.length === 0 ? (
          <p style={{ color: '#999', fontStyle: 'italic' }}>No scorers assigned yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {assignedScorers.map(assignment => {
              const user = users.find(u => u.id === assignment.userId);
              if (!user) return null;
              return (
                <li key={assignment.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '12px',
                  borderBottom: '1px solid #eee'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      backgroundColor: '#e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#475569'
                    }}>
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '500', color: '#1e293b' }}>{user.firstName} {user.lastName}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{user.email}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemove(user.id)}
                    style={{ 
                      color: '#ef4444', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer',
                      fontSize: '14px',
                      padding: '4px 8px'
                    }}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Assign New Scorer */}
      <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
        <h4 style={{ fontSize: '14px', color: '#666', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assign New Scorer</h4>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select 
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            style={{ 
              flex: 1, 
              padding: '8px 12px', 
              borderRadius: '6px', 
              border: '1px solid #cbd5e1',
              fontSize: '14px'
            }}
          >
            <option value="">Select a user...</option>
            {availableUsers.map(user => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName} ({user.role})
              </option>
            ))}
          </select>
          <button 
            onClick={handleAssign}
            disabled={!selectedUserId}
            style={{ 
              backgroundColor: !selectedUserId ? '#94a3b8' : '#0f172a', 
              color: 'white', 
              padding: '8px 16px', 
              borderRadius: '6px', 
              border: 'none', 
              cursor: !selectedUserId ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              fontSize: '14px'
            }}
          >
            Assign
          </button>
        </div>
        <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
          Only users with 'scorer' or 'admin' role can be assigned.
        </p>
      </div>
    </div>
  );
};
