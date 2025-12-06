import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DarkModeToggle from './DarkModeToggle';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/PaginationWrapper';
import FileUpload from './FileUpload';
import { usePagination } from '../hooks/usePagination';
import { 
  GraduationCap, 
  LogOut, 
  Search, 
  BookOpen,
  Calendar,
  User,
  FileText,
  Award
} from 'lucide-react';
import { toast } from 'sonner';
import { mockCourses, mockEnrollments, Course } from '../data/mockData';
import CourseDetailView from './CourseDetailView';
import { NotificationBellIcon } from './NotificationHub';
import NotificationHub from './NotificationHub';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<'my-courses' | 'catalog' | 'notifications'>('my-courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { logout, user } = useAuth();

  // Get enrolled courses
  const enrolledCourseIds = mockEnrollments
    .filter(e => e.studentId === user?.id)
    .map(e => e.courseId);
  const enrolledCourses = mockCourses.filter(c => enrolledCourseIds.includes(c.id));
  const availableCourses = mockCourses.filter(c => !enrolledCourseIds.includes(c.id));

  const handleEnroll = (courseId: string) => {
    const course = mockCourses.find(c => c.id === courseId);
    if (course && course.enrolled && course.capacity && course.enrolled >= course.capacity) {
      toast.error('Class is full');
      return;
    }
    mockEnrollments.push({
      id: String(mockEnrollments.length + 1),
      studentId: user?.id || '',
      courseId,
      enrolledAt: new Date().toISOString(),
    });
    toast.success('Enrolled successfully!');
  };

  const handleUnenroll = (courseId: string) => {
    const course = mockCourses.find(c => c.id === courseId);
    const enrollmentIndex = mockEnrollments.findIndex(
      e => e.studentId === user?.id && e.courseId === courseId
    );
    
    if (enrollmentIndex !== -1) {
      mockEnrollments.splice(enrollmentIndex, 1);
      toast.success(`Unenrolled from ${course?.name} successfully!`);
    }
  };

  // Page Navigation - Show detail page when course is selected
  if (selectedCourse) {
    return <CourseDetailView course={selectedCourse} onBack={() => setSelectedCourse(null)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation - Sticky added */}
      <nav className="sticky top-0 z-50 bg-[#0056b3] text-white px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-[#0056b3]" />
            </div>
            <div>
              <p>Student Portal</p>
              <p className="opacity-90" style={{ fontSize: '0.875rem' }}>{user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBellIcon />
            <DarkModeToggle />
            <button
              onClick={() => {
                logout();
                toast.success('Logged out successfully');
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-[#004494] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab('my-courses')}
            className={`px-6 py-3 transition-colors ${
              activeTab === 'my-courses'
                ? 'border-b-2 border-[#0056b3] text-[#0056b3]'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            My Courses
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-6 py-3 transition-colors ${
              activeTab === 'catalog'
                ? 'border-b-2 border-[#0056b3] text-[#0056b3]'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Course Catalog
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-6 py-3 transition-colors ${
              activeTab === 'notifications'
                ? 'border-b-2 border-[#0056b3] text-[#0056b3]'
                : 'text-gray-700 hover:text-foreground'
            }`}
          >
            Notifications
          </button>
        </div>

        {activeTab === 'catalog' && (
          <div className="mb-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search for courses by name or code..."
            />
          </div>
        )}

        {/* Course Grid */}
        {activeTab === 'my-courses' && (
          <div>
            <h2 className="mb-6">My Enrolled Courses</h2>
            {enrolledCourses.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="No Enrolled Courses"
                description="Browse the course catalog to enroll in your first course"
                action={{
                  label: "Browse Courses",
                  onClick: () => setActiveTab('catalog')
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course, index) => (
                  <div
                    key={course.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CourseCard 
                      course={course} 
                      enrolled={true}
                      onEnroll={() => {}}
                      onUnenroll={() => handleUnenroll(course.id)}
                      onViewDetails={() => setSelectedCourse(course)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'catalog' && (
          <CatalogView 
            availableCourses={availableCourses}
            searchQuery={searchQuery}
            onEnroll={handleEnroll}
            onViewDetails={(course) => setSelectedCourse(course)}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationHub fullPage={true} />
        )}
      </div>
    </div>
  );
}

interface CourseCardProps {
  course: Course;
  enrolled: boolean;
  onEnroll: () => void;
  onUnenroll?: () => void;
  onViewDetails: () => void;
}

function CourseCard({ course, enrolled, onEnroll, onUnenroll, onViewDetails }: CourseCardProps) {
  const [showConfirm, setShowConfirm] = React.useState(false);
  const isFull = !!(course.capacity && course.enrolled && course.enrolled >= course.capacity);

  return (
    <>
      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden hover:shadow-md transition-all transform hover:-translate-y-1">
        <div 
          className="h-40 bg-cover bg-center"
          style={{ 
            backgroundImage: course.imageUrl ? `url(${course.imageUrl})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        />
        <div className="p-5">
          <h3 className="mb-2">{course.name}</h3>
          <p className="text-muted-foreground mb-4" style={{ fontSize: '0.875rem' }}>
            {course.description}
          </p>
          
          <div className="space-y-2 mb-4" style={{ fontSize: '0.875rem' }}>
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{course.teacherName}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{course.schedule}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              <span>{course.enrolled}/{course.capacity} Students</span>
            </div>
          </div>

          {enrolled ? (
            <div className="space-y-2">
              <button
                onClick={onViewDetails}
                className="w-full px-4 py-2 rounded-md text-white"
                style={{ backgroundColor: '#0056b3' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#004494'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
              >
                View Course
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full px-4 py-2 rounded-md border border-destructive text-destructive hover:bg-[#f8d7da] transition-colors"
              >
                Unenroll
              </button>
            </div>
          ) : (
            <button
              onClick={onEnroll}
              disabled={isFull}
              className="w-full px-4 py-2 rounded-md text-[#212529] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: isFull ? '#e9ecef' : '#ffc107' }}
              onMouseEnter={(e) => {
                if (!isFull) e.currentTarget.style.backgroundColor = '#e0a800';
              }}
              onMouseLeave={(e) => {
                if (!isFull) e.currentTarget.style.backgroundColor = '#ffc107';
              }}
            >
              {isFull ? 'Class Full' : 'Enroll Now'}
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <h3 className="mb-4">Confirm Unenrollment</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to unenroll from <strong>{course.name}</strong>? 
              You will lose access to all course materials and assignments.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (onUnenroll) onUnenroll();
                  setShowConfirm(false);
                }}
                className="flex-1 px-4 py-2 rounded-md text-white"
                style={{ backgroundColor: '#dc3545' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
              >
                Yes, Unenroll
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 rounded-md border border-border hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface CatalogViewProps {
  availableCourses: Course[];
  searchQuery: string;
  onEnroll: (courseId: string) => void;
  onViewDetails: (course: Course) => void;
}

function CatalogView({ availableCourses, searchQuery, onEnroll, onViewDetails }: CatalogViewProps) {
  const filteredCourses = availableCourses.filter(course => 
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedData: paginatedCourses,
    setCurrentPage,
    setItemsPerPage
  } = usePagination({ data: filteredCourses, initialItemsPerPage: 9 });

  return (
    <div>
      <h2 className="mb-6">Available Courses</h2>
      {filteredCourses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses found"
          description={searchQuery ? "Try adjusting your search query" : "No available courses at the moment"}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedCourses.map((course, index) => (
              <div
                key={course.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CourseCard 
                  course={course} 
                  enrolled={false}
                  onEnroll={() => onEnroll(course.id)}
                  onViewDetails={() => onViewDetails(course)}
                />
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredCourses.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              itemsPerPageOptions={[9, 18, 27]}
            />
          </div>
        </>
      )}
    </div>
  );
}