import React from 'react';
import './SearchPage.css';

const SearchPage = ({ searchResults, onTrackSelect }) => {
  const formatDuration = (duration) => {
    if (!duration || typeof duration !== 'string') return "0:00";
    
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return "0:00";

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatTimeAgo = (publishedAt) => {
    const date = new Date(publishedAt);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.ceil(diffDays / 7)} weeks ago`;
    } else if (diffDays < 365) {
      return `${Math.ceil(diffDays / 30)} months ago`;
    } else {
      return `${Math.ceil(diffDays / 365)} years ago`;
    }
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
      {searchResults && searchResults.length > 0 ? (
        <div className="results-list">
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
                <span className="duration-badge">
                  {formatDuration(result.contentDetails?.duration) || "0:00"}
                </span>
              </div>
              <div className="result-info">
                <h3 className="result-title">{result.snippet.title}</h3>
                <div className="result-metadata">
                  <div className="channel-info">
                    <div className="channel-avatar">
                      {result.snippet.channelThumbnail ? (
                        <img 
                          src={result.snippet.channelThumbnail} 
                          alt={result.snippet.channelTitle} 
                        />
                      ) : null}
                    </div>
                    <p className="channel-name">{result.snippet.channelTitle}</p>
                  </div>
                  <div className="result-details">
                    <span className="views-count">
                      {(result.statistics?.viewCount || '1.2K')} views
                    </span>
                    <span className="publish-time">
                      {formatTimeAgo(result.snippet.publishedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default SearchPage;
