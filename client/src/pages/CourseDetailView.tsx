import React, { useState } from 'react';
import FileUpload from './FileUpload';
import LoadingButton from './LoadingButton';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Upload, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Video,
  Link as LinkIcon,
  X
} from 'lucide-react';
import { Course, mockMaterials, mockAssignments, mockSubmissions } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { usePagination } from '@/hooks/usePagination';
import Pagination from '../components/PaginationWrapper';

interface CourseDetailViewProps {
  course: Course;
  onBack: () => void;
}

type TabType = 'overview' | 'materials' | 'assignments' | 'grades';

export default function CourseDetailView({ course, onBack }: CourseDetailViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('materials'); // Default to materials based on context, or keep overview

  return (
    <div className="min-h-screen bg-background">
      {/* THAY ĐỔI: Đã loại bỏ wrapper 'max-w-6xl mx-auto' bao quanh toàn bộ.
        Header giờ đây sẽ tự động tràn viền (full-width).
      */}
      
      {/* Header - Sticky added with z-50 - Full Width */}
      <div className="sticky top-0 z-50 bg-[#0056b3] text-white shadow-md w-full">
        <div className="px-6 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          
          <h2 className="mb-2 text-2xl font-bold">{course.name}</h2>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <div className="flex gap-6 border-b border-[#004494]">
            {(['overview', 'materials', 'assignments', 'grades'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 capitalize transition-colors font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-white'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content - Full Width */}
      <div className="px-6 py-8 bg-card w-full">
        {activeTab === 'overview' && <OverviewTab course={course} />}
        {activeTab === 'materials' && <MaterialsTab courseId={course.id} />}
        {activeTab === 'assignments' && <AssignmentsTab courseId={course.id} />}
        {activeTab === 'grades' && <GradesTab courseId={course.id} />}
      </div>
    </div>
  );
}

function OverviewTab({ course }: { course: Course }) {
  return (
    <div className="space-y-6 max-w-7xl"> {/* Có thể thêm max-w nếu muốn nội dung text không quá dài trên màn hình lớn */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="mb-4 text-xl font-semibold">Course Overview</h2>
        <p className="text-muted-foreground mb-6">{course.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-muted-foreground mb-1 font-medium">Instructor</p>
            <p>{course.teacherName}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1 font-medium">Schedule</p>
            <p>{course.schedule}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1 font-medium">Enrolled Students</p>
            <p>{course.enrolled}/{course.capacity}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MaterialsTab({ courseId }: { courseId: string }) {
  const materials = mockMaterials.filter(m => m.courseId === courseId);

  const {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedData: paginatedMaterials,
    setCurrentPage,
    setItemsPerPage
  } = usePagination({ data: materials, initialItemsPerPage: 10 }); // Tăng số lượng item hiển thị vì màn hình rộng hơn

  return (
    <div className="w-full">
      <h2 className="mb-6 text-xl font-semibold">Course Materials</h2>
      
      {materials.length === 0 ? (
        <div className="bg-card p-12 rounded-lg border border-border text-center">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No materials available yet</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedMaterials.map((material) => (
              <div key={material.id} className="bg-card p-5 rounded-lg border border-border flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#e9f2ff] flex items-center justify-center flex-shrink-0">
                    {material.type === 'pdf' && <FileText className="w-6 h-6 text-[#0056b3]" />}
                    {material.type === 'video' && <Video className="w-6 h-6 text-[#0056b3]" />}
                    {material.type === 'link' && <LinkIcon className="w-6 h-6 text-[#0056b3]" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">{material.title}</h4>
                    <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>{material.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => toast.info('Download/View functionality')}
                  className="flex items-center gap-2 px-4 py-2 rounded-md border border-[#0056b3] text-[#0056b3] hover:bg-[#e9f2ff] transition-colors whitespace-nowrap"
                >
                  {material.type === 'link' ? (
                    <>
                      <LinkIcon className="w-4 h-4" />
                      Open
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={materials.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        </>
      )}
    </div>
  );
}

function AssignmentsTab({ courseId }: { courseId: string }) {
  const { user } = useAuth();
  const assignments = mockAssignments.filter(a => a.courseId === courseId);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'overdue' | 'completed'>('all');

  const now = new Date();

  const getAssignmentStatus = (assignmentId: string, dueDate: string) => {
    const due = new Date(dueDate);
    const submission = mockSubmissions.find(s => 
      s.studentId === user?.id && s.assignmentId === assignmentId
    );
    
    if (submission?.status === 'graded') return 'graded';
    if (submission?.status === 'submitted') return 'submitted';
    if (due < now) return 'overdue';
    return 'not_submitted';
  };

  const filteredAssignments = assignments.filter(assignment => {
    const status = getAssignmentStatus(assignment.id, assignment.dueDate);
    const due = new Date(assignment.dueDate);

    if (filter === 'all') return true;
    if (filter === 'upcoming') return status === 'not_submitted' && due > now;
    if (filter === 'overdue') return status === 'overdue';
    if (filter === 'completed') return status === 'submitted' || status === 'graded';
    return true;
  });

  const {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedData: paginatedAssignments,
    setCurrentPage,
    setItemsPerPage
  } = usePagination({ data: filteredAssignments, initialItemsPerPage: 10 });

  if (selectedAssignment) {
    const assignment = assignments.find(a => a.id === selectedAssignment);
    if (assignment) {
      return <AssignmentSubmission assignment={assignment} onBack={() => setSelectedAssignment(null)} />;
    }
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Assignments</h2>
        <div className="flex gap-2">
          {(['all', 'upcoming', 'overdue', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-md capitalize transition-colors text-sm font-medium ${
                filter === f
                  ? 'bg-[#0056b3] text-white'
                  : 'bg-card border border-border hover:bg-muted'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filteredAssignments.length === 0 ? (
        <div className="bg-card p-12 rounded-lg border border-border text-center">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No assignments found</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedAssignments.map((assignment) => {
              const dueDate = new Date(assignment.dueDate);
              const isOverdue = dueDate < now;
              const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
              const status = getAssignmentStatus(assignment.id, assignment.dueDate);
              
              return (
                <div key={assignment.id} className="bg-card p-5 rounded-lg border border-border hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="mb-2 font-medium text-lg">{assignment.title}</h3>
                      <p className="text-muted-foreground mb-3" style={{ fontSize: '0.875rem' }}>
                        {assignment.description}
                      </p>
                    </div>
                    <div className="ml-4">
                      {status === 'graded' && (
                        <span className="px-3 py-1 rounded-full text-white font-medium" style={{ fontSize: '0.75rem', backgroundColor: '#0056b3' }}>
                          Graded
                        </span>
                      )}
                      {status === 'submitted' && (
                        <span className="px-3 py-1 rounded-full text-white font-medium" style={{ fontSize: '0.75rem', backgroundColor: '#28a745' }}>
                          Submitted
                        </span>
                      )}
                      {status === 'not_submitted' && (
                        <span className="px-3 py-1 rounded-full text-muted-foreground font-medium" style={{ fontSize: '0.75rem', backgroundColor: '#e9ecef' }}>
                          Not Submitted
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4" style={{ fontSize: '0.875rem' }}>
                      <div className={`flex items-center gap-2 ${isOverdue || hoursUntilDue < 24 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        <Calendar className="w-4 h-4" />
                        <span>
                          Due: {dueDate.toLocaleDateString()} - {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>{assignment.points} points</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setSelectedAssignment(assignment.id)}
                      className="px-4 py-2 rounded-md text-white font-medium hover:brightness-110 transition-all"
                      style={{ backgroundColor: '#0056b3' }}
                    >
                      View Assignment
                    </button>
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
  );
}

function AssignmentSubmission({ assignment, onBack }: { assignment: any; onBack: () => void }) {
  const { user } = useAuth();
  const [submissionMode, setSubmissionMode] = useState<'upload' | 'text'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const existingSubmission = mockSubmissions.find(s => 
    s.assignmentId === assignment.id && s.studentId === user?.id
  );

  const dueDate = new Date(assignment.dueDate);
  const now = new Date();
  const isOverdue = dueDate < now;
  const canSubmit = !isOverdue || existingSubmission?.status !== 'graded';

  const handleSubmit = async () => {
    if (!file && !textContent) {
      toast.error('Please upload a file or enter text');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (existingSubmission) {
      toast.success('Submission updated successfully!');
    } else {
      mockSubmissions.push({
        id: String(mockSubmissions.length + 1),
        assignmentId: assignment.id,
        studentId: user?.id || '',
        studentName: user?.name || '',
        submittedAt: new Date().toISOString(),
        fileUrl: file ? `/submissions/${file.name}` : undefined,
        textContent: textContent || undefined,
        status: isOverdue ? 'late' : 'submitted',
      });
      toast.success('Assignment submitted successfully!');
    }
    
    setIsSubmitting(false);
    onBack();
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-6 text-[#0056b3] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Assignments
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="mb-4 text-xl font-semibold">{assignment.title}</h2>
          
          <div className="mb-6">
            <div className={`flex items-center gap-2 mb-2 ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
              <Calendar className="w-4 h-4" />
              <span>Due: {dueDate.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>{assignment.points} points</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-2 font-medium">Instructions</h3>
            <p className="text-muted-foreground">{assignment.description}</p>
          </div>

          {existingSubmission && (
            <div className="p-4 rounded-lg bg-[#d4edda] border border-[#28a745] mb-4">
              <div className="flex items-center gap-2 text-[#28a745] mb-2">
                <CheckCircle className="w-5 h-5" />
                <span>Submitted on {new Date(existingSubmission.submittedAt!).toLocaleString()}</span>
              </div>
              {existingSubmission.fileUrl && (
                <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                  File: {existingSubmission.fileUrl.split('/').pop()}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="mb-4 font-medium">
            {existingSubmission && canSubmit ? 'Edit Submission' : 'Submit Assignment'}
          </h3>

          {isOverdue && !existingSubmission && (
            <div className="p-4 rounded-lg bg-[#f8d7da] border border-[#dc3545] mb-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-5 h-5" />
                <span>This assignment is overdue. Late submissions may be penalized.</span>
              </div>
            </div>
          )}

          <div className="flex gap-4 mb-4 border-b border-border">
            <button
              onClick={() => setSubmissionMode('upload')}
              className={`px-4 py-2 font-medium ${
                submissionMode === 'upload'
                  ? 'border-b-2 border-[#0056b3] text-[#0056b3]'
                  : 'text-muted-foreground'
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setSubmissionMode('text')}
              className={`px-4 py-2 font-medium ${
                submissionMode === 'text'
                  ? 'border-b-2 border-[#0056b3] text-[#0056b3]'
                  : 'text-muted-foreground'
              }`}
            >
              Text Entry
            </button>
          </div>

          {submissionMode === 'upload' ? (
            <div className="mb-4">
              <FileUpload
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                maxSize={50}
                multiple={false}
                onFilesSelected={(files) => {
                  if (files[0]) {
                    setFile(files[0]);
                  }
                }}
              />
            </div>
          ) : (
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring mb-4"
              rows={10}
              placeholder="Type your submission here..."
            />
          )}

          <textarea
            className="w-full px-4 py-3 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring mb-4"
            rows={3}
            placeholder="Add comments for teacher..."
          />

          <div className="flex gap-3">
            <LoadingButton
              loading={isSubmitting}
              loadingText="Submitting..."
              onClick={handleSubmit}
              disabled={!canSubmit || (!file && !textContent)}
              className="flex-1 px-4 py-2.5 rounded-md text-[#212529] font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: (!file && !textContent) ? '#e9ecef' : '#ffc107' }}
            >
              {existingSubmission ? 'Update Submission' : 'Submit Assignment'}
            </LoadingButton>
            <button
              onClick={onBack}
              className="px-4 py-2.5 rounded-md border border-border hover:bg-muted font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GradesTab({ courseId }: { courseId: string }) {
  const { user } = useAuth();
  const assignments = mockAssignments.filter(a => a.courseId === courseId);
  const submissions = mockSubmissions.filter(s => s.studentId === user?.id);

  return (
    <div className="w-full">
      <h2 className="mb-6 text-xl font-semibold">Grades</h2>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Assignment Name</th>
              <th className="px-6 py-3 text-left font-medium">Status</th>
              <th className="px-6 py-3 text-left font-medium">Score</th>
              <th className="px-6 py-3 text-left font-medium">Teacher Comment</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => {
              const submission = submissions.find(s => s.assignmentId === assignment.id);
              
              return (
                <tr key={assignment.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{assignment.title}</td>
                  <td className="px-6 py-4">
                    {submission?.status === 'graded' && (
                      <span className="px-3 py-1 rounded-full text-white font-medium" style={{ fontSize: '0.75rem', backgroundColor: '#0056b3' }}>
                        Graded
                      </span>
                    )}
                    {submission?.status === 'submitted' && (
                      <span className="px-3 py-1 rounded-full text-white font-medium" style={{ fontSize: '0.75rem', backgroundColor: '#ffc107' }}>
                        Pending
                      </span>
                    )}
                    {!submission && (
                      <span className="px-3 py-1 rounded-full text-muted-foreground font-medium" style={{ fontSize: '0.75rem', backgroundColor: '#e9ecef' }}>
                        No Attempt
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {submission?.grade !== undefined ? (
                      <span>{submission.grade}/{assignment.points}</span>
                    ) : (
                      <span className="text-muted-foreground">--</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {submission?.feedback || <span className="text-muted-foreground">--</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}