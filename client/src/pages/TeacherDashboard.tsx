import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import DarkModeToggle from './DarkModeToggle';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import LoadingButton from './LoadingButton';
import ValidatedInput from './ValidatedInput';
import FileUpload from './FileUpload';
import Pagination from '../components/PaginationWrapper';
import { usePagination } from '../hooks/usePagination';
import { validateForm } from '../utils/validation';
import { 
  GraduationCap, 
  LogOut, 
  Plus,
  Edit,
  Trash2,
  X,
  FileText,
  Upload,
  Calendar,
  ChevronRight,
  User,
  Bell,
  BookOpen
} from 'lucide-react';
import { toast } from 'sonner';
import { mockCourses, mockMaterials, mockAssignments, mockSubmissions } from '../data/mockData';
import NotificationManagement from './NotificationManagement';

export default function TeacherDashboard() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const { logout, user } = useAuth();

  // Get teacher's courses
  const teacherCourses = mockCourses.filter(c => c.teacherId === user?.id);

  if (showNotifications) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="sticky top-0 z-50 bg-[#0056b3] text-white px-6 py-4 shadow-md w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#0056b3]" />
              </div>
              <div>
                <p>Teacher Portal</p>
                <p className="opacity-90" style={{ fontSize: '0.875rem' }}>{user?.name}</p>
              </div>
            </div>
            <button
              onClick={() => setShowNotifications(false)}
              className="px-4 py-2 rounded-md hover:bg-[#004494] transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </nav>
        <NotificationManagement />
      </div>
    );
  }

  // Page Navigation - Show course detail when selected
  if (selectedCourse) {
    return <TeacherCourseDetail courseId={selectedCourse} onBack={() => setSelectedCourse(null)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation - Sticky added */}
      <nav className="sticky top-0 z-50 bg-[#0056b3] text-white px-6 py-4 shadow-md w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-[#0056b3]" />
            </div>
            <div>
              <p>Teacher Portal</p>
              <p className="opacity-90" style={{ fontSize: '0.875rem' }}>{user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
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

      {/* Main Content - Dashboard List (Giữ max-w-7xl cho danh sách lớp học để dễ nhìn) */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">My Classes</h1>
          <button
            onClick={() => setShowNotifications(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium"
            style={{ backgroundColor: '#0056b3' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#004494'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
          >
            <Bell className="w-4 h-4" />
            Send Notifications
          </button>
        </div>

        {teacherCourses.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No classes assigned yet"
            description="You haven't been assigned to any classes. Contact your administrator for more information."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teacherCourses.map((course, index) => (
              <div 
                key={course.id}
                onClick={() => setSelectedCourse(course.id)}
                className="bg-card rounded-lg border border-border shadow-sm overflow-hidden hover:shadow-md transition-all transform hover:-translate-y-1 cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div 
                  className="h-32 bg-cover bg-center"
                  style={{ 
                    backgroundImage: course.imageUrl ? `url(${course.imageUrl})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                />
                <div className="p-5">
                  <h3 className="mb-2 font-semibold text-lg">{course.name}</h3>
                  <p className="text-muted-foreground mb-4" style={{ fontSize: '0.875rem' }}>
                    {course.enrolled} students enrolled
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>{course.schedule}</span>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TeacherCourseDetail({ courseId, onBack }: { courseId: string; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'materials' | 'assignments'>('materials');
  const course = mockCourses.find(c => c.id === courseId);

  if (!course) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* THAY ĐỔI: Header tràn viền */}
      <div className="sticky top-0 z-50 bg-[#0056b3] text-white shadow-md w-full">
        <div className="px-6 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity mb-4"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            <span>Back to My Classes</span>
          </button>
          
          <h2 className="mb-2 text-2xl font-bold">{course.name}</h2>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <div className="flex gap-6 border-b border-[#004494]">
            <button
              onClick={() => setActiveTab('materials')}
              className={`px-4 py-3 transition-colors font-medium ${
                activeTab === 'materials'
                  ? 'border-b-2 border-white'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              Materials
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-4 py-3 transition-colors font-medium ${
                activeTab === 'assignments'
                  ? 'border-b-2 border-white'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              Assignments
            </button>
          </div>
        </div>
      </div>

      {/* THAY ĐỔI: Content tràn viền (Full Width) */}
      <div className="w-full px-6 py-8 bg-card">
        {activeTab === 'materials' && <MaterialsManagement courseId={courseId} />}
        {activeTab === 'assignments' && <AssignmentsManagement courseId={courseId} />}
      </div>
    </div>
  );
}

function MaterialsManagement({ courseId }: { courseId: string }) {
  const [showModal, setShowModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<typeof mockMaterials[0] | null>(null);
  const [materials, setMaterials] = useState(mockMaterials.filter(m => m.courseId === courseId));
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; materialId: string | null }>({ 
    isOpen: false, 
    materialId: null 
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Filter materials
  const filteredMaterials = materials.filter(material =>
    material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedData: paginatedMaterials,
    setCurrentPage,
    setItemsPerPage
  } = usePagination({ data: filteredMaterials, initialItemsPerPage: 10 }); // Tăng itemsPerPage

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Course Materials</h2>
        <button
          onClick={() => {
            setEditingMaterial(null);
            setFormData({ title: '', description: '' });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-[#212529] hover:opacity-90 transition-opacity font-medium"
          style={{ backgroundColor: '#ffc107' }}
        >
          <Plus className="w-4 h-4" />
          Add Material
        </button>
      </div>

      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search materials by title or description..."
        />
      </div>

      {filteredMaterials.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No materials found"
          description={searchQuery ? "Try adjusting your search query" : "Add your first material to share with students"}
          action={!searchQuery ? {
            label: "Add Material",
            onClick: () => {
              setEditingMaterial(null);
              setFormData({ title: '', description: '' });
              setShowModal(true);
            }
          } : undefined}
        />
      ) : (
        <>
          <div className="space-y-4">
            {paginatedMaterials.map((material, index) => (
              <div 
                key={material.id} 
                className="bg-card p-5 rounded-lg border border-border flex items-center justify-between hover:shadow-md transition-all animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#e9f2ff] flex items-center justify-center flex-shrink-0">
                     <FileText className="w-6 h-6 text-[#0056b3]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">{material.title}</h4>
                    <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>{material.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingMaterial(material);
                      setFormData({ title: material.title, description: material.description });
                      setShowModal(true);
                    }}
                    className="p-2 hover:bg-muted rounded-md transition-all transform hover:scale-110"
                    title="Edit material"
                  >
                    <Edit className="w-4 h-4 text-[#0056b3]" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ isOpen: true, materialId: material.id })}
                    className="p-2 hover:bg-muted rounded-md transition-all transform hover:scale-110"
                    title="Delete material"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredMaterials.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 animate-fade-in-up" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-card rounded-lg p-6 w-full max-w-md animate-slide-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">{editingMaterial ? 'Edit Material' : 'Add Material'}</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <ValidatedInput
                label="Title"
                value={formData.title}
                onChange={(value) => setFormData({ ...formData, title: value })}
                validation={{ required: true, minLength: 3, maxLength: 100 }}
                placeholder="Introduction to JavaScript"
              />
              
              <ValidatedInput
                label="Description"
                type="textarea"
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
                validation={{ required: true, minLength: 10 }}
                placeholder="Brief description of the material..."
                rows={3}
              />

              <div>
                <label className="block mb-2 font-medium text-sm">Upload File</label>
                <FileUpload
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  maxSize={20}
                  multiple={false}
                  onFilesSelected={(files) => console.log('Files:', files)}
                />
              </div>
              
              <LoadingButton
                loading={isSaving}
                loadingText={editingMaterial ? 'Updating...' : 'Adding...'}
                onClick={async () => {
                  const validation = validateForm(formData, {
                    title: { required: true, minLength: 3 },
                    description: { required: true, minLength: 10 }
                  });

                  if (!validation.isValid) {
                    toast.error('Please fill in all required fields');
                    return;
                  }

                  setIsSaving(true);
                  await new Promise(resolve => setTimeout(resolve, 800));

                  if (editingMaterial) {
                    setMaterials(materials.map(m => 
                      m.id === editingMaterial.id 
                        ? { ...m, title: formData.title, description: formData.description }
                        : m
                    ));
                    toast.success('Material updated successfully!');
                  } else {
                    const newMaterial = {
                      id: `mat-${Date.now()}`,
                      courseId,
                      title: formData.title,
                      description: formData.description,
                      type: 'pdf' as const,
                      uploadDate: new Date().toISOString().split('T')[0]
                    };
                    setMaterials([...materials, newMaterial]);
                    toast.success('Material added successfully!');
                  }
                  
                  setIsSaving(false);
                  setShowModal(false);
                  setFormData({ title: '', description: '' });
                }}
                className="w-full px-4 py-2 rounded-md text-white hover:opacity-90 transition-opacity font-medium"
                style={{ backgroundColor: '#0056b3' }}
              >
                {editingMaterial ? 'Update Material' : 'Add Material'}
              </LoadingButton>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, materialId: null })}
        onConfirm={() => {
          if (deleteConfirm.materialId) {
            setMaterials(materials.filter(m => m.id !== deleteConfirm.materialId));
            toast.success('Material deleted successfully!');
          }
        }}
        title="Delete Material"
        message="Are you sure you want to delete this material? This action cannot be undone."
      />
    </div>
  );
}

function AssignmentsManagement({ courseId }: { courseId: string }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<typeof mockAssignments[0] | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [assignments, setAssignments] = useState(mockAssignments.filter(a => a.courseId === courseId));
  const [formData, setFormData] = useState({ title: '', description: '', dueDate: '', points: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; assignmentId: string | null }>({ 
    isOpen: false, 
    assignmentId: null 
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const filteredAssignments = assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedData: paginatedAssignments,
    setCurrentPage,
    setItemsPerPage
  } = usePagination({ data: filteredAssignments, initialItemsPerPage: 10 }); // Tăng itemsPerPage

  if (selectedAssignment) {
    return (
      <GradingInterface 
        assignmentId={selectedAssignment} 
        onBack={() => setSelectedAssignment(null)} 
      />
    );
  }

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Assignments</h2>
          <button
            onClick={() => {
              setEditingAssignment(null);
              setFormData({ title: '', description: '', dueDate: '', points: '' });
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-[#212529] hover:opacity-90 transition-opacity font-medium"
            style={{ backgroundColor: '#ffc107' }}
          >
            <Plus className="w-4 h-4" />
            Create Assignment
          </button>
        </div>

        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search assignments by title or description..."
          />
        </div>

        {filteredAssignments.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No assignments found"
            description={searchQuery ? "Try adjusting your search query" : "Create your first assignment for students"}
            action={!searchQuery ? {
              label: "Create Assignment",
              onClick: () => {
                setEditingAssignment(null);
                setFormData({ title: '', description: '', dueDate: '', points: '' });
                setShowCreateModal(true);
              }
            } : undefined}
          />
        ) : (
          <>
            <div className="space-y-4">
              {paginatedAssignments.map((assignment, index) => {
                const submissions = mockSubmissions.filter(s => s.assignmentId === assignment.id);
                const graded = submissions.filter(s => s.status === 'graded').length;
                const needsGrading = submissions.filter(s => s.status === 'submitted' || s.status === 'late').length;
                
                return (
                  <div 
                    key={assignment.id} 
                    className="bg-card p-5 rounded-lg border border-border hover:shadow-md transition-all animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="mb-2 font-medium text-lg">{assignment.title}</h3>
                      <p className="text-muted-foreground mb-3" style={{ fontSize: '0.875rem' }}>
                        {assignment.description}
                      </p>
                      <div className="flex items-center gap-4" style={{ fontSize: '0.875rem' }}>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        </div>
                        <span className="text-muted-foreground">{assignment.points} points</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex gap-4" style={{ fontSize: '0.875rem' }}>
                      <span className="text-muted-foreground font-medium">
                        {submissions.length} Submitted
                      </span>
                      {needsGrading > 0 && (
                        <span className="text-[#ffc107] font-medium">
                          {needsGrading} Needs Grading
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingAssignment(assignment);
                          setFormData({
                            title: assignment.title,
                            description: assignment.description,
                            dueDate: assignment.dueDate,
                            points: assignment.points.toString()
                          });
                          setShowCreateModal(true);
                        }}
                        className="p-2 hover:bg-muted rounded-md transition-colors"
                      >
                        <Edit className="w-4 h-4 text-[#0056b3]" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ isOpen: true, assignmentId: assignment.id })}
                        className="p-2 hover:bg-muted rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                      <button
                        onClick={() => setSelectedAssignment(assignment.id)}
                        className="px-4 py-2 rounded-md text-white font-medium hover:brightness-110"
                        style={{ backgroundColor: '#0056b3' }}
                      >
                        Grade Submissions
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredAssignments.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        </>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">{editingAssignment ? 'Edit Assignment' : 'Create Assignment'}</h3>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <ValidatedInput
                label="Title"
                value={formData.title}
                onChange={(value) => setFormData({ ...formData, title: value })}
                validation={{ required: true, minLength: 3, maxLength: 100 }}
                placeholder="Essay Assignment"
              />
              
              <ValidatedInput
                label="Description"
                type="textarea"
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
                validation={{ required: true, minLength: 10 }}
                placeholder="Assignment instructions and requirements..."
                rows={3}
              />

              <ValidatedInput
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={(value) => setFormData({ ...formData, dueDate: value })}
                validation={{ required: true }}
              />

              <ValidatedInput
                label="Points"
                type="number"
                value={formData.points}
                onChange={(value) => setFormData({ ...formData, points: value })}
                validation={{ required: true, min: 1, max: 1000 }}
                placeholder="100"
              />
              
              <LoadingButton
                loading={isSaving}
                loadingText={editingAssignment ? 'Updating...' : 'Creating...'}
                onClick={async () => {
                  const validation = validateForm(formData, {
                    title: { required: true, minLength: 3 },
                    description: { required: true, minLength: 10 },
                    dueDate: { required: true },
                    points: { required: true, min: 1 }
                  });

                  if (!validation.isValid) {
                    toast.error('Please fill in all required fields');
                    return;
                  }

                  setIsSaving(true);
                  await new Promise(resolve => setTimeout(resolve, 800));

                  if (editingAssignment) {
                    setAssignments(assignments.map(a =>
                      a.id === editingAssignment.id
                        ? { ...a, title: formData.title, description: formData.description, dueDate: formData.dueDate, points: parseInt(formData.points) }
                        : a
                    ));
                    toast.success('Assignment updated successfully!');
                  } else {
                    const newAssignment = {
                      id: `asg-${Date.now()}`,
                      courseId,
                      title: formData.title,
                      description: formData.description,
                      dueDate: formData.dueDate,
                      points: parseInt(formData.points)
                    };
                    setAssignments([...assignments, newAssignment]);
                    toast.success('Assignment created successfully!');
                  }
                  
                  setIsSaving(false);
                  setShowCreateModal(false);
                  setFormData({ title: '', description: '', dueDate: '', points: '' });
                }}
                className="w-full px-4 py-2 rounded-md text-white hover:opacity-90 transition-opacity font-medium"
                style={{ backgroundColor: '#0056b3' }}
              >
                {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
              </LoadingButton>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, assignmentId: null })}
        onConfirm={() => {
          if (deleteConfirm.assignmentId) {
            setAssignments(assignments.filter(a => a.id !== deleteConfirm.assignmentId));
            toast.success('Assignment deleted successfully!');
          }
        }}
        title="Delete Assignment"
        message="Are you sure you want to delete this assignment? All student submissions will be lost."
      />
    </>
  );
}

function GradingInterface({ assignmentId, onBack }: { assignmentId: string; onBack: () => void }) {
  const assignment = mockAssignments.find(a => a.id === assignmentId);
  const submissions = mockSubmissions.filter(s => s.assignmentId === assignmentId);
  
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedData: paginatedSubmissions,
    setCurrentPage,
    setItemsPerPage
  } = usePagination({ data: submissions, initialItemsPerPage: 10 });

  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');

  if (!assignment) return null;

  const currentSubmission = submissions.find(s => s.id === selectedSubmission);

  const handleSaveGrade = () => {
    if (!currentSubmission) return;
    
    const gradeNum = parseInt(grade);
    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > assignment.points) {
      toast.error(`Grade must be between 0 and ${assignment.points}`);
      return;
    }

    currentSubmission.grade = gradeNum;
    currentSubmission.feedback = feedback;
    currentSubmission.status = 'graded';
    
    toast.success('Grade saved successfully!');
    
    const nextUngraded = submissions.find(s => 
      s.status !== 'graded' && s.id !== selectedSubmission
    );
    
    if (nextUngraded) {
      setSelectedSubmission(nextUngraded.id);
      setGrade('');
      setFeedback('');
    } else {
      setSelectedSubmission(null);
    }
  };

  if (selectedSubmission && currentSubmission) {
    return (
      <div className="min-h-screen bg-background">
        {/* THAY ĐỔI: Grading View Full Width */}
        <div className="w-full px-6 py-6">
          <div className="mb-6">
            <button
              onClick={() => setSelectedSubmission(null)}
              className="flex items-center gap-2 text-[#0056b3] hover:underline mb-4"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to Submissions
            </button>
          </div>

          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Document Viewer */}
              <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
                <h3 className="mb-4 font-medium text-lg">Submission Preview</h3>
                {currentSubmission.fileUrl && (
                  <div className="bg-muted p-8 rounded-lg text-center mb-4">
                    <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      File: {currentSubmission.fileUrl.split('/').pop()}
                    </p>
                    <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                      Document preview would be displayed here
                    </p>
                  </div>
                )}
                {currentSubmission.textContent && (
                  <div className="bg-muted p-6 rounded-lg">
                    <p>{currentSubmission.textContent}</p>
                  </div>
                )}
              </div>

              {/* Right: Grading Panel */}
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#e9f2ff] flex items-center justify-center">
                      <User className="w-5 h-5 text-[#0056b3]" />
                    </div>
                    <div>
                      <h4 className="font-medium">{currentSubmission.studentName}</h4>
                      <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                        Submitted: {new Date(currentSubmission.submittedAt!).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 font-medium">Score (out of {assignment.points})</label>
                    <input
                      type="number"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder={`0-${assignment.points}`}
                      min="0"
                      max={assignment.points}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium">Feedback / Comments</label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="w-full px-4 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      rows={6}
                      placeholder="Provide detailed feedback for the student..."
                    />
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={handleSaveGrade}
                      className="w-full px-4 py-2 rounded-md text-white font-medium"
                      style={{ backgroundColor: '#0056b3' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#004494'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                    >
                      Save & Next
                    </button>
                    <button
                      onClick={() => {
                        handleSaveGrade();
                        setSelectedSubmission(null);
                      }}
                      className="w-full px-4 py-2 rounded-md border border-border hover:bg-muted font-medium"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* THAY ĐỔI: Submission List Full Width */}
      <div className="w-full px-6 py-6">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#0056b3] hover:underline mb-4"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Assignments
          </button>
          <h2 className="text-xl font-semibold">Submissions for {assignment.title}</h2>
        </div>

        <div>
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Student Name</th>
                  <th className="px-6 py-3 text-left font-medium">Submission Date</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-left font-medium">Grade</th>
                  <th className="px-6 py-3 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSubmissions.map((submission) => {
                  const submittedDate = new Date(submission.submittedAt!);
                  const dueDate = new Date(assignment.dueDate);
                  const isLate = submittedDate > dueDate;

                  return (
                    <tr key={submission.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium">{submission.studentName}</td>
                      <td className="px-6 py-4">
                        {submittedDate.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {isLate && submission.status !== 'graded' && (
                          <span className="px-3 py-1 rounded-full text-white font-medium" style={{ fontSize: '0.75rem', backgroundColor: '#dc3545' }}>
                            Late
                          </span>
                        )}
                        {!isLate && submission.status !== 'graded' && (
                          <span className="px-3 py-1 rounded-full text-white font-medium" style={{ fontSize: '0.75rem', backgroundColor: '#28a745' }}>
                            On time
                          </span>
                        )}
                        {submission.status === 'graded' && (
                          <span className="px-3 py-1 rounded-full text-white font-medium" style={{ fontSize: '0.75rem', backgroundColor: '#0056b3' }}>
                            Graded
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {submission.grade !== undefined ? (
                          <span>{submission.grade}/{assignment.points}</span>
                        ) : (
                          <span className="text-muted-foreground">--</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedSubmission(submission.id);
                            setGrade(submission.grade?.toString() || '');
                            setFeedback(submission.feedback || '');
                          }}
                          className="px-4 py-1.5 rounded-md text-white font-medium hover:brightness-110"
                          style={{ backgroundColor: submission.status === 'graded' ? '#6c757d' : '#0056b3' }}
                        >
                          {submission.status === 'graded' ? 'Update Grade' : 'Grade'}
                        </button>
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
              totalItems={submissions.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}