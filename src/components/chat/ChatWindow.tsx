import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api } from '@/lib/api';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { getSocket, socketEvents } from '@/lib/socket';
import { formatDistanceToNow } from 'date-fns';
import { Flag, MoreVertical } from 'lucide-react';

interface ChatWindowProps {
  threadId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ threadId }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const { data: messagesData } = useQuery(
    ['messages', threadId],
    () => api.getMessages(threadId),
    { enabled: !!threadId }
  );

  const { data: threadData } = useQuery(
    ['chat-thread', threadId],
    () => api.getChatThread(threadId),
    { enabled: !!threadId }
  );

  const sendMessageMutation = useMutation(
    (content: string) => {
      const socket = getSocket();
      if (socket) {
        socketEvents.sendMessage(threadId, content);
      }
      return Promise.resolve();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['messages', threadId]);
        setMessage('');
      },
    }
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesData]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleMessage = (data: any) => {
      if (data.threadId === threadId) {
        queryClient.invalidateQueries(['messages', threadId]);
      }
    };

    const handleTyping = (data: any) => {
      if (data.threadId === threadId) {
        setIsTyping(data.isTyping);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
      }
    };

    socketEvents.onMessageReceived(handleMessage);
    socketEvents.onTyping(handleTyping);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [threadId, queryClient]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessageMutation.mutate(message.trim());
    }
  };

  const handleTyping = () => {
    const socket = getSocket();
    if (socket && message.trim()) {
      socketEvents.typing(threadId, true);
    }
  };

  const messages = messagesData?.data || [];
  const participant = threadData?.data?.participant || threadData?.participant || { displayName: 'User', avatar: undefined };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-bgSecondary flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar src={participant?.avatar} alt={participant?.displayName || 'User'} />
          <div>
            <p className="font-medium text-text">{participant?.displayName}</p>
            {isTyping && <p className="text-xs text-textSecondary">typing...</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-bgSecondary">
            <Flag className="w-5 h-5 text-textSecondary" />
          </button>
          <button className="p-2 rounded-lg hover:bg-bgSecondary">
            <MoreVertical className="w-5 h-5 text-textSecondary" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg: any) => {
          const isOwn = msg.senderId === user?.id;
          return (
            <div
              key={msg.id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  isOwn
                    ? 'bg-primary text-white'
                    : 'bg-card text-text border border-bgSecondary'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    isOwn ? 'text-white/70' : 'text-textMuted'
                  }`}
                >
                  {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-bgSecondary">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!message.trim()}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

