'use client';

import { useState, useRef, useCallback } from 'react';

// ─── Shared types ───
interface LogEntry {
  id: number;
  time: string;
  text: string;
  type: 'info' | 'error' | 'audio' | 'user';
}

let logId = 0;
function now() {
  return new Date().toLocaleTimeString('en-US', { hour12: false });
}

// ─── Tab type ───
type Tab = 'realtime' | 'clip';

export default function LyriaTestPage() {
  const [tab, setTab] = useState<Tab>('clip');

  return (
    <div className="min-h-screen p-6" style={{ background: '#0a0a14', color: '#e0e0e0' }}>
      <h1 className="text-2xl font-bold mb-4" style={{ color: '#00ffff', fontFamily: 'monospace' }}>
        Lyria API Test
      </h1>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6">
        {[
          { key: 'clip' as Tab, label: 'Lyria 3 Clip (30s MP3)' },
          { key: 'realtime' as Tab, label: 'Lyria RealTime (Stream)' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-4 py-2 text-sm font-medium rounded-t-lg cursor-pointer transition-colors"
            style={{
              background: tab === t.key ? '#1a1a2e' : 'transparent',
              color: tab === t.key ? '#00ffff' : '#666',
              borderBottom: tab === t.key ? '2px solid #00ffff' : '2px solid transparent',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'clip' && <ClipPanel />}
      {tab === 'realtime' && <RealTimePanel />}
    </div>
  );
}

// ══════════════════════════════════════════════════
// Lyria 3 Clip Panel
// ══════════════════════════════════════════════════
function ClipPanel() {
  const [prompt, setPrompt] = useState('Create a 30-second cozy jazz piece with guitar, upright bass, and soft drums');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [error, setError] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setAudioUrl(null);
    setResponseText('');
    setError('');
    setElapsed(0);

    const start = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);

    try {
      const res = await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model: 'clip' }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);

      if (data.text) setResponseText(data.text);

      if (data.audioBase64) {
        const mime = data.mimeType || 'audio/mp3';
        const blob = base64ToBlob(data.audioBase64, mime);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      } else {
        setError('No audio in response');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-row gap-6">
      {/* Left: Controls */}
      <div className="w-96 space-y-4 shrink-0">
        <div>
          <label className="block text-sm mb-1" style={{ color: '#888' }}>Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: '#111', border: '1px solid #333', color: '#eee' }}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full px-4 py-3 rounded-lg font-bold text-sm cursor-pointer disabled:opacity-50 transition-all"
          style={{
            background: 'rgba(255,0,255,0.15)',
            border: '1px solid #ff00ff',
            color: '#ff00ff',
          }}
        >
          {isGenerating ? `Generating... ${elapsed}s` : 'Generate 30s Clip'}
        </button>

        {isGenerating && (
          <div className="text-xs" style={{ color: '#ffe66d' }}>
            Generating audio... {elapsed}s (may take 30-60s)
          </div>
        )}

        {error && (
          <div className="text-xs px-3 py-2 rounded-lg" style={{ background: '#2a0a0a', color: '#ff6b6b', border: '1px solid #ff6b6b33' }}>
            Error: {error}
          </div>
        )}
      </div>

      {/* Right: Result */}
      <div className="flex-1 space-y-4">
        {audioUrl && (
          <div className="p-4 rounded-lg" style={{ background: '#1a1a2e', border: '1px solid #333' }}>
            <div className="text-sm font-bold mb-3" style={{ color: '#4ecdc4' }}>Audio Generated!</div>
            <audio controls src={audioUrl} className="w-full mb-3" />
            <a
              href={audioUrl}
              download="lyria-clip.mp3"
              className="inline-block px-4 py-1.5 rounded text-xs font-medium cursor-pointer"
              style={{ background: '#222', border: '1px solid #555', color: '#aaa' }}
            >
              Download MP3
            </a>
          </div>
        )}

        {responseText && (
          <div className="p-4 rounded-lg" style={{ background: '#111', border: '1px solid #222' }}>
            <div className="text-xs font-bold mb-2" style={{ color: '#888' }}>Response Text</div>
            <pre className="text-xs whitespace-pre-wrap" style={{ color: '#aaa' }}>{responseText}</pre>
          </div>
        )}

        {!audioUrl && !isGenerating && (
          <div className="text-sm" style={{ color: '#444' }}>
            Click &quot;Generate 30s Clip&quot; to create music via Lyria 3.
            <br />Uses model: lyria-3-clip-preview
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// Lyria RealTime Panel
// ══════════════════════════════════════════════════
function RealTimePanel() {
  const [prompt, setPrompt] = useState('energetic rock band with drums, bass, guitar');
  const [bpm, setBpm] = useState(120);
  const [temperature, setTemperature] = useState(0.8);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [chunkCount, setChunkCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextPlayTimeRef = useRef(0);
  const chunkCountRef = useRef(0);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((text: string, type: LogEntry['type'] = 'info') => {
    setLogs((prev) => [...prev, { id: logId++, time: now(), text, type }].slice(-100));
    setTimeout(() => logsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, []);

  const playPcmChunk = useCallback((base64Data: string) => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext({ sampleRate: 48000 });
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const raw = atob(base64Data);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);

    const int16 = new Int16Array(bytes.buffer);
    const numSamples = int16.length / 2;
    const buffer = ctx.createBuffer(2, numSamples, 48000);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);
    for (let i = 0; i < numSamples; i++) {
      left[i] = int16[i * 2] / 32768;
      right[i] = int16[i * 2 + 1] / 32768;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);

    const t = ctx.currentTime;
    if (nextPlayTimeRef.current < t) nextPlayTimeRef.current = t;
    source.start(nextPlayTimeRef.current);
    nextPlayTimeRef.current += buffer.duration;
  }, []);

  const handleStart = async () => {
    if (isPlaying || isConnecting) return;
    setIsConnecting(true);
    setChunkCount(0);
    chunkCountRef.current = 0;
    addLog('Connecting via SDK...', 'info');

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
      if (!apiKey) throw new Error('Missing NEXT_PUBLIC_GEMINI_API_KEY');

      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext({ sampleRate: 48000 });
      if (audioCtxRef.current.state === 'suspended') await audioCtxRef.current.resume();
      nextPlayTimeRef.current = 0;
      addLog('AudioContext state: ' + audioCtxRef.current.state, 'info');

      const { GoogleGenAI } = await import('@google/genai');
      const client = new GoogleGenAI({ apiKey, apiVersion: 'v1alpha' });

      const session = await client.live.music.connect({
        model: 'models/lyria-realtime-exp',
        callbacks: {
          onmessage: (message: { setupComplete?: unknown; serverContent?: { audioChunks?: Array<{ data?: string }> } }) => {
            if (message.setupComplete !== undefined) {
              addLog('setupComplete received', 'info');
            }
            if (message.serverContent?.audioChunks) {
              for (const chunk of message.serverContent.audioChunks) {
                if (chunk.data) {
                  chunkCountRef.current++;
                  setChunkCount(chunkCountRef.current);
                  if (chunkCountRef.current <= 5 || chunkCountRef.current % 50 === 0) {
                    addLog(`Audio chunk #${chunkCountRef.current}, ${chunk.data.length} chars`, 'audio');
                  }
                  playPcmChunk(chunk.data);
                }
              }
            }
          },
          onerror: (error: unknown) => {
            addLog('Error: ' + String(error), 'error');
          },
          onclose: () => {
            addLog('Connection closed', 'info');
            setIsPlaying(false);
          },
        },
      });

      sessionRef.current = session;
      addLog('Connected! Setting prompt + config...', 'info');

      await session.setWeightedPrompts({
        weightedPrompts: [{ text: prompt, weight: 1.0 }],
      });
      addLog('Prompt set: ' + prompt, 'info');

      await session.setMusicGenerationConfig({
        musicGenerationConfig: { bpm, temperature, density: 0.7, brightness: 0.7, guidance: 3.5 },
      });
      addLog(`Config: bpm=${bpm}, temp=${temperature}`, 'info');

      session.play();
      addLog('play() called. Waiting for audio...', 'info');

      setIsPlaying(true);
      setIsConnecting(false);

      const start = Date.now();
      setElapsed(0);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000);
    } catch (err) {
      addLog('Failed: ' + (err instanceof Error ? err.message : String(err)), 'error');
      setIsConnecting(false);
    }
  };

  const handleStop = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch {}
      sessionRef.current = null;
    }
    setIsPlaying(false);
    addLog(`Stopped. Total chunks: ${chunkCountRef.current}`, 'info');
  };

  return (
    <div className="flex flex-row gap-6">
      <div className="w-80 space-y-4 shrink-0">
        <div>
          <label className="block text-sm mb-1" style={{ color: '#888' }}>Style Prompt</label>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: '#111', border: '1px solid #333', color: '#eee' }} />
        </div>

        <div>
          <label className="block text-sm mb-1" style={{ color: '#888' }}>BPM: {bpm}</label>
          <input type="range" min={60} max={200} value={bpm} onChange={(e) => setBpm(+e.target.value)} className="w-full" />
        </div>

        <div>
          <label className="block text-sm mb-1" style={{ color: '#888' }}>Temperature: {temperature.toFixed(1)}</label>
          <input type="range" min={1} max={10} value={temperature * 10} onChange={(e) => setTemperature(+e.target.value / 10)} className="w-full" />
        </div>

        <div className="flex gap-3 pt-2">
          {!isPlaying ? (
            <button onClick={handleStart} disabled={isConnecting}
              className="flex-1 px-4 py-2.5 rounded-lg font-bold text-sm cursor-pointer disabled:opacity-50"
              style={{ background: 'rgba(255,0,255,0.15)', border: '1px solid #ff00ff', color: '#ff00ff' }}>
              {isConnecting ? 'Connecting...' : 'Start Stream'}
            </button>
          ) : (
            <button onClick={handleStop}
              className="flex-1 px-4 py-2.5 rounded-lg font-bold text-sm cursor-pointer"
              style={{ background: '#222', border: '1px solid #666', color: '#aaa' }}>
              Stop
            </button>
          )}
        </div>

        <div className="text-xs pt-2 space-y-1" style={{ color: '#555' }}>
          <div>Chunks: {chunkCount} | {isPlaying ? 'Playing' : isConnecting ? 'Connecting' : 'Idle'}</div>
          {isPlaying && (
            <div style={{ color: chunkCount > 0 ? '#4ecdc4' : '#ffe66d' }}>
              {chunkCount > 0 ? `Streaming... ${elapsed}s` : `Waiting... ${elapsed}s (up to 30s)`}
            </div>
          )}
        </div>
      </div>

      {/* Log */}
      <div className="flex-1 rounded-lg border overflow-y-auto font-mono text-xs"
        style={{ background: '#080810', borderColor: '#222', maxHeight: 'calc(100vh - 160px)' }}>
        <div className="sticky top-0 px-3 py-2 border-b" style={{ background: '#0d0d1a', borderColor: '#222' }}>
          <span style={{ color: '#00ffff' }}>Console</span>
          <button onClick={() => setLogs([])} className="ml-4 text-xs cursor-pointer" style={{ color: '#555' }}>Clear</button>
        </div>
        <div className="p-3 space-y-0.5">
          {logs.map((log) => (
            <div key={log.id} className="flex gap-2">
              <span style={{ color: '#444' }}>{log.time}</span>
              <span style={{
                color: log.type === 'error' ? '#ff6b6b' : log.type === 'audio' ? '#4ecdc4' : log.type === 'user' ? '#ffe66d' : '#888'
              }}>{log.text}</span>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
}

// ─── Utils ───
function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteChars = atob(base64);
  const byteArrays: Uint8Array[] = [];
  for (let offset = 0; offset < byteChars.length; offset += 1024) {
    const slice = byteChars.slice(offset, offset + 1024);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) byteNumbers[i] = slice.charCodeAt(i);
    byteArrays.push(new Uint8Array(byteNumbers));
  }
  return new Blob(byteArrays as BlobPart[], { type: mimeType });
}
