import { useCallback, useEffect, useRef, useState } from "react";

const MELODY = [261.63, 329.63, 392.0, 329.63, 293.66, 349.23, 440.0, 349.23];
const BASS = [130.81, 146.83, 164.81, 196.0];

function createOscillatorVoice(
  context: AudioContext,
  destination: GainNode,
  frequency: number,
  startTime: number,
  duration: number,
  type: OscillatorType,
  volume: number
) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gain);
  gain.connect(destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.05);
}

export function useBackgroundMusic() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<number | null>(null);
  const [enabled, setEnabled] = useState(true);
  const [playing, setPlaying] = useState(false);

  const ensureAudioGraph = useCallback(() => {
    if (audioContextRef.current && masterGainRef.current) {
      return {
        context: audioContextRef.current,
        gain: masterGainRef.current,
      };
    }

    const AudioContextClass =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextClass) {
      return null;
    }

    const context = new AudioContextClass();
    const gain = context.createGain();
    gain.gain.value = 0.35;
    gain.connect(context.destination);

    audioContextRef.current = context;
    masterGainRef.current = gain;

    return { context, gain };
  }, []);

  const scheduleLoop = useCallback((startTime: number) => {
    const graph = ensureAudioGraph();
    if (!graph) return;

    const { context, gain } = graph;

    MELODY.forEach((note, index) => {
      const noteStart = startTime + index * 0.45;
      createOscillatorVoice(context, gain, note, noteStart, 0.4, "sine", 0.12);
      createOscillatorVoice(
        context,
        gain,
        note / 2,
        noteStart,
        0.42,
        "triangle",
        0.06
      );
    });

    BASS.forEach((note, index) => {
      const bassStart = startTime + index * 0.9;
      createOscillatorVoice(
        context,
        gain,
        note,
        bassStart,
        0.8,
        "triangle",
        0.1
      );
    });
  }, [ensureAudioGraph]);

  const stop = useCallback(async () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      await audioContextRef.current.suspend();
    }

    setPlaying(false);
  }, []);

  const start = useCallback(async () => {
    const graph = ensureAudioGraph();
    if (!graph) return;

    const { context } = graph;
    setEnabled(true);
    await context.resume();

    if (intervalRef.current !== null) {
      setPlaying(true);
      return;
    }

    const launchTime = context.currentTime + 0.08;
    scheduleLoop(launchTime);
    intervalRef.current = window.setInterval(() => {
      if (!audioContextRef.current) return;
      scheduleLoop(audioContextRef.current.currentTime + 0.08);
    }, 3600);

    setPlaying(true);
  }, [ensureAudioGraph, scheduleLoop]);

  const toggleEnabled = useCallback(async () => {
    if (enabled) {
      setEnabled(false);
      await stop();
      return;
    }

    setEnabled(true);
  }, [enabled, stop]);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }

      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        void audioContextRef.current.close();
      }
    };
  }, []);

  return {
    enabled,
    playing,
    start,
    stop,
    toggleEnabled,
  };
}