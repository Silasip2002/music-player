import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import SearchPage from './components/SearchPage';
import AudioPlayer from './components/AudioPlayer';
import PlayingPage from './components/PlayingPage';
import './App.css';

const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [showPlayingPage, setShowPlayingPage] = useState(false);

  const handleSearch = async (query) => {
    try {
      const response = await fetch(`http://localhost:5000/api/search?q=${query}`);
      const data = await response.json();
      setSearchResults(data.items || []);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleTrackSelect = (track) => {
    setSelectedTrack(track);
    setShowPlayingPage(true);
  };

  const handleClosePlaying = () => {
    setShowPlayingPage(false);
  };

  return (
    <div className="app">
      <div className="mobile-container">
        <SearchBar onSearch={handleSearch} />
        <SearchPage 
          searchResults={searchResults} 
          onTrackSelect={handleTrackSelect}
        />
        {selectedTrack && <AudioPlayer audioUrl={selectedTrack.videoUrl} />}
        {showPlayingPage && (
          <PlayingPage 
            track={selectedTrack} 
            onClose={handleClosePlaying}
          />
        )}
        <nav className="bottom-nav">
          <button className="nav-item">
            <span className="icon">🔥</span>
            <span>Trending</span>
          </button>
          <button className="nav-item">
            <span className="icon">🎵</span>
            <span>Artist</span>
          </button>
          <button className="nav-item active">
            <span className="icon">🔍</span>
            <span>Search</span>
          </button>
          <button className="nav-item">
            <span className="icon">📚</span>
            <span>Library</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default App;