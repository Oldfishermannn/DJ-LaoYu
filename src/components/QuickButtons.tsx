import { QUICK_ACTIONS } from '@/data/quick-actions';

interface QuickButtonsProps {
  onAction: (prompt: string) => void;
}

export default function QuickButtons({ onAction }: QuickButtonsProps) {
  return (
    <div className="flex flex-row flex-wrap gap-1.5 py-2 px-2">
      {QUICK_ACTIONS.map((action) => (
        <button
          key={action.id}
          onClick={() => onAction(action.prompt)}
          className="text-xs bg-[#222] text-[#aaa] hover:bg-[#333] rounded-full px-3 py-1 transition-colors cursor-pointer whitespace-nowrap"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
