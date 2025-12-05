import React, { useState } from 'react';
import { X, Send, AlertCircle, Clock, CheckCircle, Users } from 'lucide-react';
import { toast } from 'sonner';
import { mockNotifications, mockCourses, mockEnrollments, Notification } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

export default function NotificationManagement() {
  const { user } = useAuth();
  const [showCompose, setShowCompose] = useState(false);
  const [filter, setFilter] = useState<'all' | 'sent'>('all');

  // Get notifications sent by current user
  const userNotifications = mockNotifications.filter(n => n.senderId === user?.id);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1>Notification Center</h1>
          <p className="text-muted-foreground mt-1">Send announcements to your students</p>
        </div>
        <button
          onClick={() => setShowCompose(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-white"
          style={{ backgroundColor: '#0056b3' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#004494'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
        >
          <Send className="w-4 h-4" />
          Compose New
        </button>
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
          All Notifications
        </button>
        <button
          onClick={() => setFilter('sent')}
          className={`px-4 py-2 rounded-md transition-colors ${
            filter === 'sent'
              ? 'bg-[#0056b3] text-white'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Sent by Me
        </button>
      </div>

      {/* Notification History */}
      <div className="bg-card rounded-lg border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3" style={{ fontSize: '0.875rem' }}>Date Sent</th>
                <th className="text-left px-4 py-3" style={{ fontSize: '0.875rem' }}>Subject</th>
                <th className="text-left px-4 py-3" style={{ fontSize: '0.875rem' }}>Recipients</th>
                <th className="text-left px-4 py-3" style={{ fontSize: '0.875rem' }}>Priority</th>
                <th className="text-left px-4 py-3" style={{ fontSize: '0.875rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {(filter === 'all' ? mockNotifications : userNotifications).map((notification) => (
                <NotificationRow key={notification.id} notification={notification} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <ComposeModal onClose={() => setShowCompose(false)} />
      )}
    </div>
  );
}

function NotificationRow({ notification }: { notification: Notification }) {
  const getRecipientText = () => {
    if (notification.recipients.type === 'all') {
      return 'All Students';
    } else if (notification.recipients.type === 'course') {
      const course = mockCourses.find(c => c.id === notification.recipients.courseId);
      return course ? `Class: ${course.name}` : 'Unknown Class';
    } else {
      return `${notification.recipients.studentIds?.length || 0} Student(s)`;
    }
  };

  const getReadCount = () => {
    if (notification.recipients.type === 'all') {
      const totalStudents = mockEnrollments.length;
      return `${notification.readBy.length}/${totalStudents}`;
    } else if (notification.recipients.type === 'course') {
      const courseEnrollments = mockEnrollments.filter(e => e.courseId === notification.recipients.courseId);
      return `${notification.readBy.length}/${courseEnrollments.length}`;
    } else {
      return `${notification.readBy.length}/${notification.recipients.studentIds?.length || 0}`;
    }
  };

  return (
    <tr className="border-t border-border hover:bg-muted/30">
      <td className="px-4 py-3" style={{ fontSize: '0.875rem' }}>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          {new Date(notification.sentAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {notification.priority === 'important' && (
            <AlertCircle className="w-4 h-4" style={{ color: '#dc3545' }} />
          )}
          <span style={{ fontSize: '0.875rem' }}>{notification.subject}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="w-4 h-4" />
          <span style={{ fontSize: '0.875rem' }}>{getRecipientText()}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        {notification.priority === 'important' ? (
          <span
            className="px-2 py-1 rounded text-white"
            style={{ fontSize: '0.75rem', backgroundColor: '#dc3545' }}
          >
            Important
          </span>
        ) : (
          <span
            className="px-2 py-1 rounded"
            style={{ fontSize: '0.75rem', backgroundColor: '#e9f2ff', color: '#0056b3' }}
          >
            Normal
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span style={{ fontSize: '0.875rem' }}>Sent ({getReadCount()} read)</span>
        </div>
      </td>
    </tr>
  );
}

interface ComposeModalProps {
  onClose: () => void;
}

function ComposeModal({ onClose }: ComposeModalProps) {
  const { user } = useAuth();
  const [recipientType, setRecipientType] = useState<'all' | 'course' | 'specific'>('course');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isImportant, setIsImportant] = useState(false);

  // Get courses taught by current teacher
  const teacherCourses = mockCourses.filter(c => c.teacherId === user?.id);

  const handleSend = () => {
    // Validation
    if (!subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    if (recipientType === 'course' && !selectedCourse) {
      toast.error('Please select a course');
      return;
    }

    // Create notification
    const newNotification: Notification = {
      id: String(mockNotifications.length + 1),
      senderId: user?.id || '',
      senderName: user?.name || '',
      senderRole: user?.role === 'admin' ? 'admin' : 'teacher',
      subject,
      message,
      recipients: {
        type: recipientType,
        courseId: recipientType === 'course' ? selectedCourse : undefined,
        studentIds: recipientType === 'specific' ? [] : undefined,
      },
      priority: isImportant ? 'important' : 'normal',
      sentAt: new Date().toISOString(),
      readBy: [],
    };

    mockNotifications.unshift(newNotification);
    toast.success('Notification sent successfully!', {
      style: { backgroundColor: '#28a745', color: 'white' },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2>Compose Notification</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Recipient Type */}
          <div>
            <label className="block mb-2" style={{ fontSize: '0.875rem' }}>
              Send To <span className="text-destructive">*</span>
            </label>
            <select
              value={recipientType}
              onChange={(e) => setRecipientType(e.target.value as any)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0056b3]"
            >
              <option value="course">Specific Course</option>
              <option value="all">All Students</option>
            </select>
          </div>

          {/* Course Selection */}
          {recipientType === 'course' && (
            <div>
              <label className="block mb-2" style={{ fontSize: '0.875rem' }}>
                Select Course <span className="text-destructive">*</span>
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0056b3]"
              >
                <option value="">-- Select a course --</option>
                {teacherCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Subject */}
          <div>
            <label className="block mb-2" style={{ fontSize: '0.875rem' }}>
              Subject <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter notification subject..."
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0056b3]"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block mb-2" style={{ fontSize: '0.875rem' }}>
              Message <span className="text-destructive">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message here..."
              rows={10}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0056b3] resize-none"
              style={{ fontFamily: 'inherit' }}
            />
            <p className="text-muted-foreground mt-1" style={{ fontSize: '0.75rem' }}>
              Tip: Use line breaks to format your message
            </p>
          </div>

          {/* Priority Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="important"
              checked={isImportant}
              onChange={(e) => setIsImportant(e.target.checked)}
              className="w-4 h-4 accent-[#dc3545]"
            />
            <label htmlFor="important" className="flex items-center gap-2" style={{ fontSize: '0.875rem' }}>
              <AlertCircle className="w-4 h-4" style={{ color: '#dc3545' }} />
              Mark as Important (will show red alert icon)
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-border">
          <button
            onClick={handleSend}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white"
            style={{ backgroundColor: '#0056b3' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#004494'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
          >
            <Send className="w-4 h-4" />
            Send Now
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-md border border-border hover:bg-muted transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}