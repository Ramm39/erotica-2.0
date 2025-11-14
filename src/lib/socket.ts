import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

let socket: Socket | null = null;

export const initSocket = (): Socket => {
  if (socket?.connected) {
    return socket;
  }

  const token = Cookies.get('token');

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = (): Socket | null => {
  return socket;
};

// Socket event helpers
export const socketEvents = {
  // Message events
  sendMessage: (toUserId: string, content: string) => {
    socket?.emit('send_message', { toUserId, content });
  },

  sendMessageRequest: (toUserId: string, preview: string) => {
    socket?.emit('message_request', { toUserId, preview });
  },

  acceptRequest: (requestId: string) => {
    socket?.emit('accept_request', { requestId });
  },

  rejectRequest: (requestId: string) => {
    socket?.emit('reject_request', { requestId });
  },

  typing: (threadId: string, isTyping: boolean) => {
    socket?.emit('typing', { threadId, isTyping });
  },

  // Listeners
  onMessageReceived: (callback: (data: any) => void) => {
    socket?.on('message_received', callback);
    return () => socket?.off('message_received', callback);
  },

  onMessageRequestReceived: (callback: (data: any) => void) => {
    socket?.on('message_request_received', callback);
    return () => socket?.off('message_request_received', callback);
  },

  onMessageAccepted: (callback: (data: any) => void) => {
    socket?.on('message_accepted', callback);
    return () => socket?.off('message_accepted', callback);
  },

  onPresenceUpdate: (callback: (data: any) => void) => {
    socket?.on('presence_update', callback);
    return () => socket?.off('presence_update', callback);
  },

  onTyping: (callback: (data: any) => void) => {
    socket?.on('typing', callback);
    return () => socket?.off('typing', callback);
  },
};

