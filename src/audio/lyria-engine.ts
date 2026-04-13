'use client';

import { getAudioContext, getGainNode } from './audio-context';
import type { LyriaParams } from '@/types';

let currentSource: AudioBufferSourceNode | null = null;
let isCurrentlyPlaying = false;

/**
 * Generate music via Lyria 3 Clip (30s MP3) and play it through the audio chain.
 */
export async function startMusic(params: LyriaParams): Promise<void> {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') await ctx.resume();

  // Call server API to generate music
  const res = await fetch('/api/generate-music', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: params.stylePrompt,
      model: 'clip',
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Generate music failed: ${res.status}`);
  }

  const data = await res.json();
  if (!data.audioBase64) throw new Error('No audio in response');

  console.log('[Lyria] Got audio, decoding...');

  // Decode base64 MP3 to AudioBuffer
  const binaryStr = atob(data.audioBase64);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);

  const audioBuffer = await ctx.decodeAudioData(bytes.buffer);

  // Play through GainNode → AnalyserNode → destination
  const gain = getGainNode();
  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;
  source.loop = true; // Loop the 30s clip
  source.connect(gain);
  source.start(0);

  currentSource = source;
  isCurrentlyPlaying = true;
  console.log('[Lyria] Playing, duration:', audioBuffer.duration.toFixed(1), 's');
}

/** Stop music playback */
export async function stopMusic(): Promise<void> {
  if (currentSource) {
    try {
      currentSource.stop();
      currentSource.disconnect();
    } catch (e) {
      console.warn('[Lyria] stop error:', e);
    }
    currentSource = null;
  }
  isCurrentlyPlaying = false;
}

/** Check if music is currently playing */
export function isMusicPlaying(): boolean {
  return isCurrentlyPlaying;
}
