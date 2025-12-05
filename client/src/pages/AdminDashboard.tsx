import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import DarkModeToggle from '@/pages/DarkModeToggle';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import StatsCard from '../components/StatsCard';
import LoadingButton from '@/pages/LoadingButton';
import ValidatedInput from '@/pages/ValidatedInput';
import FileUpload from '@/pages/FileUpload';
import Pagination from '@/components/PaginationWrapper';
import InlineEdit from '../components/InlineEdit';
import { usePagination } from '@/hooks/usePagination';
import { validateForm, commonRules } from '@/utils/validation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  X,
  GraduationCap,
  School,
  Bell,
} from 'lucide-react';
import { toast } from 'sonner';
import { mockCourses, mockClasses, Course, Class } from '@/data/mockData';
import NotificationManagement from '@/pages/NotificationManagement';

type MenuItem = 'dashboard' | 'courses' | 'classes' | 'users' | 'notifications';

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState<MenuItem>('dashboard');
  const { logout, user } = useAuth();

  // Handler để Quick Actions có thể điều hướng
  const handleQuickAction = (action: 'create-course' | 'create-class' | 'manage-users') => {
    switch (action) {
      case 'create-course':
        setActiveMenu('courses');
        // Trigger add course modal sau khi navigate
        setTimeout(() => {
          const event = new CustomEvent('admin-add-course');
          window.dispatchEvent(event);
        }, 100);
        break;
      case 'create-class':
        setActiveMenu('classes');
        setTimeout(() => {
          const event = new CustomEvent('admin-add-class');
          window.dispatchEvent(event);
        }, 100);
        break;
      case 'manage-users':
        setActiveMenu('users');
        break;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-[#0056b3] text-white flex flex-col">
        <div className="p-6 border-b border-[#004494]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-[#0056b3]" />
            </div>
            <div>
              <p className="text-white opacity-90" style={{ fontSize: '0.875rem' }}>Admin Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <button
            onClick={() => setActiveMenu('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md mb-2 transition-colors ${
              activeMenu === 'dashboard' ? 'bg-[#004494]' : 'hover:bg-[#004494]'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveMenu('courses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md mb-2 transition-colors ${
              activeMenu === 'courses' ? 'bg-[#004494]' : 'hover:bg-[#004494]'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Course Management</span>
          </button>
          <button
            onClick={() => setActiveMenu('classes')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md mb-2 transition-colors ${
              activeMenu === 'classes' ? 'bg-[#004494]' : 'hover:bg-[#004494]'
            }`}
          >
            <School className="w-5 h-5" />
            <span>Class Management</span>
          </button>
          <button
            onClick={() => setActiveMenu('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md mb-2 transition-colors ${
              activeMenu === 'users' ? 'bg-[#004494]' : 'hover:bg-[#004494]'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>User Management</span>
          </button>
          <button
            onClick={() => setActiveMenu('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md mb-2 transition-colors ${
              activeMenu === 'notifications' ? 'bg-[#004494]' : 'hover:bg-[#004494]'
            }`}
          >
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </button>
        </nav>

        <div className="p-4 border-t border-[#004494] space-y-2">
          <div className="flex items-center justify-center">
            <DarkModeToggle />
          </div>
          <button
            onClick={() => {
              logout();
              toast.success('Logged out successfully');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md hover:bg-[#004494] transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {activeMenu === 'dashboard' && <DashboardOverview onQuickAction={handleQuickAction} />}
        {activeMenu === 'courses' && <CourseManagement />}
        {activeMenu === 'classes' && <ClassManagement />}
        {activeMenu === 'users' && <UserManagement />}
        {activeMenu === 'notifications' && <NotificationManagement />}
      </div>
    </div>
  );
}

function DashboardOverview({ onQuickAction }: { onQuickAction: (action: 'create-course' | 'create-class' | 'manage-users') => void }) {
  return (
    <div className="p-8">
      <h1 className="mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Courses"
          value={mockCourses.length}
          icon={BookOpen}
          trend={{ value: 3, isPositive: true }}
        />
        <StatsCard
          title="Total Classes"
          value={mockClasses.length}
          icon={School}
          trend={{ value: 5, isPositive: false }}
        />
        <StatsCard
          title="Total Students"
          value={125}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border shadow-sm animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <h3 className="mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
              <div className="w-2 h-2 rounded-full bg-success"></div>
              <p style={{ fontSize: '0.875rem' }}>New course "Advanced React" created</p>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
              <div className="w-2 h-2 rounded-full bg-[#0056b3]"></div>
              <p style={{ fontSize: '0.875rem' }}>5 students enrolled in Web Development</p>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
              <div className="w-2 h-2 rounded-full bg-[#ffc107]"></div>
              <p style={{ fontSize: '0.875rem' }}>Class "React 101 - Section B" started</p>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border shadow-sm animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <h3 className="mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-3 bg-muted/50 rounded-md hover:bg-muted transition-colors" onClick={() => onQuickAction('create-course')}>
              <div className="flex items-center gap-3">
                <Plus className="w-4 h-4 text-[#0056b3]" />
                <span style={{ fontSize: '0.875rem' }}>Create New Course</span>
              </div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-muted/50 rounded-md hover:bg-muted transition-colors" onClick={() => onQuickAction('create-class')}>
              <div className="flex items-center gap-3">
                <Plus className="w-4 h-4 text-[#0056b3]" />
                <span style={{ fontSize: '0.875rem' }}>Create New Class</span>
              </div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-muted/50 rounded-md hover:bg-muted transition-colors" onClick={() => onQuickAction('manage-users')}>
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-[#0056b3]" />
                <span style={{ fontSize: '0.875rem' }}>Manage Users</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CourseManagement() {
  const [courses, setCourses] = useState(mockCourses);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<typeof mockCourses[0] | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; courseId: string | null }>({ 
    isOpen: false, 
    courseId: null 
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string | null>>({});

  // Listen for Quick Action events
  React.useEffect(() => {
    const handleQuickAction = () => {
      setEditingCourse(null);
      setFormData({ name: '', description: '' });
      setShowModal(true);
    };

    window.addEventListener('admin-add-course', handleQuickAction);
    return () => window.removeEventListener('admin-add-course', handleQuickAction);
  }, []);

  const handleCreate = async () => {
    // Validate form
    const validation = validateForm(formData, {
      name: commonRules.courseName,
      description: { required: true, minLength: 10 }
    });

    if (!validation.isValid) {
      setFormErrors(validation.errors);
      toast.error('Please fix the form errors');
      return;
    }

    setIsSaving(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (editingCourse) {
      setCourses(courses.map(c => 
        c.id === editingCourse.id 
          ? { ...c, name: formData.name, description: formData.description }
          : c
      ));
      toast.success('Course updated successfully!');
    } else {
      const newCourse = {
        id: `course-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        level: 'Beginner' as const,
        duration: '3 months',
        enrolledStudents: 0
      };
      setCourses([...courses, newCourse]);
      toast.success('Course created successfully!');
    }
    
    setIsSaving(false);
    setShowModal(false);
    setFormData({ name: '', description: '' });
    setFormErrors({});
    setEditingCourse(null);
  };

  // Filter courses based on search
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedData: paginatedCourses,
    setCurrentPage,
    setItemsPerPage
  } = usePagination({ data: filteredCourses, initialItemsPerPage: 10 });

  const handleInlineEdit = async (courseId: string, field: keyof Course, newValue: string) => {
    setCourses(courses.map(c =>
      c.id === courseId ? { ...c, [field]: newValue } : c
    ));
    toast.success('Course updated!');
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1>Courses</h1>
        <button
          onClick={() => {
            setEditingCourse(null);
            setFormData({ name: '', description: '' });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-[#212529] hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#ffc107' }}
        >
          <Plus className="w-4 h-4" />
          New Course
        </button>
      </div>

      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search courses by name or description..."
        />
      </div>

      {filteredCourses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses found"
          description={searchQuery ? "Try adjusting your search query" : "Create your first course to get started!"}
          action={!searchQuery ? {
            label: "Create Course",
            onClick: () => {
              setEditingCourse(null);
              setFormData({ name: '', description: '' });
              setShowModal(true);
            }
          } : undefined}
        />
      ) : (
        <>
          <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden animate-fade-in-up">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left">#</th>
                  <th className="px-6 py-3 text-left">Course Name</th>
                  <th className="px-6 py-3 text-left">Description</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCourses.map((course, index) => (
                  <tr key={course.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-6 py-4">
                      <InlineEdit
                        value={course.name}
                        onSave={(newValue: string) => handleInlineEdit(course.id, 'name', newValue)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <InlineEdit
                        value={course.description}
                        onSave={(newValue: string) => handleInlineEdit(course.id, 'description', newValue)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          className="p-2 hover:bg-muted rounded-md transition-all transform hover:scale-110"
                          onClick={() => {
                            setEditingCourse(course);
                            setFormData({ name: course.name, description: course.description });
                            setShowModal(true);
                          }}
                          title="Edit course"
                        >
                          <Edit className="w-4 h-4 text-[#0056b3]" />
                        </button>
                        <button
                          className="p-2 hover:bg-muted rounded-md transition-all transform hover:scale-110"
                          onClick={() => setDeleteConfirm({ isOpen: true, courseId: course.id })}
                          title="Delete course"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredCourses.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        </>
      )}

      {/* Create Course Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 animate-fade-in-up" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-card rounded-lg p-6 w-full max-w-md animate-slide-in">
            <div className="flex justify-between items-center mb-4">
              <h3>{editingCourse ? 'Edit Course' : 'Create Course'}</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <ValidatedInput
                label="Course Name"
                value={formData.name}
                onChange={(value) => setFormData({ ...formData, name: value })}
                validation={commonRules.courseName}
                placeholder="Web Development"
              />
              
              <ValidatedInput
                label="Description"
                type="textarea"
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
                validation={{ required: true, minLength: 10 }}
                placeholder="Brief description of the course..."
                rows={3}
              />

              <div>
                <label className="block mb-2">Course Image</label>
                <FileUpload
                  accept="image/*"
                  maxSize={5}
                  multiple={false}
                  onFilesSelected={(files) => console.log('Files:', files)}
                />
              </div>
              
              <LoadingButton
                loading={isSaving}
                loadingText={editingCourse ? 'Updating...' : 'Creating...'}
                onClick={handleCreate}
                className="w-full px-4 py-2 rounded-md text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#0056b3' }}
              >
                {editingCourse ? 'Update Course' : 'Create Course'}
              </LoadingButton>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, courseId: null })}
        onConfirm={() => {
          if (deleteConfirm.courseId) {
            setCourses(courses.filter(c => c.id !== deleteConfirm.courseId));
            toast.success('Course deleted successfully!');
          }
        }}
        title="Delete Course"
        message="Are you sure you want to delete this course? All related classes and materials will be affected."
      />
    </div>
  );
}

function ClassManagement() {
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState<typeof mockClasses[0] | null>(null);
  const [classes, setClasses] = useState(mockClasses);
  
  // Cập nhật cấu trúc formData để hỗ trợ chọn lịch chi tiết
  const [formData, setFormData] = useState({ 
    name: '', 
    courseId: '', 
    capacity: '', 
    selectedDays: [] as string[], // Mảng chứa các thứ đã chọn
    startTime: '', 
    endTime: ''
  });

  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; classId: string | null }>({ 
    isOpen: false, 
    classId: null 
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Danh sách các thứ trong tuần
  const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Hàm xử lý chọn/bỏ chọn thứ
  const toggleDay = (day: string) => {
    setFormData(prev => {
      const exists = prev.selectedDays.includes(day);
      if (exists) {
        return { ...prev, selectedDays: prev.selectedDays.filter(d => d !== day) };
      } else {
        // Sắp xếp lại theo thứ tự tuần sau khi thêm
        const newDays = [...prev.selectedDays, day].sort((a, b) => 
          DAYS_OF_WEEK.indexOf(a) - DAYS_OF_WEEK.indexOf(b)
        );
        return { ...prev, selectedDays: newDays };
      }
    });
  };

  // Listen for Quick Action events
  React.useEffect(() => {
    const handleQuickAction = () => {
      setEditingClass(null);
      setFormData({ 
        name: '', 
        courseId: '', 
        capacity: '', 
        selectedDays: [], 
        startTime: '', 
        endTime: '' 
      });
      setShowModal(true);
    };

    window.addEventListener('admin-add-class', handleQuickAction);
    return () => window.removeEventListener('admin-add-class', handleQuickAction);
  }, []);

  // Filter classes based on search
  const filteredClasses = classes.filter(cls => {
    const course = mockCourses.find(c => c.id === cls.courseId);
    return cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           cls.schedule.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (course?.name.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  // Pagination
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedData: paginatedClasses,
    setCurrentPage,
    setItemsPerPage
  } = usePagination({ data: filteredClasses, initialItemsPerPage: 10 });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1>Classes</h1>
        <button
          onClick={() => {
            setEditingClass(null);
            setFormData({ 
              name: '', 
              courseId: '', 
              capacity: '', 
              selectedDays: [], 
              startTime: '', 
              endTime: '' 
            });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-[#212529] hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#ffc107' }}
        >
          <Plus className="w-4 h-4" />
          New Class
        </button>
      </div>

      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search classes by name, course, or schedule..."
        />
      </div>

      {filteredClasses.length === 0 ? (
        <EmptyState
          icon={School}
          title="No classes found"
          description={searchQuery ? "Try adjusting your search query" : "Create your first class to get started!"}
          action={!searchQuery ? {
            label: "Create Class",
            onClick: () => {
              setEditingClass(null);
              setFormData({ name: '', courseId: '', capacity: '', selectedDays: [], startTime: '', endTime: '' });
              setShowModal(true);
            }
          } : undefined}
        />
      ) : (
        <>
          <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden animate-fade-in-up">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left">#</th>
                  <th className="px-6 py-3 text-left">Class Name</th>
                  <th className="px-6 py-3 text-left">Course</th>
                  <th className="px-6 py-3 text-left">Schedule</th>
                  <th className="px-6 py-3 text-left">Capacity</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClasses.map((cls, index) => {
                  const course = mockCourses.find(c => c.id === cls.courseId);
                  return (
                    <tr key={cls.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="px-6 py-4">{cls.name}</td>
                      <td className="px-6 py-4">{course?.name}</td>
                      <td className="px-6 py-4">{cls.schedule}</td>
                      <td className="px-6 py-4">{cls.enrolled}/{cls.capacity}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          className="p-2 hover:bg-muted rounded-md transition-all transform hover:scale-110"
                          onClick={() => {
                            setEditingClass(cls);
                            // Populate form data từ class đang edit
                            // Lưu ý: Nếu data cũ không có startTime/endTime tách biệt, bạn có thể cần logic parse chuỗi schedule
                            setFormData({ 
                              name: cls.name, 
                              courseId: cls.courseId, 
                              capacity: cls.capacity.toString(),
                              selectedDays: cls.days || [], // Giả sử mockData có trường days
                              startTime: cls.startTime || '', 
                              endTime: cls.endTime || ''
                            });
                            setShowModal(true);
                          }}
                          title="Edit class"
                        >
                          <Edit className="w-4 h-4 text-[#0056b3]" />
                        </button>
                        <button 
                          className="p-2 hover:bg-muted rounded-md transition-all transform hover:scale-110"
                          onClick={() => setDeleteConfirm({ isOpen: true, classId: cls.id })}
                          title="Delete class"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredClasses.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      </>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3>{editingClass ? 'Edit Class' : 'Create Class'}</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium">Class Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Web Development - Section A"
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium">Select Course</label>
                <select 
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                >
                  <option value="">Select a course...</option>
                  {mockCourses.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>
              </div>

              {/* Phần chọn Lịch mới */}
              <div>
                <label className="block mb-2 text-sm font-medium">Schedule</label>
                
                {/* Chọn Thứ */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {DAYS_OF_WEEK.map(day => {
                    const isSelected = formData.selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-1.5 rounded text-sm transition-colors border ${
                          isSelected 
                            ? 'bg-[#0056b3] text-white border-[#0056b3]' 
                            : 'bg-transparent text-muted-foreground border-border hover:border-[#0056b3] hover:text-[#0056b3]'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                {/* Chọn Giờ */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">Start Time</label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <span className="mt-5 text-muted-foreground">-</span>
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">End Time</label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium">Capacity</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="30"
                />
              </div>
              
              <button
                onClick={() => {
                  // Validate cơ bản
                  if (formData.selectedDays.length === 0 || !formData.startTime || !formData.endTime) {
                    toast.error('Please select days and time for the schedule');
                    return;
                  }

                  // Tạo chuỗi schedule hiển thị (VD: "Mon, Wed 09:00 - 11:00")
                  const scheduleString = `${formData.selectedDays.join(', ')} ${formData.startTime} - ${formData.endTime}`;

                  if (editingClass) {
                    setClasses(classes.map(c =>
                      c.id === editingClass.id
                        ? { 
                            ...c, 
                            name: formData.name, 
                            courseId: formData.courseId, 
                            capacity: parseInt(formData.capacity),
                            schedule: scheduleString,
                            days: formData.selectedDays, // Lưu riêng để tiện edit sau này
                            startTime: formData.startTime,
                            endTime: formData.endTime
                          }
                        : c
                    ));
                    toast.success('Class updated successfully!');
                  } else {
                    const newClass: Class = {
                      id: `class-${Date.now()}`,
                      name: formData.name,
                      courseId: formData.courseId,
                      schedule: scheduleString,
                      capacity: parseInt(formData.capacity),
                      enrolled: 0,
                      teacherId: 'teacher1',
                      startTime: formData.startTime,
                      endTime: formData.endTime,
                      days: formData.selectedDays
                    };
                    setClasses([...classes, newClass]);
                    toast.success('Class created successfully!');
                  }
                  setShowModal(false);
                }}
                className="w-full px-4 py-2 rounded-md text-white mt-2"
                style={{ backgroundColor: '#0056b3' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#004494'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
              >
                {editingClass ? 'Update Class' : 'Create Class'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, classId: null })}
        onConfirm={() => {
          if (deleteConfirm.classId) {
            setClasses(classes.filter(c => c.id !== deleteConfirm.classId));
            toast.success('Class deleted successfully!');
          }
        }}
        title="Delete Class"
        message="Are you sure you want to delete this class? This action cannot be undone."
      />
    </div>
  );
}

function UserManagement() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1>User Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-[#212529]"
          style={{ backgroundColor: '#ffc107' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0a800'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffc107'}
        >
          <Plus className="w-4 h-4" />
          Add Teacher
        </button>
      </div>

      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="mb-4">Teachers</h3>
        <p className="text-muted-foreground">Teacher management interface</p>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3>Add Teacher</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              
              <button
                onClick={() => {
                  toast.success('Teacher account created. Temporary password sent via email.');
                  setShowModal(false);
                }}
                className="w-full px-4 py-2 rounded-md text-white"
                style={{ backgroundColor: '#0056b3' }}
              >
                Create Teacher Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
