import React, { useState, useRef, useEffect } from 'react';
import './PlayingPage.css';

const PlayingPage = ({ track, onClose }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  
  const playerRef = useRef(null);
  const timeTrackingRef = useRef(null);
  const playerContainerRef = useRef(null);

  useEffect(() => {
    // Reset states
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    stopTimeTracking();

    // Cleanup old player
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch (error) {
        console.error('Error cleaning up player:', error);
      }
      playerRef.current = null;
    }

    // Clear the container
    if (playerContainerRef.current) {
      playerContainerRef.current.innerHTML = '';
    }

    // Create new container
    const playerContainer = document.createElement('div');
    playerContainer.id = 'youtube-player';
    if (playerContainerRef.current) {
      playerContainerRef.current.appendChild(playerContainer);
    }

    const loadPlayer = () => {
      if (!track?.videoId) return;
      
      try {
        const player = new window.YT.Player('youtube-player', {
          height: '0',
          width: '0',
          videoId: track.videoId,
          playerVars: {
            playsinline: 1,
            controls: 0,
            disablekb: 1,
            rel: 0,
            autoplay: 1
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
          },
        });
        playerRef.current = player;
      } catch (error) {
        console.error('Error creating player:', error);
      }
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = loadPlayer;
    } else {
      loadPlayer();
    }

    return () => {
      stopTimeTracking();
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.error('Error destroying player:', error);
        }
        playerRef.current = null;
      }
    };
  }, [track?.videoId]);

  const startTimeTracking = () => {
    stopTimeTracking();
    updateTimeAndDuration();
    timeTrackingRef.current = setInterval(updateTimeAndDuration, 50);
  };

  const updateTimeAndDuration = () => {
    if (!playerRef.current?.getCurrentTime || !playerRef.current?.getDuration) return;
    
    try {
      const currentTime = playerRef.current.getCurrentTime();
      const duration = playerRef.current.getDuration();
      
      if (currentTime && duration) {
        setCurrentTime(currentTime);
        setDuration(duration);
      }
    } catch (error) {
      console.error('Error updating time:', error);
    }
  };

  const stopTimeTracking = () => {
    if (timeTrackingRef.current) {
      clearInterval(timeTrackingRef.current);
      timeTrackingRef.current = null;
    }
  };

  const onPlayerReady = (event) => {
    try {
      const player = event.target;
      const duration = player.getDuration();
      setDuration(duration);
      player.playVideo();
      setIsPlaying(true);
      startTimeTracking();
    } catch (error) {
      console.error('Error in onPlayerReady:', error);
    }
  };

  const onPlayerStateChange = (event) => {
    try {
      if (event.data === window.YT.PlayerState.PLAYING) {
        setIsPlaying(true);
        startTimeTracking();
      } else if (event.data === window.YT.PlayerState.PAUSED) {
        setIsPlaying(false);
        stopTimeTracking();
      } else if (event.data === window.YT.PlayerState.ENDED) {
        if (isRepeat) {
          playerRef.current.seekTo(0);
          playerRef.current.playVideo();
        } else {
          setIsPlaying(false);
          stopTimeTracking();
          setCurrentTime(0);
        }
      }
    } catch (error) {
      console.error('Error in onPlayerStateChange:', error);
    }
  };

  const handleProgressBarClick = (e) => {
    if (!playerRef.current || !duration) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const progressBarWidth = rect.width;
    const percentage = clickPosition / progressBarWidth;
    const newTime = percentage * duration;
    
    try {
      playerRef.current.seekTo(newTime, true);
      setCurrentTime(newTime);
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  const formatTime = (time) => {
    if (!time) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
    console.log("Repeat mode:", !isRepeat);
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
          <div className="progress-bar" onClick={handleProgressBarClick}>
            <div 
              className="progress" 
              style={{ 
                width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                transition: 'width 0.1s linear'
              }}
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

      <div ref={playerContainerRef} style={{ display: 'none' }}></div>
    </div>
  );
};

export default PlayingPage;
