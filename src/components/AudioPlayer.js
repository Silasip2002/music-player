// src/components/AudioPlayer.js
import React from 'react';
import YouTube from 'react-youtube';
import './AudioPlayer.css';

const AudioPlayer = ({ audioUrl }) => {
  // Extract video ID from the URL
  const videoId = audioUrl?.split('v=')[1];

  const opts = {
    height: '80',
    width: '100%',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      controls: 1,
      mute: 1, // Required for autoplay to work in most browsers
      modestbranding: 1,
      playsinline: 1,
    },
  };

  const onReady = (event) => {
    // Access to player in all event handlers via event.target
    event.target.playVideo();
    event.target.unMute(); // Unmute after autoplay starts
  };

  if (!videoId) return null;

  return (
    <div className="player-container">
      <div className="player-controls">
        <button className="control-button">
          <span role="img" aria-label="shuffle">🔀</span>
        </button>
        <button className="control-button">
          <span role="img" aria-label="previous">⏮️</span>
        </button>
        <button className="control-button play-button">
          <span role="img" aria-label="play">▶️</span>
        </button>
        <button className="control-button">
          <span role="img" aria-label="next">⏭️</span>
        </button>
        <button className="control-button">
          <span role="img" aria-label="repeat">🔁</span>
        </button>
      </div>
      <div className="youtube-player">
        <YouTube 
          videoId={videoId} 
          opts={opts} 
          onReady={onReady}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;