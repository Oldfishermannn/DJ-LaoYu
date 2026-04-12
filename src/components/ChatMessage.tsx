import { ChatMessage as ChatMessageType, BandMember } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
  members: BandMember[];
}

export default function ChatMessage({ message, members }: ChatMessageProps) {
  const isUser = message.characterId === 'user';
  const isSystem = message.characterId === 'system';

  const member = isUser || isSystem
    ? null
    : members.find((m) => m.id === message.characterId) ?? null;

  if (isSystem) {
    return (
      <div className="flex justify-center my-1">
        <span className="text-xs text-[#555] px-3 py-1 rounded-full bg-[#111]">
          {message.text}
        </span>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex justify-end mb-2">
        <div
          className="text-sm rounded-lg px-3 py-2 max-w-[80%] text-cyan-300"
          style={{ backgroundColor: '#162447' }}
        >
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-2">
      <div
        className="text-sm rounded-lg px-3 py-2 max-w-[80%]"
        style={{
          backgroundColor: '#1a1a2e',
          borderLeft: `3px solid ${member?.color ?? '#888'}`,
        }}
      >
        {member && (
          <span
            className="font-bold text-xs mr-1"
            style={{ color: member.color }}
          >
            {member.name}
          </span>
        )}
        <span className="text-[#ccc]">{message.text}</span>
      </div>
    </div>
  );
}
