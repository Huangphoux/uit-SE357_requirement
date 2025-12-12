import React, { useState } from 'react';
import { Bell, X, AlertCircle, Clock, ArrowLeft } from 'lucide-react';
import { mockNotifications, mockEnrollments, Notification } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

interface NotificationHubProps {
  onClose?: () => void;
  fullPage?: boolean;
}

export default function NotificationHub({ onClose, fullPage = false }: NotificationHubProps) {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Get notifications for current student
  const studentEnrollments = mockEnrollments.filter(e => e.studentId === user?.id);
  const enrolledCourseIds = studentEnrollments.map(e => e.courseId);

  const studentNotifications = mockNotifications.filter(n => {
    if (n.recipients.type === 'all') return true;
    if (n.recipients.type === 'course' && n.recipients.courseId) {
      return enrolledCourseIds.includes(n.recipients.courseId);
    }
    if (n.recipients.type === 'specific' && n.recipients.studentIds) {
      return n.recipients.studentIds.includes(user?.id || '');
    }
    return false;
  });

  // Apply filter
  const filteredNotifications = studentNotifications.filter(n => {
    if (filter === 'unread') {
      return !n.readBy.includes(user?.id || '');
    }
    if (filter === 'important') {
      return n.priority === 'important';
    }
    return true;
  });

  const unreadCount = studentNotifications.filter(n => !n.readBy.includes(user?.id || '')).length;

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.readBy.includes(user?.id || '')) {
      notification.readBy.push(user?.id || '');
    }
    setSelectedNotification(notification);
  };

  if (selectedNotification) {
    return (
      <NotificationDetail
        notification={selectedNotification}
        onBack={() => setSelectedNotification(null)}
        fullPage={fullPage}
      />
    );
  }

  if (fullPage) {
    return (
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1>My Notifications</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-[#0056b3] text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'unread'
                ? 'bg-[#0056b3] text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </button>
          <button
            onClick={() => setFilter('important')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'important'
                ? 'bg-[#0056b3] text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Important
          </button>
        </div>

        {/* Notification List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-card p-12 rounded-lg border border-border text-center">
              <Bell className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">No notifications to show</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                isRead={notification.readBy.includes(user?.id || '')}
                onClick={() => handleNotificationClick(notification)}
              />
            ))
          )}
        </div>
      </div>
    );
  }

  // Quick view dropdown
  return (
    <div className="bg-card rounded-lg border border-border shadow-lg w-96 max-h-[500px] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          <span className="text-foreground">Notifications</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Notification List - Recent 5 */}
      <div>
        {studentNotifications.slice(0, 5).length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
              No notifications yet
            </p>
          </div>
        ) : (
          studentNotifications.slice(0, 5).map((notification) => (
            <button
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className="w-full p-4 border-b border-border hover:bg-muted/50 transition-colors text-left"
            >
              <div className="flex gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#e9f2ff' }}
                >
                  <span className="text-[#0056b3]">
                    {notification.senderName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {notification.priority === 'important' && (
                      <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#dc3545' }} />
                    )}
                    <p
                      className={`truncate text-foreground ${
                        !notification.readBy.includes(user?.id || '') ? '' : 'opacity-70'
                      }`}
                      style={{ fontSize: '0.875rem' }}
                    >
                      {notification.subject}
                    </p>
                  </div>
                  <p className="text-muted-foreground truncate" style={{ fontSize: '0.75rem' }}>
                    {notification.senderName}
                  </p>
                  <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                    {getTimeAgo(notification.sentAt)}
                  </p>
                </div>
                {!notification.readBy.includes(user?.id || '') && (
                  <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: '#0056b3' }} />
                )}
              </div>
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      {studentNotifications.length > 0 && (
        <div className="p-3 border-t border-border text-center">
          <button
            className="text-[#0056b3] hover:underline"
            style={{ fontSize: '0.875rem' }}
            onClick={() => {
              // This would navigate to full page in real app
              if (onClose) onClose();
            }}
          >
            View All Notifications
          </button>
        </div>
      )}
    </div>
  );
}

interface NotificationCardProps {
  notification: Notification;
  isRead: boolean;
  onClick: () => void;
}

function NotificationCard({ notification, isRead, onClick }: NotificationCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-card rounded-lg border border-border p-4 hover:shadow-md transition-shadow text-left"
      style={{ backgroundColor: isRead ? '#ffffff' : '#e9f2ff' }}
    >
      <div className="flex gap-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: isRead ? '#f8f9fa' : '#0056b3' }}
        >
          <span style={{ color: isRead ? '#6c757d' : '#ffffff' }}>
            {notification.senderName.charAt(0)}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {notification.priority === 'important' && (
              <AlertCircle className="w-4 h-4" style={{ color: '#dc3545' }} />
            )}
            <h3 className="text-foreground" style={{ fontSize: '0.875rem' }}>{notification.subject}</h3>
          </div>
          <p className="text-muted-foreground mb-2" style={{ fontSize: '0.875rem' }}>
            {notification.message.substring(0, 100)}...
          </p>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span style={{ fontSize: '0.75rem' }}>
              {new Date(notification.sentAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <span style={{ fontSize: '0.75rem' }}>• {notification.senderName}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

interface NotificationDetailProps {
  notification: Notification;
  onBack: () => void;
  fullPage?: boolean;
}

function NotificationDetail({ notification, onBack, fullPage }: NotificationDetailProps) {
  return (
    <div className={fullPage ? 'p-6' : 'fixed inset-0 flex items-center justify-center p-4 z-50'} style={!fullPage ? { backgroundColor: 'rgba(0, 0, 0, 0.5)' } : undefined}>
      <div className={fullPage ? 'max-w-3xl mx-auto' : 'bg-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto'}>
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-muted rounded-md transition-colors text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-foreground">Notification Details</h2>
          </div>
        </div>

        {/* Content */}
        <div className="bg-card rounded-lg border border-border p-6">
          {/* Priority Badge */}
          {notification.priority === 'important' && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded" style={{ backgroundColor: '#fff3cd' }}>
              <AlertCircle className="w-5 h-5" style={{ color: '#dc3545' }} />
              <span style={{ fontSize: '0.875rem', color: '#856404' }}>
                This is marked as an important notification
              </span>
            </div>
          )}

          {/* Subject */}
          <h2 className="mb-4 text-foreground">{notification.subject}</h2>

          {/* Metadata */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#e9f2ff' }}
            >
              <span className="text-[#0056b3]">
                {notification.senderName.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-foreground">{notification.senderName}</p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span style={{ fontSize: '0.875rem' }}>
                  {new Date(notification.sentAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="prose max-w-none">
            <div className="text-foreground" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
              {notification.message}
            </div>
          </div>
        </div>

        {/* Close Button */}
        {!fullPage && (
          <div className="flex justify-end p-6">
            <button
              onClick={onBack}
              className="px-6 py-2 rounded-md border border-border hover:bg-muted transition-colors text-foreground"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Export component for Bell Icon in navigation
export function NotificationBellIcon() {
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  // Get notifications for current student
  const studentEnrollments = mockEnrollments.filter(e => e.studentId === user?.id);
  const enrolledCourseIds = studentEnrollments.map(e => e.courseId);

  const studentNotifications = mockNotifications.filter(n => {
    if (n.recipients.type === 'all') return true;
    if (n.recipients.type === 'course' && n.recipients.courseId) {
      return enrolledCourseIds.includes(n.recipients.courseId);
    }
    if (n.recipients.type === 'specific' && n.recipients.studentIds) {
      return n.recipients.studentIds.includes(user?.id || '');
    }
    return false;
  });

  const unreadCount = studentNotifications.filter(n => !n.readBy.includes(user?.id || '')).length;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 hover:bg-[#004494] rounded-md transition-colors"
      >
        <Bell className="w-5 h-5" style={{ color: unreadCount > 0 ? '#ffffff' : '#6c757d' }} />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: '#dc3545', fontSize: '0.75rem' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 z-50">
            <NotificationHub onClose={() => setShowDropdown(false)} />
          </div>
        </>
      )}
    </div>
  );
}