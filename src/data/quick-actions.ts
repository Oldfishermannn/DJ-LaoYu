import { QuickAction } from '@/types';

export const QUICK_ACTIONS: QuickAction[] = [
  { id: 'intense', label: '🔥 更猛一点', prompt: '我想要更猛更有力量感', category: 'mood' },
  { id: 'chill', label: '😌 收着点', prompt: '收一点，柔和一些', category: 'mood' },
  { id: 'relax', label: '🌊 放松一些', prompt: '来点轻松放松的感觉', category: 'mood' },
  { id: 'rock', label: '🎸 来点摇滚', prompt: '我想要摇滚的感觉', category: 'style' },
  { id: 'electronic', label: '🎹 电子感', prompt: '加点电子音乐的元素', category: 'style' },
  { id: 'funk', label: '🕺 Funk it', prompt: '来点funk的律动', category: 'style' },
  { id: 'blues', label: '🎷 蓝调', prompt: '来点蓝调的味道', category: 'style' },
];
