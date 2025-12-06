import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Login from '@/pages/Login';
import StudentRegistration from '@/pages/StudentRegistration';
import AdminDashboard from '@/pages/AdminDashboard';
import TeacherDashboard from '@/pages/TeacherDashboard';
import StudentDashboard from '@/pages/StudentDashboard';
import { Toaster } from 'sonner';

export default function App() {
  const { user } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  // Show registration page
  if (showRegister) {
    return (
      <>
        <StudentRegistration onShowLogin={() => setShowRegister(false)} />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  // Show login if not authenticated
  if (!user) {
    return (
      <>
        <Login onShowRegister={() => setShowRegister(true)} />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  // Route to appropriate dashboard based on role
  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return <Login onShowRegister={() => setShowRegister(true)} />;
    }
  };

  return (
    <>
      {renderDashboard()}
      <Toaster position="top-right" richColors />
    </>
  );
}