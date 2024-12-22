import React, { useState, useRef, useEffect } from 'react';
import './PlayingPage.css';

function PlayingPage({ onClose, track }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(true);
  const playerRef = useRef(null);
  const timeTrackingRef = useRef(null);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    return () => {
      stopTimeTracking();
      if (playerRef.current) {
        try {
          // Stop video and remove event listeners
          playerRef.current.stopVideo && playerRef.current.stopVideo();
          playerRef.current = null;
        } catch (error) {
          console.error('Error cleaning up player:', error);
        }
      }
    };
  }, []);

  const initPlayer = () => {
    try {
      // Create a new player instance
      const player = new window.YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: track?.videoId || 'M7lc1UVf-VE',
        playerVars: {
          playsinline: 1,
          controls: 0,
          disablekb: 1,
          rel: 0,
          autoplay: 1,
          loop: isRepeat ? 1 : 0
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });

      // Store the player instance
      playerRef.current = player;
    } catch (error) {
      console.error('Error initializing player:', error);
    }
  };

  const startTimeTracking = () => {
    stopTimeTracking();
    timeTrackingRef.current = setInterval(() => {
      if (playerRef.current?.getCurrentTime && playerRef.current?.getDuration) {
        try {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration();
          setCurrentTime(currentTime);
          setDuration(duration);
        } catch (error) {
          console.error('Error updating time:', error);
        }
      }
    }, 100);
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
      playerRef.current = player;
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

  const handleSeek = (e) => {
    if (!playerRef.current || !duration) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = x / width;
    const seekTime = percentage * duration;
    
    playerRef.current.seekTo(seekTime);
    setCurrentTime(seekTime);
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
          <div className="progress-bar" onClick={handleSeek}>
            <div 
              className="progress" 
              style={{ width: `${(currentTime / duration) * 100}%` }}
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
        <div ref={playerRef}></div>
      </div>
    </div>
  );
};

export default PlayingPage;
