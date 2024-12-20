// src/components/MusicList.js
import React from 'react';
import './MusicList.css';

const MusicList = ({ tracks, onTrackSelect }) => {
  return (
    <div className="music-list">
      {tracks.map((track) => (
        <div
          key={track.id}
          className="track-item"
          onClick={() => onTrackSelect(track)}
        >
          <div className="track-thumbnail">
            <img
              src={track.snippet.thumbnails.default.url}
              alt={track.snippet.title}
            />
            <span className="duration">{track.duration || "3:25"}</span>
          </div>
          <div className="track-info">
            <h3 className="track-title">{track.snippet.title}</h3>
            <p className="track-channel">{track.snippet.channelTitle}</p>
          </div>
          <button className="track-menu">•••</button>
        </div>
      ))}
    </div>
  );
};

export default MusicList;