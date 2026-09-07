import { useState, useRef, useCallback, useEffect } from 'react';
import { MediaFile, PlayerState, formatDuration } from '@/types/media';

export function useMediaPlayer(playlist: MediaFile[]) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [state, setState] = useState<PlayerState>({
    currentMedia: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isMuted: false,
    playbackRate: 1,
    isFullscreen: false,
    isLooping: false,
    isShuffle: false,
    quality: 'Unknown',
    showSubtitles: false,
  });

  const getMediaRef = useCallback(() => {
    if (!state.currentMedia) return null;
    return state.currentMedia.type === 'video' ? videoRef.current : audioRef.current;
  }, [state.currentMedia]);

  useEffect(() => {
    if (playlist.length > 0 && !state.currentMedia) {
      setState(s => ({ ...s, currentMedia: playlist[0] }));
    }
  }, [playlist]);

  const play = useCallback(() => {
    const media = getMediaRef();
    if (media) {
      media.play();
      setState(s => ({ ...s, isPlaying: true }));
    }
  }, [getMediaRef]);

  const pause = useCallback(() => {
    const media = getMediaRef();
    if (media) {
      media.pause();
      setState(s => ({ ...s, isPlaying: false }));
    }
  }, [getMediaRef]);

  const togglePlay = useCallback(() => {
    if (state.isPlaying) pause();
    else play();
  }, [state.isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    const media = getMediaRef();
    if (media) {
      media.currentTime = time;
      setState(s => ({ ...s, currentTime: time }));
    }
  }, [getMediaRef]);

  const setVolume = useCallback((vol: number) => {
    const media = getMediaRef();
    if (media) media.volume = vol;
    setState(s => ({ ...s, volume: vol, isMuted: vol === 0 }));
  }, [getMediaRef]);

  const toggleMute = useCallback(() => {
    const media = getMediaRef();
    if (media) {
      media.muted = !state.isMuted;
      setState(s => ({ ...s, isMuted: !s.isMuted }));
    }
  }, [getMediaRef, state.isMuted]);

  const setPlaybackRate = useCallback((rate: number) => {
    const media = getMediaRef();
    if (media) media.playbackRate = rate;
    setState(s => ({ ...s, playbackRate: rate }));
  }, [getMediaRef]);

  const toggleLoop = useCallback(() => {
    const media = getMediaRef();
    setState(s => {
      if (media) media.loop = !s.isLooping;
      return { ...s, isLooping: !s.isLooping };
    });
  }, [getMediaRef]);

  const toggleShuffle = useCallback(() => {
    setState(s => ({ ...s, isShuffle: !s.isShuffle }));
  }, []);

  const playNext = useCallback(() => {
    if (playlist.length === 0) return;
    let nextIdx: number;
    if (state.isShuffle) {
      nextIdx = Math.floor(Math.random() * playlist.length);
    } else {
      nextIdx = (currentIndex + 1) % playlist.length;
    }
    setCurrentIndex(nextIdx);
    setState(s => ({ ...s, currentMedia: playlist[nextIdx], isPlaying: false, currentTime: 0 }));
  }, [playlist, currentIndex, state.isShuffle]);

  const playPrev = useCallback(() => {
    if (playlist.length === 0) return;
    const prevIdx = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIdx);
    setState(s => ({ ...s, currentMedia: playlist[prevIdx], isPlaying: false, currentTime: 0 }));
  }, [playlist, currentIndex]);

  const selectMedia = useCallback((media: MediaFile, index: number) => {
    setCurrentIndex(index);
    setState(s => ({ ...s, currentMedia: media, isPlaying: false, currentTime: 0 }));
  }, []);

  const onTimeUpdate = useCallback(() => {
    const media = getMediaRef();
    if (media) setState(s => ({ ...s, currentTime: media.currentTime }));
  }, [getMediaRef]);

  const onLoadedMetadata = useCallback(() => {
    const media = getMediaRef();
    if (media) {
      setState(s => ({ ...s, duration: media.duration }));
      media.volume = state.volume;
    }
  }, [getMediaRef, state.volume]);

  const onEnded = useCallback(() => {
    if (!state.isLooping) playNext();
  }, [state.isLooping, playNext]);

  const skipForward = useCallback((seconds = 10) => {
    const media = getMediaRef();
    if (media) seek(Math.min(media.currentTime + seconds, media.duration));
  }, [getMediaRef, seek]);

  const skipBackward = useCallback((seconds = 10) => {
    const media = getMediaRef();
    if (media) seek(Math.max(media.currentTime - seconds, 0));
  }, [getMediaRef, seek]);

  const toggleFullscreen = useCallback((containerRef: React.RefObject<HTMLElement>) => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setState(s => ({ ...s, isFullscreen: true }));
    } else {
      document.exitFullscreen();
      setState(s => ({ ...s, isFullscreen: false }));
    }
  }, []);

  return {
    videoRef, audioRef, state, currentIndex,
    play, pause, togglePlay, seek, setVolume, toggleMute,
    setPlaybackRate, toggleLoop, toggleShuffle,
    playNext, playPrev, selectMedia,
    onTimeUpdate, onLoadedMetadata, onEnded,
    skipForward, skipBackward, toggleFullscreen,
    formatDuration,
  };
}
