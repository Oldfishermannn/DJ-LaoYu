'use client';

interface Props {
  onSelect: (genre: string, prompt: string) => void;
  activeGenre?: string;
}

const GENRES = [
  { id: 'chill', label: 'Chill', prompt: '来点轻松的 Chill 音乐' },
  { id: 'jazz', label: 'Jazz', prompt: '来段爵士乐' },
  { id: 'rock', label: 'Rock', prompt: '来点摇滚' },
  { id: 'electronic', label: 'Electronic', prompt: '来段电子音乐' },
  { id: 'lofi', label: 'Lo-Fi', prompt: '来点 Lo-Fi' },
  { id: 'funk', label: 'Funk', prompt: '来段 Funk' },
  { id: 'rnb', label: 'R&B', prompt: '来点 R&B' },
];

export default function GenreCards({ onSelect, activeGenre }: Props) {
  return (
    <div className="flex gap-2 px-5 overflow-x-auto no-scrollbar justify-center flex-wrap">
      {GENRES.map((g) => {
        const isActive = activeGenre === g.id;
        return (
          <button
            key={g.id}
            onClick={() => onSelect(g.id, g.prompt)}
            className={`shrink-0 px-4 py-2 rounded-full text-[12px] tracking-wide
                       transition-all duration-300 active:scale-[0.96]
                       ${isActive
                         ? 'text-[#0d0d1a] font-medium shadow-lg shadow-[var(--simone-accent)]/20'
                         : 'glass text-white/50 hover:text-white/80 hover:bg-white/10'
                       }`}
            style={isActive ? {
              background: 'linear-gradient(135deg, var(--simone-accent), var(--simone-accent-warm))',
            } : undefined}
          >
            {g.label}
          </button>
        );
      })}
    </div>
  );
}
