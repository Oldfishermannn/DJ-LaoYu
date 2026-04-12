export type Instrument = 'drums' | 'bass' | 'vocals' | 'guitar' | 'keys';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'professional';

export interface BandMember {
  id: string;
  name: string;
  instrument: Instrument;
  color: string;
  personality: string;
  musicPreference: string;
  catchphrase: string;
  skillLevel: SkillLevel;
  isCustom: boolean;
}

export interface ChatMessage {
  id: string;
  characterId: string | 'user' | 'system';
  text: string;
  timestamp: number;
}

export interface LyriaParams {
  stylePrompt: string;
  bpm: number;
  scale: string;
  temperature: number;
  density: number;
  brightness: number;
  guidance: number;
}

export interface SheetPart {
  characterId: string;
  instrument: Instrument;
  chords: string[];
  barCount: number;
  rhythmDescription: string;
  playingTips: string;
  key: string;
  bpm: number;
  timeSignature: string;
}

export interface QuickAction {
  id: string;
  label: string;
  prompt: string;
  category: 'mood' | 'style' | 'control';
}

export type ChatMode = 'group' | 'private';
export type AnimationState = 'idle' | 'playing' | 'talking';

export interface EnergyLevels {
  low: number;
  mid: number;
  high: number;
  overall: number;
}
