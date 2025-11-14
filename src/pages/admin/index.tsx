import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Check, X, Flag, Users, BarChart } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'stories' | 'reports' | 'users' | 'analytics'>('stories');
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const { data: pendingStories } = useQuery(
    'pending-stories',
    () => api.getPendingStories(),
    { enabled: user?.role === 'admin' && activeTab === 'stories' }
  );

  const { data: reports } = useQuery(
    'reports',
    () => api.getReports(),
    { enabled: user?.role === 'admin' && activeTab === 'reports' }
  );

  const approveMutation = useMutation(
    (id: string) => api.approveStory(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pending-stories');
        toast.success('Story approved');
      },
    }
  );

  const rejectMutation = useMutation(
    ({ id, reason }: { id: string; reason: string }) => api.rejectStory(id, reason),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pending-stories');
        setShowRejectModal(false);
        setSelectedStory(null);
        setRejectReason('');
        toast.success('Story rejected');
      },
    }
  );

  React.useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]);

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold text-text mb-8">Admin Panel</h1>

        {/* Tabs */}
        <div className="border-b border-bgSecondary mb-6">
          <div className="flex gap-4">
            {[
              { id: 'stories', label: 'Pending Stories', icon: Check },
              { id: 'reports', label: 'Reports', icon: Flag },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: BarChart },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-textSecondary hover:text-text'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'stories' && (
            <div className="space-y-4">
              {pendingStories?.data?.map((story: any) => (
                <Card key={story.id}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-display font-semibold text-text mb-2">
                        {story.title}
                      </h3>
                      <p className="text-textSecondary mb-4 line-clamp-3">{story.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-textSecondary">
                        <span>By: {story.author?.displayName}</span>
                        <span>Category: {story.category}</span>
                        <span>Language: {story.language}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => approveMutation.mutate(story.id)}
                        isLoading={approveMutation.isLoading}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setSelectedStory(story);
                          setShowRejectModal(true);
                        }}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              {(!pendingStories?.data || pendingStories.data.length === 0) && (
                <div className="text-center py-12">
                  <p className="text-textSecondary">No pending stories</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-4">
              {reports?.data?.map((report: any) => (
                <Card key={report.id}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-text mb-2">{report.reason}</p>
                      <p className="text-sm text-textSecondary">Type: {report.type}</p>
                      <p className="text-sm text-textSecondary">Target ID: {report.targetId}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Review
                    </Button>
                  </div>
                </Card>
              ))}
              {(!reports?.data || reports.data.length === 0) && (
                <div className="text-center py-12">
                  <p className="text-textSecondary">No reports</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="text-center py-12">
              <p className="text-textSecondary">Users management coming soon</p>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="text-center py-12">
              <p className="text-textSecondary">Analytics coming soon</p>
            </div>
          )}
        </div>
      </main>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setSelectedStory(null);
          setRejectReason('');
        }}
        title="Reject Story"
      >
        <div className="space-y-4">
          <p className="text-textSecondary">Please provide a reason for rejection:</p>
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Reason for rejection..."
            rows={4}
          />
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setShowRejectModal(false);
                setSelectedStory(null);
                setRejectReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (selectedStory && rejectReason.trim()) {
                  rejectMutation.mutate({ id: selectedStory.id, reason: rejectReason });
                }
              }}
              disabled={!rejectReason.trim()}
            >
              Reject
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}

