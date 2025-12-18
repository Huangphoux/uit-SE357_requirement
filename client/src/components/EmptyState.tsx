import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md" style={{ fontSize: '0.875rem' }}>
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 rounded-md text-white"
          style={{ backgroundColor: '#0056b3' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#004494'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}