import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState } from '../../app/AppProviders';
import { LoginModal } from '../../components/LoginModal';
import { EmptyState } from '../../components/EmptyState';
import { Certificate } from '../../domain/certificate';

export const MyCertificatesScreen: React.FC = () => {
  const { currentUser, certificates } = useGlobalState();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  // 1. Auth Check
  if (!currentUser) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>🔐</div>
        <h2 style={{ color: '#333', marginBottom: '10px' }}>Login Required</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          You need to be logged in to view and download your certificates.
        </p>
        <button 
          onClick={() => setShowLoginModal(true)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Login to View Certificates
        </button>
        <div style={{ marginTop: '20px' }}>
          <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>Return to Home</Link>
        </div>

        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
          message="Please login to view your certificates."
        />
      </div>
    );
  }

  // 2. Filter Certificates
  const myCertificates = certificates.filter(c => c.playerId === currentUser.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 3. Download/Preview Logic
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
          <h1 style={{ margin: 0, color: '#1a237e' }}>My Certificates</h1>
          <p style={{ margin: '5px 0 0', color: '#666' }}>
            Official records of your participation and achievements.
          </p>
        </div>
        <Link to="/" style={{ textDecoration: 'none', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>←</span> Back to Home
        </Link>
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
            <div key={cert.id} style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              overflow: 'hidden',
              border: '1px solid #eee',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ padding: '20px', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '24px' }}>📜</span>
                  <span style={{ fontSize: '12px', color: '#888', backgroundColor: '#f5f5f5', padding: '4px 8px', borderRadius: '4px', height: 'fit-content' }}>
                    {new Date(cert.date).toLocaleDateString()}
                  </span>
                </div>
                <h3 style={{ margin: '0 0 10px', color: '#333' }}>{cert.title}</h3>
                <p style={{ margin: '0 0 15px', color: '#666', fontSize: '14px' }}>
                  {cert.metadata.matchName}
                </p>
                <div style={{ fontSize: '12px', color: '#888' }}>
                  {cert.metadata.organizerName} • {cert.metadata.location}
                </div>
              </div>
              <button 
                onClick={() => handlePreview(cert)}
                style={{
                  width: '100%',
                  padding: '15px',
                  backgroundColor: '#f0f4c3',
                  color: '#827717',
                  border: 'none',
                  borderTop: '1px solid #e6ee9c',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>📥</span> Download / Print
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Preview Modal */}
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
                {currentUser.name}
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
                onClick={() => window.print()}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#2e7d32',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                🖨️ Print / Save as PDF
              </button>
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

            <style>{`
              @media print {
                body * {
                  visibility: hidden;
                }
                #printable-certificate-view, #printable-certificate-view * {
                  visibility: visible;
                }
                #printable-certificate-view {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  height: 100%;
                  margin: 0;
                  padding: 40px;
                  background-color: white;
                  border: 10px solid #1a237e;
                }
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
};
