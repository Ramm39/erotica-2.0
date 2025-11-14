import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChatList } from '@/components/chat/ChatList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { MessageRequestModal } from '@/components/chat/MessageRequestModal';
import { useQuery } from 'react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { initSocket, socketEvents } from '@/lib/socket';
import { useRouter } from 'next/router';

export default function ChatPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(
        (router.query.threadId as string) || null
    );
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [pendingRequest, setPendingRequest] = useState<any>(null);

    const { data: chatsData } = useQuery('chats', () => api.getChats(), {
        enabled: isAuthenticated,
    });

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login?returnUrl=/chat');
            return;
        }

        const socket = initSocket();

        const unsubscribeRequest = socketEvents.onMessageRequestReceived((data) => {
            setPendingRequest(data);
            setShowRequestModal(true);
        });

        return () => {
            unsubscribeRequest();
        };
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null;
    }

    const chats = chatsData?.data || [];

    return (
        <div className="min-h-screen flex flex-col bg-bg">
            <Header />
            <main className="flex-1 flex">
                <div className="w-full md:w-1/3 border-r border-bgSecondary">
                    <ChatList
                        chats={chats}
                        selectedThreadId={selectedThreadId}
                        onSelectThread={setSelectedThreadId}
                    />
                </div>
                <div className="flex-1">
                    {selectedThreadId ? (
                        <ChatWindow threadId={selectedThreadId} />
                    ) : (
                        <div className="flex items-center justify-center h-full text-textSecondary">
                            Select a conversation to start chatting
                        </div>
                    )}
                </div>
            </main>

            <MessageRequestModal
                isOpen={showRequestModal}
                onClose={() => {
                    setShowRequestModal(false);
                    setPendingRequest(null);
                }}
                request={pendingRequest}
                onAccept={async (requestId) => {
                    await api.acceptMessageRequest(requestId);
                    setShowRequestModal(false);
                    setPendingRequest(null);
                }}
                onReject={async (requestId) => {
                    await api.rejectMessageRequest(requestId);
                    setShowRequestModal(false);
                    setPendingRequest(null);
                }}
            />
            <Footer />
        </div>
    );
}

