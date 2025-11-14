import React from 'react';
import { ChatThread } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { formatDistanceToNow } from 'date-fns';

interface ChatListProps {
  chats: ChatThread[];
  selectedThreadId: string | null;
  onSelectThread: (threadId: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ chats, selectedThreadId, onSelectThread }) => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-bgSecondary">
        <h2 className="text-xl font-display font-semibold text-text">Messages</h2>
      </div>
      <div className="divide-y divide-bgSecondary">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectThread(chat.id)}
            className={`w-full p-4 text-left hover:bg-bgSecondary transition-colors ${
              selectedThreadId === chat.id ? 'bg-bgSecondary' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar
                  src={chat.participant?.avatar}
                  alt={chat.participant?.displayName || 'User'}
                  size="md"
                />
                {chat.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-card" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-text truncate">{chat.participant?.displayName}</p>
                  {chat.lastMessage && (
                    <span className="text-xs text-textMuted">
                      {formatDistanceToNow(new Date(chat.lastMessage.createdAt), { addSuffix: true })}
                    </span>
                  )}
                </div>
                {chat.lastMessage && (
                  <p className="text-sm text-textSecondary truncate">{chat.lastMessage.content}</p>
                )}
              </div>
              {chat.unreadCount > 0 && (
                <Badge variant="primary" size="sm">
                  {chat.unreadCount}
                </Badge>
              )}
            </div>
          </button>
        ))}
      </div>
      {chats.length === 0 && (
        <div className="p-8 text-center text-textSecondary">
          <p>No messages yet</p>
        </div>
      )}
    </div>
  );
};

