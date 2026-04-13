'use client';

import type { BandMember } from '@/types';

const INSTRUMENT_EMOJI: Record<string, string> = {
  drums: '🥁',
  bass: '🎵',
  vocals: '🎤',
  guitar: '🎸',
  keys: '🎹',
};

interface BandLobbyProps {
  members: BandMember[];
  onEnterStage: () => void;
}

export default function BandLobby({ members, onEnterStage }: BandLobbyProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8"
      style={{ background: 'radial-gradient(ellipse at center, #0d0d2a 0%, #0a0a14 70%)' }}
    >
      {/* Title */}
      <h1
        className="text-4xl font-bold mb-2 tracking-wider"
        style={{
          color: '#00ffff',
          textShadow: '0 0 20px #00ffff, 0 0 40px #00ffff44',
          fontFamily: '"Courier New", monospace',
        }}
      >
        CYBER BAND
      </h1>
      <p className="text-sm mb-10" style={{ color: '#666' }}>
        你的赛博乐队已就位
      </p>

      {/* Character Cards */}
      <div className="flex flex-wrap justify-center gap-4 mb-10 max-w-3xl">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex flex-col items-center p-4 rounded-xl transition-all hover:scale-105"
            style={{
              width: '140px',
              background: 'rgba(13,13,26,0.9)',
              border: `1px solid ${member.color}44`,
              boxShadow: `0 0 20px ${member.color}22`,
            }}
          >
            {/* Avatar circle */}
            <div
              className="w-16 h-16 rounded-full mb-3 flex items-center justify-center text-2xl"
              style={{
                background: `radial-gradient(circle, ${member.color}33, transparent)`,
                border: `2px solid ${member.color}`,
                boxShadow: `0 0 12px ${member.color}66`,
              }}
            >
              {INSTRUMENT_EMOJI[member.instrument] ?? '🎵'}
            </div>

            {/* Name */}
            <span
              className="font-bold text-sm mb-1 tracking-wide"
              style={{
                color: member.color,
                textShadow: `0 0 8px ${member.color}88`,
                fontFamily: '"Courier New", monospace',
              }}
            >
              {member.name}
            </span>

            {/* Instrument */}
            <span className="text-xs mb-2" style={{ color: '#888' }}>
              {member.instrument.toUpperCase()}
            </span>

            {/* Personality tag */}
            <span
              className="text-xs px-2 py-0.5 rounded-full text-center leading-tight"
              style={{
                background: `${member.color}15`,
                color: `${member.color}cc`,
                border: `1px solid ${member.color}33`,
              }}
            >
              {member.personality.length > 8
                ? member.personality.slice(0, 8) + '...'
                : member.personality}
            </span>

            {/* Catchphrase */}
            <span
              className="text-xs mt-2 text-center italic leading-tight"
              style={{ color: '#555' }}
            >
              &ldquo;{member.catchphrase}&rdquo;
            </span>
          </div>
        ))}
      </div>

      {/* Enter Stage Button */}
      <button
        onClick={onEnterStage}
        className="px-10 py-3 rounded-xl text-lg font-bold tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, rgba(255,0,255,0.2), rgba(0,255,255,0.2))',
          border: '1px solid #ff00ff',
          color: '#ff00ff',
          textShadow: '0 0 12px #ff00ff, 0 0 24px #ff00ff44',
          boxShadow: '0 0 30px rgba(255,0,255,0.2)',
        }}
      >
        开始排练
      </button>
    </div>
  );
}
