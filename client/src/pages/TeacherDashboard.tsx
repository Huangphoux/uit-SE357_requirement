import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ConfirmDialog } from "../components/ConfirmDialog";
import DarkModeToggle from "./DarkModeToggle";
import EmptyState from "../components/EmptyState";
import LoadingButton from "./LoadingButton";
import ValidatedInput from "./ValidatedInput";
import FileUpload from "./FileUpload";
import Pagination from "../components/PaginationWrapper";
import { usePagination } from "../hooks/usePagination";
import { validateForm } from "../utils/validation";
import classService from "../service/class";
import courseService from "../service/course";
import materialService from "../service/material";
import assignmentService from "../service/assignment";
import submissionService from "../service/submission";
import {
  GraduationCap,
  LogOut,
  Plus,
  Edit,
  Trash2,
  X,
  FileText,
  Calendar,
  ChevronRight,
  User,
  Bell,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { mockMaterials, mockAssignments, mockSubmissions } from "../data/mockData";
import NotificationManagement from "./NotificationManagement";
import SearchBar from "@/components/SearchBar";

export default function TeacherDashboard() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const { logout, user } = useAuth();

  const PLACEHOLDER_IMAGES = [
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=400&h=250&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=400&h=250&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400&h=250&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=400&h=250&fit=crop&auto=format",
  ];

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch classes
        const classData = await classService.listClass();
        const userClasses = Array.isArray(classData.data.classes)
          ? classData.data.classes.filter((cls: any) => cls.teacherId === user?.id)
          : [];
        setClasses(userClasses);

        // Fetch courses
        const courseData = await courseService.listCourse();
        setCourses(Array.isArray(courseData.data.courses) ? courseData.data.courses : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data");
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

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
                <p className="opacity-90" style={{ fontSize: "0.875rem" }}>
                  {user?.name}
                </p>
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

  if (selectedClass) {
    const classData = classes.find((c) => c.id === selectedClass);
    if (!classData) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Class not found</p>
        </div>
      );
    }

    return (
      <TeacherCourseDetail
        classData={classData}
        courses={courses}
        onBack={() => setSelectedClass(null)}
      />
    );
  }

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
              <p className="opacity-90" style={{ fontSize: "0.875rem" }}>
                {user?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DarkModeToggle />
            <button
              onClick={() => {
                logout();
                toast.success("Logged out successfully");
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-[#004494] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">My Classes</h1>
          <button
            onClick={() => setShowNotifications(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium"
            style={{ backgroundColor: "#0056b3" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#004494")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
          >
            <Bell className="w-4 h-4" />
            Send Notifications
          </button>
        </div>

        {classes.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No classes assigned yet"
            description="You haven't been assigned to any classes. Contact your administrator for more information."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls, index) => {
              const fallbackImageUrl = PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];

              // Tìm course info từ courses array
              const courseInfo = courses.find((c) => c.id === cls.courseId);

              return (
                <div
                  key={cls.id}
                  onClick={() => setSelectedClass(cls.id)}
                  className="bg-card rounded-lg border border-border shadow-sm overflow-hidden hover:shadow-md transition-all transform hover:-translate-y-1 cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className="h-40 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${cls.imageUrl || fallbackImageUrl})`,
                    }}
                  />
                  <div className="p-5">
                    <h3 className="mb-2 font-semibold text-lg">{cls.title}</h3>
                    {courseInfo && (
                      <>
                        <p className="text-muted-foreground mb-1" style={{ fontSize: "0.875rem" }}>
                          Course: {courseInfo.title}
                        </p>
                        <p className="text-muted-foreground mb-4" style={{ fontSize: "0.875rem" }}>
                          {courseInfo.description}
                        </p>
                      </>
                    )}
                    <p className="text-muted-foreground mb-4" style={{ fontSize: "0.875rem" }}>
                      {cls.enrollments?.length || 0} students enrolled
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
                        {cls.schedule || ""}
                      </span>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function TeacherCourseDetail({
  classData,
  courses,
  onBack,
}: {
  classData: any;
  courses: any[];
  onBack: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"materials" | "assignments">("materials");
  const [resetKey, setResetKey] = useState(0);
  const course = courses.find((c) => c.id === classData.courseId);

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 bg-[#0056b3] text-white shadow-md w-full">
        <div className="px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity mb-4"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            <span>Back to My Classes</span>
          </button>
          <h2 className="mb-2 text-2xl font-bold">{course.title}</h2>
          <p className="text-white/80 text-sm">
            {classData.title} • {course.description}
          </p>
        </div>
      </div>

      <div className="px-6 bg-white/10 border-b border-white/20 flex items-center pt-4">
        <div className="flex gap-4 ">
          <button
            onClick={() => setActiveTab("materials")}
            className={`px-4 py-3 transition-colors font-medium ${
              activeTab === "materials"
                ? "border-b-2 border-[#0056b3]"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            Materials
          </button>
          <button
            onClick={() => {
              setActiveTab("assignments");
              setResetKey((prev) => prev + 1);
            }}
            className={`px-4 py-3 transition-colors font-medium ${
              activeTab === "assignments"
                ? "border-b-2 border-white"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            Assignments
          </button>
        </div>
      </div>

      <div className="w-full px-6 py-8 bg-card">
        {activeTab === "materials" && (
          <MaterialsManagement courseId={course.id} classId={classData.id} />
        )}
        {activeTab === "assignments" && (
          <AssignmentsManagement key={resetKey} courseId={course.id} classId={classData.id} />
        )}
      </div>
    </div>
  );
}

function MaterialsManagement({ courseId, classId }: { courseId: string; classId: string }) {
  const [showModal, setShowModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<any | null>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "PDF" as "PDF" | "VIDEO" | "LINK" | "DOC",
    url: "",
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    materialId: string | null;
  }>({
    isOpen: false,
    materialId: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch materials khi component mount
  React.useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setIsLoading(true);
        const response = await materialService.listMaterial(classId);
        setMaterials(Array.isArray(response.data.materials) ? response.data.materials : []);
      } catch (error) {
        console.error("Error fetching materials:", error);
        toast.error("Failed to load materials");
        setMaterials([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (classId) {
      fetchMaterials();
    }
  }, [classId]);

  const filteredMaterials = materials.filter(
    (material) =>
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedData: paginatedMaterials,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination({ data: filteredMaterials, initialItemsPerPage: 10 });

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Course Materials</h2>
        <button
          onClick={() => {
            setEditingMaterial(null);
            setFormData({ title: "", description: "", type: "PDF", url: "" });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-[#212529] hover:opacity-90 transition-opacity font-medium"
          style={{ backgroundColor: "#ffc107" }}
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

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0056b3]"></div>
        </div>
      ) : filteredMaterials.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No materials found"
          description={
            searchQuery
              ? "Try adjusting your search query"
              : "Add your first material to share with students"
          }
          action={
            !searchQuery
              ? {
                  label: "Add Material",
                  onClick: () => {
                    setEditingMaterial(null);
                    setFormData({ title: "", description: "", type: "PDF", url: "" });
                    setShowModal(true);
                  },
                }
              : undefined
          }
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
                    <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
                      {material.description || "No description"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-1 rounded bg-[#e9f2ff] text-[#0056b3]">
                        {material.type}
                      </span>
                      {material.url && (
                        <a
                          href={material.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#0056b3] hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Resource
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingMaterial(material);
                      setFormData({
                        title: material.title,
                        description: material.description || "",
                        type: material.type,
                        url: material.url,
                      });
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
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50 animate-fade-in-up"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="bg-card rounded-lg p-6 w-full max-w-md animate-slide-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">
                {editingMaterial ? "Edit Material" : "Add Material"}
              </h3>
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
                validation={{ minLength: 10 }}
                placeholder="Brief description of the material..."
                rows={3}
              />

              <div>
                <label className="block mb-2 font-medium text-sm">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="PDF">PDF</option>
                  <option value="VIDEO">VIDEO</option>
                  <option value="LINK">LINK</option>
                  <option value="DOC">DOC</option>
                </select>
              </div>

              <ValidatedInput
                label="URL"
                type="url"
                value={formData.url}
                onChange={(value) => setFormData({ ...formData, url: value })}
                validation={{ required: true }}
                placeholder="https://example.com/resource"
              />

              <LoadingButton
                loading={isSaving}
                loadingText={editingMaterial ? "Updating..." : "Adding..."}
                onClick={async () => {
                  // Validate từng field riêng
                  if (!formData.title.trim()) {
                    toast.error("Title is required");
                    return;
                  }

                  if (formData.title.trim().length < 3) {
                    toast.error("Title must be at least 3 characters");
                    return;
                  }

                  if (!formData.url.trim()) {
                    toast.error("URL is required");
                    return;
                  }

                  const validation = validateForm(formData, {
                    title: { required: true, minLength: 3 },
                    url: { required: true },
                  });

                  if (!validation.isValid) {
                    toast.error("Please fill in all required fields");
                    return;
                  }

                  // Validate URL format
                  try {
                    new URL(formData.url);
                  } catch {
                    toast.error("Please enter a valid URL");
                    return;
                  }

                  setIsSaving(true);

                  try {
                    if (editingMaterial) {
                      const response = await materialService.updateMaterial(editingMaterial.id, {
                        title: formData.title,
                        description: formData.description || undefined,
                        type: formData.type,
                        url: formData.url,
                      });

                      // Update local state
                      setMaterials(
                        materials.map((m) =>
                          m.id === editingMaterial.id ? response.data.material : m
                        )
                      );
                      toast.success("Material updated successfully!");
                    } else {
                      const response = await materialService.createMaterial({
                        title: formData.title,
                        description: formData.description || undefined,
                        type: formData.type,
                        url: formData.url,
                        classId,
                      });

                      // Add to local state
                      setMaterials([...materials, response.data.material]);
                      toast.success("Material added successfully!");
                    }

                    setShowModal(false);
                    setFormData({ title: "", description: "", type: "PDF", url: "" });
                  } catch (error: any) {
                    console.error("Error saving material:", error);
                    toast.error(error.response?.data?.message || "Failed to save material");
                  } finally {
                    setIsSaving(false);
                  }
                }}
                className="w-full px-4 py-2 rounded-md text-white hover:opacity-90 transition-opacity font-medium"
                style={{ backgroundColor: "#0056b3" }}
              >
                {editingMaterial ? "Update Material" : "Add Material"}
              </LoadingButton>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, materialId: null })}
        onConfirm={async () => {
          if (deleteConfirm.materialId) {
            try {
              await materialService.deleteMaterial(deleteConfirm.materialId);
              setMaterials(materials.filter((m) => m.id !== deleteConfirm.materialId));
              toast.success("Material deleted successfully!");
            } catch (error: any) {
              console.error("Error deleting material:", error);
              toast.error(error.response?.data?.message || "Failed to delete material");
            } finally {
              setDeleteConfirm({ isOpen: false, materialId: null });
            }
          }
        }}
        title="Delete Material"
        message="Are you sure you want to delete this material? This action cannot be undone."
      />
    </div>
  );
}

function AssignmentsManagement({ courseId, classId }: { courseId: string; classId: string }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<any | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    maxScore: "",
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    assignmentId: string | null;
  }>({
    isOpen: false,
    assignmentId: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch assignments khi component mount
  React.useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setIsLoading(true);
        const response = await assignmentService.listAssignment(classId);
        setAssignments(Array.isArray(response.data.assignments) ? response.data.assignments : []);
      } catch (error) {
        console.error("Error fetching assignments:", error);
        toast.error("Failed to load assignments");
        setAssignments([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (classId) {
      fetchAssignments();
    }
  }, [classId]);

  const filteredAssignments = assignments
    .filter(
      (assignment) =>
        assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()); // Thêm dòng này

  const {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedData: paginatedAssignments,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination({ data: filteredAssignments, initialItemsPerPage: 10 });

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
              setFormData({ title: "", description: "", dueDate: "", maxScore: "" });
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-[#212529] hover:opacity-90 transition-opacity font-medium"
            style={{ backgroundColor: "#ffc107" }}
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

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0056b3]"></div>
          </div>
        ) : filteredAssignments.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No assignments found"
            description={
              searchQuery
                ? "Try adjusting your search query"
                : "Create your first assignment for students"
            }
            action={
              !searchQuery
                ? {
                    label: "Create Assignment",
                    onClick: () => {
                      setEditingAssignment(null);
                      setFormData({ title: "", description: "", dueDate: "", maxScore: "" });
                      setShowCreateModal(true);
                    },
                  }
                : undefined
            }
          />
        ) : (
          <>
            <div className="space-y-4">
              {paginatedAssignments.map((assignment, index) => {
                const submissions = assignment.submissions || [];
                const needsGrading = submissions.filter(
                  (s: any) => s.status === "SUBMITTED" // API trả về "SUBMITTED", không phải "submitted"
                ).length;

                return (
                  <div
                    key={assignment.id}
                    className="bg-card p-5 rounded-lg border border-border hover:shadow-md transition-all animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="mb-2 font-medium text-lg">{assignment.title}</h3>
                        <p className="text-muted-foreground mb-3" style={{ fontSize: "0.875rem" }}>
                          {assignment.description}
                        </p>
                        <div className="flex items-center gap-4" style={{ fontSize: "0.875rem" }}>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                          </div>
                          <span className="text-muted-foreground">
                            {assignment.maxScore ? `${assignment.maxScore} points` : "No max score"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex gap-4" style={{ fontSize: "0.875rem" }}>
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
                              description: assignment.description || "",
                              dueDate: assignment.dueDate
                                ? new Date(assignment.dueDate).toISOString().split("T")[0]
                                : "",
                              maxScore: assignment.maxScore?.toString() || "",
                            });
                            setShowCreateModal(true);
                          }}
                          className="p-2 hover:bg-muted rounded-md transition-colors"
                        >
                          <Edit className="w-4 h-4 text-[#0056b3]" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirm({ isOpen: true, assignmentId: assignment.id })
                          }
                          className="p-2 hover:bg-muted rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                        <button
                          onClick={() => setSelectedAssignment(assignment.id)}
                          className="px-4 py-2 rounded-md text-white font-medium hover:brightness-110"
                          style={{ backgroundColor: "#0056b3" }}
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
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">
                {editingAssignment ? "Edit Assignment" : "Create Assignment"}
              </h3>
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
                validation={{ minLength: 10 }}
                placeholder="Assignment instructions and requirements..."
                rows={3}
              />

              <ValidatedInput
                label="Due Date"
                type="datetime-local"
                value={formData.dueDate}
                onChange={(value) => setFormData({ ...formData, dueDate: value })}
                validation={{ required: true }}
              />

              <ValidatedInput
                label="Max Score (Optional)"
                type="number"
                value={formData.maxScore}
                onChange={(value) => setFormData({ ...formData, maxScore: value })}
                validation={{ min: 1, max: 1000 }}
                placeholder="100"
              />

              <LoadingButton
                loading={isSaving}
                loadingText={editingAssignment ? "Updating..." : "Creating..."}
                onClick={async () => {
                  // Validate từng field riêng
                  if (!formData.title.trim()) {
                    toast.error("Title is required");
                    return;
                  }

                  if (formData.title.trim().length < 3) {
                    toast.error("Title must be at least 3 characters");
                    return;
                  }

                  if (!formData.dueDate.trim()) {
                    toast.error("Due date is required");
                    return;
                  }

                  const validation = validateForm(formData, {
                    title: { required: true, minLength: 3 },
                    dueDate: { required: true },
                  });

                  if (!validation.isValid) {
                    toast.error("Please fill in all required fields");
                    return;
                  }

                  setIsSaving(true);

                  try {
                    // Convert date to ISO string
                    const dueDateISO = new Date(formData.dueDate).toISOString();

                    if (editingAssignment) {
                      const updateData: any = {
                        title: formData.title,
                        dueDate: dueDateISO,
                      };

                      if (formData.description) {
                        updateData.description = formData.description;
                      }

                      if (formData.maxScore) {
                        updateData.maxScore = parseInt(formData.maxScore);
                      }

                      const response = await assignmentService.updateAssignment(
                        editingAssignment.id,
                        updateData
                      );

                      setAssignments(
                        assignments.map((a) =>
                          a.id === editingAssignment.id ? response.data.assignment : a
                        )
                      );
                      toast.success("Assignment updated successfully!");
                    } else {
                      const createData: any = {
                        title: formData.title,
                        classId,
                        dueDate: dueDateISO,
                      };

                      if (formData.description) {
                        createData.description = formData.description;
                      }

                      if (formData.maxScore) {
                        createData.maxScore = parseInt(formData.maxScore);
                      }

                      const response = await assignmentService.createAssignment(createData);
                      setAssignments([...assignments, response.data.assignment]);
                      toast.success("Assignment created successfully!");
                    }

                    setShowCreateModal(false);
                    setFormData({ title: "", description: "", dueDate: "", maxScore: "" });
                  } catch (error: any) {
                    console.error("Error saving assignment:", error);
                    toast.error(error.response?.data?.message || "Failed to save assignment");
                  } finally {
                    setIsSaving(false);
                  }
                }}
                className="w-full px-4 py-2 rounded-md text-white hover:opacity-90 transition-opacity font-medium"
                style={{ backgroundColor: "#0056b3" }}
              >
                {editingAssignment ? "Update Assignment" : "Create Assignment"}
              </LoadingButton>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, assignmentId: null })}
        onConfirm={async () => {
          if (deleteConfirm.assignmentId) {
            try {
              await assignmentService.deleteAssignment(deleteConfirm.assignmentId);
              setAssignments(assignments.filter((a) => a.id !== deleteConfirm.assignmentId));
              toast.success("Assignment deleted successfully!");
            } catch (error: any) {
              console.error("Error deleting assignment:", error);
              toast.error(error.response?.data?.message || "Failed to delete assignment");
            } finally {
              setDeleteConfirm({ isOpen: false, assignmentId: null });
            }
          }
        }}
        title="Delete Assignment"
        message="Are you sure you want to delete this assignment? All student submissions will be lost."
      />
    </>
  );
}

function GradingInterface({ assignmentId, onBack }: { assignmentId: string; onBack: () => void }) {
  const [assignment, setAssignment] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch submissions (assignment data is nested inside)
  React.useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true);

        const submissionsResponse =
          await submissionService.getSubmissionsByAssignment(assignmentId);
        const submissionsData = Array.isArray(submissionsResponse.data.submissions)
          ? submissionsResponse.data.submissions
          : [];

        setSubmissions(submissionsData);

        // Extract assignment from first submission
        if (submissionsData.length > 0 && submissionsData[0].assignment) {
          setAssignment(submissionsData[0].assignment);
        } else {
          // If no submissions, fetch assignment separately (optional)
          toast.info("No submissions yet for this assignment");
        }
      } catch (error) {
        console.error("Error fetching submissions:", error);
        toast.error("Failed to load submissions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [assignmentId]);

  const {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedData: paginatedSubmissions,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination({ data: submissions, initialItemsPerPage: 10 });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0056b3]"></div>
      </div>
    );
  }

  const currentSubmission = submissions.find((s) => s.id === selectedSubmission);

  const handleSaveGrade = async () => {
    if (!currentSubmission) return;

    // Validate grade field
    if (!grade.trim()) {
      toast.error("Score is required");
      return;
    }

    const gradeNum = parseInt(grade);
    const maxScore = currentSubmission.assignment?.maxScore || 100;

    if (isNaN(gradeNum)) {
      toast.error("Score must be a valid number");
      return;
    }

    if (gradeNum < 0 || gradeNum > maxScore) {
      toast.error(`Score must be between 0 and ${maxScore}`);
      return;
    }

    setIsSaving(true);

    try {
      await submissionService.gradeSubmission(currentSubmission.id, {
        grade: gradeNum,
        feedback: feedback || undefined,
      });

      // Update local state
      setSubmissions(
        submissions.map((s) =>
          s.id === currentSubmission.id
            ? {
                ...s,
                feedback: [
                  {
                    score: gradeNum,
                    comment: feedback || "",
                    createdAt: new Date().toISOString(),
                  },
                ],
              }
            : s
        )
      );

      toast.success("Grade saved successfully!");

      // Find next ungraded submission
      const nextUngraded = submissions.find((s) => {
        const hasGrade =
          s.feedback &&
          s.feedback.length > 0 &&
          s.feedback[0].score !== null &&
          s.feedback[0].score !== undefined;
        return !hasGrade && s.id !== selectedSubmission;
      });

      if (nextUngraded) {
        setSelectedSubmission(nextUngraded.id);
        setGrade("");
        setFeedback("");
      } else {
        setSelectedSubmission(null);
      }
    } catch (error: any) {
      console.error("Error saving grade:", error);
      toast.error(error.response?.data?.message || "Failed to save grade");
    } finally {
      setIsSaving(false);
    }
  };

  if (selectedSubmission && currentSubmission) {
    return (
      <div className="min-h-screen bg-background">
        <div className="w-full px-4 py-4">
          <div className="mb-6">
            <button
              onClick={() => setSelectedSubmission(null)}
              className="flex items-center gap-2 text-[#0056b3] hover:underline mb-4"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to Submissions
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
              <h3 className="mb-4 font-medium text-lg">Submission Preview</h3>

              {currentSubmission.fileUrl && (
                <div className="bg-muted p-8 rounded-lg text-center mb-4">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    File: {currentSubmission.fileUrl.split("/").pop()}
                  </p>
                  <a
                    href={currentSubmission.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0056b3] hover:underline"
                  >
                    View File
                  </a>
                </div>
              )}

              {currentSubmission.content && (
                <div className="bg-muted p-6 rounded-lg">
                  <h4 className="font-medium mb-2">Submission Content:</h4>
                  <p className="whitespace-pre-wrap">{currentSubmission.content}</p>
                </div>
              )}

              {!currentSubmission.fileUrl && !currentSubmission.content && (
                <div className="bg-muted p-8 rounded-lg text-center">
                  <p className="text-muted-foreground">No submission content available</p>
                </div>
              )}
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#e9f2ff] flex items-center justify-center">
                    <User className="w-5 h-5 text-[#0056b3]" />
                  </div>
                  <div>
                    <h4 className="font-medium">{currentSubmission.user?.name || "Student"}</h4>
                    <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>
                      Submitted:{" "}
                      {new Date(
                        currentSubmission.submittedAt || currentSubmission.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium">
                    Score (out of {currentSubmission.assignment?.maxScore || 100})
                  </label>
                  <input
                    type="number"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-4 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder={`0-${currentSubmission.assignment?.maxScore || 100}`}
                    min="0"
                    max={currentSubmission.assignment?.maxScore || 100}
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
                  <LoadingButton
                    loading={isSaving}
                    loadingText="Saving..."
                    onClick={handleSaveGrade}
                    className="w-full px-4 py-2 rounded-md text-white font-medium"
                    style={{ backgroundColor: "#0056b3" }}
                  >
                    Save & Next
                  </LoadingButton>

                  <button
                    onClick={async () => {
                      await handleSaveGrade();
                      if (!isSaving) {
                        setSelectedSubmission(null);
                      }
                    }}
                    disabled={isSaving}
                    className="w-full px-4 py-2 rounded-md border border-border hover:bg-muted font-medium disabled:opacity-50"
                  >
                    Save & Close
                  </button>
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
      <div className="w-full px-4 py-4">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#0056b3] hover:underline mb-4"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Assignments
          </button>
          <h2 className="text-xl font-semibold">
            Submissions for {assignment?.title || "Assignment"}
          </h2>
        </div>

        {submissions.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No submissions yet"
            description="Students haven't submitted their work for this assignment yet."
          />
        ) : (
          <>
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
                    const submittedDate = new Date(submission.submittedAt || submission.createdAt);
                    const dueDate = submission.assignment?.dueDate
                      ? new Date(submission.assignment.dueDate)
                      : null;
                    const isLate = dueDate ? submittedDate > dueDate : false;

                    // Check feedback array for grade
                    const feedbackGrade =
                      submission.feedback && submission.feedback.length > 0
                        ? submission.feedback[0].score
                        : null;
                    const isGraded = feedbackGrade !== null && feedbackGrade !== undefined;

                    return (
                      <tr
                        key={submission.id}
                        className="border-t border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium">
                          {submission.user?.name || "Unknown Student"}
                        </td>
                        <td className="px-6 py-4">{submittedDate.toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          {isLate && !isGraded && (
                            <span
                              className="px-3 py-1 rounded-full text-white font-medium"
                              style={{ fontSize: "0.75rem", backgroundColor: "#dc3545" }}
                            >
                              Late
                            </span>
                          )}
                          {!isLate && !isGraded && (
                            <span
                              className="px-3 py-1 rounded-full text-white font-medium"
                              style={{ fontSize: "0.75rem", backgroundColor: "#28a745" }}
                            >
                              On time
                            </span>
                          )}
                          {isGraded && (
                            <span
                              className="px-3 py-1 rounded-full text-white font-medium"
                              style={{ fontSize: "0.75rem", backgroundColor: "#0056b3" }}
                            >
                              Graded
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {isGraded ? (
                            <span>
                              {feedbackGrade}/{submission.assignment?.maxScore || 100}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">--</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedSubmission(submission.id);
                              setGrade(feedbackGrade?.toString() || "");
                              setFeedback(
                                submission.feedback && submission.feedback.length > 0
                                  ? submission.feedback[0].comment || ""
                                  : ""
                              );
                            }}
                            className="px-4 py-1.5 rounded-md text-white font-medium hover:brightness-110"
                            style={{
                              backgroundColor: isGraded ? "#6c757d" : "#0056b3",
                            }}
                          >
                            {isGraded ? "Update Grade" : "Grade"}
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
          </>
        )}
      </div>
    </div>
  );
}
