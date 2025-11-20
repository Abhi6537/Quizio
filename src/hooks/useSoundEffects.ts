import { useCallback, useRef } from 'react';

export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    const context = initAudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration);
  }, [initAudioContext]);

  const playCorrect = useCallback(() => {
    playTone(523.25, 0.2); // C5
    setTimeout(() => playTone(659.25, 0.2), 100); // E5
    setTimeout(() => playTone(783.99, 0.3), 200); // G5
  }, [playTone]);

  const playIncorrect = useCallback(() => {
    playTone(200, 0.5, 'sawtooth');
  }, [playTone]);

  const playComplete = useCallback(() => {
    const notes = [523.25, 587.33, 659.25, 783.99]; // C5, D5, E5, G5
    notes.forEach((note, index) => {
      setTimeout(() => playTone(note, 0.3), index * 150);
    });
  }, [playTone]);

  const playClick = useCallback(() => {
    playTone(800, 0.05, 'square');
  }, [playTone]);

  return {
    playCorrect,
    playIncorrect,
    playComplete,
    playClick,
  };
};
