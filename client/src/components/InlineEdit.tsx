import React, { useState, useEffect, useRef } from 'react';
import { Check, X, Edit } from 'lucide-react';

interface InlineEditProps {
  value: string;
  onSave: (newValue: string) => void;
  placeholder?: string;
  className?: string;
}

export default function InlineEdit({ value, onSave, placeholder = "", className = "" }: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    if (editValue.trim() && editValue !== value) {
      onSave(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isEditing) {
    return (
      <div className={`flex items-center gap-2 group ${className}`}>
        <span>{value}</span>
        <button
          onClick={() => setIsEditing(true)}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded transition-all"
          title="Edit"
        >
          <Edit className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 px-2 py-1 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-sm"
      />
      <button
        onClick={handleSave}
        className="p-1 hover:bg-green-100 dark:hover:bg-green-900 rounded transition-colors"
        title="Save"
      >
        <Check className="w-4 h-4 text-green-600" />
      </button>
      <button
        onClick={handleCancel}
        className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
        title="Cancel"
      >
        <X className="w-4 h-4 text-red-600" />
      </button>
    </div>
  );
}