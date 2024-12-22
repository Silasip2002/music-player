import React, { useState, useRef, useEffect } from 'react';
import './PlayingPage.css';

// Initialize YouTube API once
if (!window.YT) {
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

const PlayingPage = ({ track, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const timeTrackingRef = useRef(null);

  useEffect(() => {
    const initPlayer = () => {
      if (window.YT && window.YT.Player && videoRef.current) {
        if (playerRef.current) {
          playerRef.current.destroy();
        }
        
        playerRef.current = new window.YT.Player(videoRef.current, {
          videoId: track?.videoId,
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
          },
          playerVars: {
            controls: 0,
            modestbranding: 1,
            enablejsapi: 1,
            origin: window.location.origin,
          },
        });
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (timeTrackingRef.current) {
        clearInterval(timeTrackingRef.current);
      }
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [track?.videoId]);

  const onPlayerReady = (event) => {
    setDuration(event.target.getDuration());
  };

  const onPlayerStateChange = (event) => {
    if (!playerRef.current) return;
    
    const newIsPlaying = event.data === window.YT.PlayerState.PLAYING;
    setIsPlaying(newIsPlaying);

    if (newIsPlaying) {
      startTimeTracking();
    } else {
      if (timeTrackingRef.current) {
        clearInterval(timeTrackingRef.current);
      }
    }
  };

  const startTimeTracking = () => {
    if (timeTrackingRef.current) {
      clearInterval(timeTrackingRef.current);
    }

    timeTrackingRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 1000);
  };

  const formatTime = (time) => {
    if (!time) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  const handlePrevious = () => {
    if (playerRef.current && currentTime > 3) {
      // If current time is more than 3 seconds, restart the current song
      playerRef.current.seekTo(0);
    } else {
      // TODO: Play previous song from playlist
      console.log("Play previous song");
    }
  };

  const handleNext = () => {
    // TODO: Play next song from playlist
    console.log("Play next song");
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
    // TODO: Implement shuffle logic
    console.log("Shuffle mode:", !isShuffle);
  };

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
    if (playerRef.current) {
      playerRef.current.setLoop(!isRepeat);
    }
    console.log("Repeat mode:", !isRepeat);
  };

  const handleSeek = (e) => {
    if (playerRef.current && playerRef.current.seekTo) {
      const progressBar = e.currentTarget;
      const clickPosition = e.nativeEvent.offsetX;
      const progressBarWidth = progressBar.offsetWidth;
      const seekTime = (clickPosition / progressBarWidth) * duration;
      playerRef.current.seekTo(seekTime);
    }
  };

  return (
    <div className="player-container">
      <div className="player-header">
        <button className="minimize-button" onClick={onClose}>◀</button>
        <button className="more-options">⋮</button>
      </div>

      <div className="player-content">
        <div className="track-image">
          <img 
            src={track?.snippet?.thumbnails?.maxres?.url || track?.snippet?.thumbnails?.high?.url} 
            alt={track?.snippet?.title}
          />
        </div>

        <div className="track-info">
          <h2 className="track-title">{track?.snippet?.title}</h2>
          <p className="track-channel">{track?.snippet?.channelTitle}</p>
        </div>

        <div className="progress-container">
          <div className="progress-bar" onClick={handleSeek}>
            <div 
              className="progress" 
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            ></div>
          </div>
          <div className="time-display">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="player-controls">
          <button 
            className={`control-button shuffle ${isShuffle ? 'active' : ''}`} 
            onClick={toggleShuffle}
          >
            🔀
          </button>
          <button 
            className="control-button previous" 
            onClick={handlePrevious}
          >
            ⏮
          </button>
          <button 
            className="control-button play-pause" 
            onClick={togglePlay}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button 
            className="control-button next" 
            onClick={handleNext}
          >
            ⏭
          </button>
          <button 
            className={`control-button repeat ${isRepeat ? 'active' : ''}`} 
            onClick={toggleRepeat}
          >
            🔁
          </button>
        </div>

        <div className="bottom-controls">
          <button>即時播放</button>
          <button>歌詞</button>
          <button>相關內容</button>
        </div>
      </div>

      <div id="youtube-player" style={{ display: 'none' }}>
        <div ref={videoRef}></div>
      </div>
    </div>
  );
};

export default PlayingPage;
