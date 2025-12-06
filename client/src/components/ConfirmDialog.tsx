import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const variantStyles = {
    danger: 'bg-destructive hover:bg-destructive/90',
    warning: 'bg-[#ffc107] hover:bg-[#e0a800] text-[#212529]',
    info: 'bg-[#0056b3] hover:bg-[#004494]'
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 animate-fade-in-up" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-card rounded-lg p-6 w-full max-w-md animate-slide-in shadow-lg">
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            variant === 'danger' ? 'bg-destructive/10' : 
            variant === 'warning' ? 'bg-[#ffc107]/10' : 
            'bg-[#0056b3]/10'
          }`}>
            <AlertTriangle className={`w-5 h-5 ${
              variant === 'danger' ? 'text-destructive' : 
              variant === 'warning' ? 'text-[#ffc107]' : 
              'text-[#0056b3]'
            }`} />
          </div>
          <div className="flex-1">
            <h3 className="mb-2">{title}</h3>
            <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
              {message}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-md text-white transition-colors ${variantStyles[variant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;