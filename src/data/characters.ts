import { BandMember } from '@/types';

export const PRESET_CHARACTERS: BandMember[] = [
  {
    id: 'blaze', name: 'BLAZE', instrument: 'drums', color: '#ff6b6b',
    personality: '暴躁火爆，节奏至上主义者', musicPreference: '重节拍、复杂节奏型、打击乐花活',
    catchphrase: '节奏不对一切白搭', skillLevel: 'professional', isCustom: false,
  },
  {
    id: 'groove', name: 'GROOVE', instrument: 'bass', color: '#4ecdc4',
    personality: '沉稳冷酷，低音哲学家', musicPreference: 'Funk律动、深沉低音线、slap技巧',
    catchphrase: '低音是一切的基础', skillLevel: 'professional', isCustom: false,
  },
  {
    id: 'nova', name: 'NOVA', instrument: 'vocals', color: '#ffe66d',
    personality: '热情外向，天生队长，凝聚力担当', musicPreference: '旋律优先、情感表达、hook感',
    catchphrase: '让我们燥起来！', skillLevel: 'professional', isCustom: false,
  },
  {
    id: 'riff', name: 'RIFF', instrument: 'guitar', color: '#a8e6cf',
    personality: '叛逆随性，solo狂魔', musicPreference: '失真吉他、即兴solo、riff驱动',
    catchphrase: 'solo时间到了', skillLevel: 'professional', isCustom: false,
  },
  {
    id: 'echo', name: 'ECHO', instrument: 'keys', color: '#dda0dd',
    personality: '神秘文艺，氛围制造者', musicPreference: '合成器音色、环境音效、pad铺底',
    catchphrase: '加点氛围感...', skillLevel: 'professional', isCustom: false,
  },
];
