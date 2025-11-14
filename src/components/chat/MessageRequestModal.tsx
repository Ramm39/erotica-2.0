import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';

interface MessageRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: any;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

export const MessageRequestModal: React.FC<MessageRequestModalProps> = ({
  isOpen,
  onClose,
  request,
  onAccept,
  onReject,
}) => {
  if (!request) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Message Request">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar
            src={request.fromUser?.avatar}
            alt={request.fromUser?.displayName || 'User'}
            size="lg"
          />
          <div>
            <p className="font-medium text-text">{request.fromUser?.displayName}</p>
            <p className="text-sm text-textSecondary">wants to message you</p>
          </div>
        </div>
        <div className="p-4 bg-bgSecondary rounded-lg">
          <p className="text-textSecondary text-sm mb-2">Preview:</p>
          <p className="text-text">{request.preview}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => onReject(request.id)}
          >
            Reject
          </Button>
          <Button
            className="flex-1"
            onClick={() => onAccept(request.id)}
          >
            Accept
          </Button>
        </div>
      </div>
    </Modal>
  );
};

