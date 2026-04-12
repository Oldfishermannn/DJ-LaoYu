'use client';

import { useEffect, useRef, useState } from 'react';
import { ChatMessage as ChatMessageType, BandMember, ChatMode } from '@/types';
import ChatMessage from './ChatMessage';
import QuickButtons from './QuickButtons';

interface ChatPanelProps {
  messages: ChatMessageType[];
  members: BandMember[];
  activeCharacterId: string | null;
  chatMode: ChatMode;
  onSendMessage: (text: string) => void;
  onModeChange: (mode: ChatMode) => void;
  isLoading: boolean;
}

export default function ChatPanel({
  messages,
  members,
  activeCharacterId,
  chatMode,
  onSendMessage,
  onModeChange,
  isLoading,
}: ChatPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeCharacter = activeCharacterId
    ? members.find((m) => m.id === activeCharacterId) ?? null
    : null;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text || isLoading) return;
    onSendMessage(text);
    setInputValue('');
  };

  const handleQuickAction = (prompt: string) => {
    if (isLoading) return;
    onSendMessage(prompt);
  };

  const placeholder =
    chatMode === 'private' && activeCharacter
      ? `对 ${activeCharacter.name} 说...`
      : '和乐队说点什么...';

  return (
    <div
      className="flex flex-col h-full border-t border-[#222]"
      style={{ backgroundColor: 'var(--panel-bg, #0d0d1a)' }}
    >
      {/* Tab bar */}
      <div className="flex flex-row border-b border-[#222] shrink-0">
        <button
          onClick={() => onModeChange('group')}
          className={`px-4 py-2 text-sm transition-colors cursor-pointer ${
            chatMode === 'group'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-[#666] hover:text-[#aaa]'
          }`}
        >
          🎸 乐队群聊
        </button>

        {activeCharacter && (
          <button
            onClick={() => onModeChange('private')}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm transition-colors cursor-pointer ${
              chatMode === 'private'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-[#666] hover:text-[#aaa]'
            }`}
          >
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: activeCharacter.color }}
            />
            {activeCharacter.name}
          </button>
        )}
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-3 py-2 min-h-0">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} members={members} />
        ))}

        {isLoading && (
          <div className="flex justify-start mb-2">
            <div
              className="text-sm rounded-lg px-3 py-2 bg-[#1a1a2e] text-[#888] animate-pulse"
            >
              乐手们在思考...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick buttons */}
      <div className="shrink-0 border-t border-[#1a1a2e]">
        <QuickButtons onAction={handleQuickAction} />
      </div>

      {/* Input form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-row gap-2 px-3 py-2 border-t border-[#222] shrink-0"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1 bg-[#111] text-[#eee] text-sm rounded-lg px-3 py-2 border border-[#333] outline-none focus:border-cyan-700 placeholder-[#555] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="px-4 py-2 text-sm font-semibold rounded-lg bg-cyan-400 text-black hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          发送
        </button>
      </form>
    </div>
  );
}
