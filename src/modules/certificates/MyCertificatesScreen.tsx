import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useGlobalState } from '../../app/AppProviders';
import { EmptyState } from '../../components/EmptyState';
import { Certificate } from '../../domain/certificate';

export const MyCertificatesScreen: React.FC = () => {
  const { currentUser, certificates } = useGlobalState();
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  // 1. Auth Check (Redirect if Guest)
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 2. Filter Certificates
  const myCertificates = certificates.filter(c => c.playerId === currentUser.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 3. View Logic
  const handlePreview = (cert: Certificate) => {
    setSelectedCertificate(cert);
  };

  const closePreview = () => {
    setSelectedCertificate(null);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'Segoe UI, sans-serif' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#1a237e' }}>Certificates</h1>
          <p style={{ margin: '5px 0 0', color: '#666' }}>
            Official records of your participation and achievements.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#64748b' }}>
            {(currentUser.firstName || currentUser.name || '?').charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: '600', color: '#0f172a' }}>
              {currentUser.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : currentUser.name}
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      {myCertificates.length === 0 ? (
        <EmptyState 
          message="No certificates yet." 
          actionLabel="Participate in matches to earn them!" 
          icon="📭"
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {myCertificates.map(cert => (
            <div key={cert.id} onClick={() => handlePreview(cert)} style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              overflow: 'hidden',
              border: '1px solid #eee',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
            }}
            >
              <div style={{ padding: '20px', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '24px' }}>📜</span>
                  <span style={{ fontSize: '12px', color: '#888', backgroundColor: '#f5f5f5', padding: '4px 8px', borderRadius: '4px', height: 'fit-content' }}>
                    {new Date(cert.date).getFullYear()}
                  </span>
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.5px', 
                  color: cert.type === 'achievement' ? '#e65100' : '#1565c0',
                  fontWeight: 'bold',
                  marginBottom: '4px'
                }}>
                  {cert.type === 'achievement' ? 'Achievement' : 'Participation'}
                </div>
                <h3 style={{ margin: '0 0 10px', color: '#333' }}>{cert.title}</h3>
                <p style={{ margin: '0 0 15px', color: '#666', fontSize: '14px' }}>
                  {cert.metadata.matchName}
                </p>
                <div style={{ fontSize: '12px', color: '#888', borderTop: '1px solid #f0f0f0', paddingTop: '10px' }}>
                  <div style={{ marginBottom: '4px' }}><strong>Issuer:</strong> {cert.metadata.organizerName}</div>
                  <div>{cert.metadata.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Preview Modal (View Only) */}
      {selectedCertificate && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          zIndex: 2000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '8px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            textAlign: 'center',
            border: '10px solid #ddd'
          }}>
            <button 
              onClick={closePreview}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              ×
            </button>
            
            <div id="printable-certificate-view">
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏆</div>
              <h1 style={{ fontFamily: 'serif', color: '#1a237e', marginBottom: '10px' }}>{selectedCertificate.title}</h1>
              <p style={{ fontSize: '18px', color: '#666', fontStyle: 'italic', marginBottom: '30px' }}>This certifies that</p>
              
              <h2 style={{ fontSize: '36px', color: '#000', borderBottom: '2px solid #1a237e', display: 'inline-block', paddingBottom: '10px', marginBottom: '30px' }}>
                {currentUser.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : currentUser.name}
              </h2>
              
              <p style={{ fontSize: '18px', marginBottom: '20px' }}>{selectedCertificate.description}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '40px 0', textAlign: 'left', backgroundColor: '#f9f9f9', padding: '20px' }}>
                <div><strong>Match:</strong> {selectedCertificate.metadata.matchName}</div>
                <div><strong>Date:</strong> {new Date(selectedCertificate.date).toLocaleDateString()}</div>
                <div><strong>Sport:</strong> {selectedCertificate.metadata.sportName}</div>
                <div><strong>Location:</strong> {selectedCertificate.metadata.location}</div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'cursive', fontSize: '20px', marginBottom: '5px' }}>{selectedCertificate.metadata.organizerName}</div>
                  <div style={{ fontSize: '12px', borderTop: '1px solid #999', paddingTop: '5px', width: '150px' }}>Organizer</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>SportSync</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>Generated by SportSync</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                onClick={closePreview}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#e0e0e0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
