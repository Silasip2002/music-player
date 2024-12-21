import React, { useState, useRef, useEffect } from 'react';
import './PlayingPage.css';

const PlayingPage = ({ track, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false); // State to manage playback status
  const videoRef = useRef(null); // Reference to the video element

  const togglePlay = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*'); // Pause the video
    } else {
      video.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*'); // Play the video
    }
    setIsPlaying(!isPlaying); // Toggle playback status
  };

  return (
    <>
      <div>
        <iframe
          ref={videoRef}
          width="560"
          height="315"
src={`https://www.youtube.com/embed/${track?.videoId}?enablejsapi=1`}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
      <div className="playing-page">
        <div className="header">
          <button className="back-button" onClick={onClose}>
            <span>↓</span>
          </button>
          <div className="track-info">
            <h2>{track?.snippet?.title || 'Unknown Track'}</h2>
            <p>{track?.snippet?.channelTitle || 'Unknown Artist'}</p>
          </div>
          <button className="more-button">⋮</button>
        </div>
        
        <div className="album-art">
          <img 
            src={track?.snippet?.thumbnails?.high?.url || '/default-album-art.jpg'} 
            alt="Album Art"
          />
        </div>

        <div className="controls">
          <div className="progress-bar">
            <div className="progress"></div>
          </div>
          <div className="time">
            <span>0:00</span>
            <span>3:45</span>
          </div>
          <div className="buttons">
            <button className="shuffle">🔀</button>
            <button className="prev">⏮</button>
            <button className="play" onClick={togglePlay}>
              {isPlaying ? '⏸' : '▶️'} {/* Change icon based on playback status */}
            </button>
            <button className="next">⏭</button>
            <button className="repeat">🔁</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayingPage;
