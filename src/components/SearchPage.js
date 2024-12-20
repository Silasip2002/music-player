import React from 'react';
import './SearchPage.css';

const SearchPage = ({ searchResults, onTrackSelect }) => {
  const formatDuration = (duration) => {
    if (!duration) return "3:25"; // Default duration
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');
    
    let result = '';
    if (hours) result += `${hours}:`;
    result += `${minutes || '0'}:${seconds.padStart(2, '0')}`;
    return result;
  };

  if (!searchResults || searchResults.length === 0) {
    return (
      <div className="empty-search">
        <div className="suggestions">
          <h3>Popular Searches</h3>
          <div className="suggestion-items">
            <div className="suggestion-item">
              <span className="trend-icon">🔥</span>
              <span>Top Hits 2024</span>
            </div>
            <div className="suggestion-item">
              <span className="trend-icon">🎵</span>
              <span>Deep Focus Music</span>
            </div>
            <div className="suggestion-item">
              <span className="trend-icon">🎧</span>
              <span>Study Playlist</span>
            </div>
            <div className="suggestion-item">
              <span className="trend-icon">🎸</span>
              <span>Rock Classics</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results">
      {searchResults.map((result) => (
        <div 
          key={result.id.videoId} 
          className="result-item"
          onClick={() => onTrackSelect(result)}
          role="button"
          tabIndex={0}
        >
          <div className="result-thumbnail">
            <img 
              src={result.snippet.thumbnails.medium.url} 
              alt={result.snippet.title}
            />
          </div>
          <div className="result-info">
            <h3>{result.snippet.title}</h3>
            <p>{result.snippet.channelTitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchPage;
