import React from 'react';
import { feedItems } from '../../data/mockData';

const NewsFeed: React.FC = () => {
  const styles = {
    container: {
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
      fontFamily: 'sans-serif'
    },
    header: {
      marginBottom: '30px',
      borderBottom: '1px solid #ccc',
      paddingBottom: '10px'
    },
    feedList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '20px',
      marginBottom: '40px'
    },
    feedItem: {
      border: '1px solid #ddd',
      padding: '15px',
      borderRadius: '4px'
    },
    itemSource: {
      fontWeight: 'bold',
      fontSize: '0.9em',
      color: '#555',
      marginBottom: '5px'
    },
    itemContent: {
      marginBottom: '10px',
      fontSize: '1.1em'
    },
    itemTime: {
      fontSize: '0.8em',
      color: '#888'
    },
    emptyState: {
      textAlign: 'center' as const,
      padding: '20px',
      fontStyle: 'italic',
      color: '#666',
      borderTop: '1px dashed #ccc'
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>News & Feed</h1>
        <p>Latest updates and match activity</p>
      </header>

      <section style={styles.feedList}>
        {feedItems.length > 0 ? (
          feedItems.map((item) => (
            <div key={item.id} style={styles.feedItem}>
              <div style={styles.itemSource}>
                {item.type.toUpperCase()} • {item.source}
              </div>
              <div style={styles.itemContent}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{item.title}</div>
                <div>{item.description}</div>
              </div>
              <div style={styles.itemTime}>{item.time}</div>
            </div>
          ))
        ) : (
          <div style={styles.emptyState}>
            No updates available
          </div>
        )}
      </section>
    </div>
  );
};

export default NewsFeed;
