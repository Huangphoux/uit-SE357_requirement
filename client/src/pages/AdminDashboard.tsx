import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ConfirmDialog } from "../components/ConfirmDialog";
import DarkModeToggle from "@/pages/DarkModeToggle";
import SearchBar from "../components/SearchBar";
import EmptyState from "../components/EmptyState";
import StatsCard from "../components/StatsCard";
import LoadingButton from "@/pages/LoadingButton";
import ValidatedInput from "@/pages/ValidatedInput";
import FileUpload from "@/pages/FileUpload";
import Pagination from "@/components/PaginationWrapper";
import InlineEdit from "../components/InlineEdit";
import { usePagination } from "@/hooks/usePagination";
import { validateForm, commonRules } from "@/utils/validation";
import courseService from "@/service/course";
import classService from "@/service/class";
import userService from "@/service/user";
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
  TrendingUp,
  AsteriskSquare, // Đã thêm icon này
} from "lucide-react";
import { toast } from "sonner";
import { mockCourses, mockClasses, Course, Class } from "@/data/mockData";
import NotificationManagement from "@/pages/NotificationManagement";
import { title } from "process";

type MenuItem = "dashboard" | "courses" | "classes" | "enrollments" | "users";

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState<MenuItem>("dashboard");
  const { logout, user } = useAuth();

  // Handler để Quick Actions có thể điều hướng
  const handleQuickAction = (action: "create-course" | "create-class" | "manage-users") => {
    switch (action) {
      case "create-course":
        setActiveMenu("courses");
        // Trigger add course modal sau khi navigate
        setTimeout(() => {
          const event = new CustomEvent("admin-add-course");
          window.dispatchEvent(event);
        }, 100);
        break;
      case "create-class":
        setActiveMenu("classes");
        setTimeout(() => {
          const event = new CustomEvent("admin-add-class");
          window.dispatchEvent(event);
        }, 100);
        break;
      case "manage-users":
        setActiveMenu("users");
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
              <p className="text-white opacity-90" style={{ fontSize: "0.875rem" }}>
                Admin Portal
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <button
            onClick={() => setActiveMenu("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md mb-2 transition-colors ${
              activeMenu === "dashboard" ? "bg-[#004494]" : "hover:bg-[#004494]"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveMenu("courses")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md mb-2 transition-colors ${
              activeMenu === "courses" ? "bg-[#004494]" : "hover:bg-[#004494]"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Course Management</span>
          </button>
          <button
            onClick={() => setActiveMenu("classes")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md mb-2 transition-colors ${
              activeMenu === "classes" ? "bg-[#004494]" : "hover:bg-[#004494]"
            }`}
          >
            <School className="w-5 h-5" />
            <span>Class Management</span>
          </button>
          <button
            onClick={() => setActiveMenu("enrollments")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md mb-2 transition-colors ${
              activeMenu === "enrollments" ? "bg-[#004494]" : "hover:bg-[#004494]"
            }`}
          >
            <AsteriskSquare className="w-8 h-5" />
            <span>Assign Management</span>
          </button>

          <button
            onClick={() => setActiveMenu("users")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md mb-2 transition-colors ${
              activeMenu === "users" ? "bg-[#004494]" : "hover:bg-[#004494]"
            }`}
          >
            <Users className="w-8 h-5" />
            <span>User Management</span>
          </button>
          {/* <button
            onClick={() => setActiveMenu("notifications")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md mb-2 transition-colors ${
              activeMenu === "notifications" ? "bg-[#004494]" : "hover:bg-[#004494]"
            }`}
          >
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </button> */}
        </nav>

        <div className="p-4 border-t border-[#004494] space-y-2">
          <div className="flex items-center justify-center">
            <DarkModeToggle />
          </div>
          <button
            onClick={() => {
              logout();
              toast.success("Logged out successfully");
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
        {activeMenu === "dashboard" && <DashboardOverview onQuickAction={handleQuickAction} />}
        {activeMenu === "courses" && <CourseManagement />}
        {activeMenu === "classes" && <ClassManagement />}
        {activeMenu === "enrollments" && <EnrollmentManagement />}
        {activeMenu === "users" && <UserManagement />}
        {/* {activeMenu === "notifications" && <NotificationManagement />} */}
      </div>
    </div>
  );
}

function DashboardOverview({
  onQuickAction,
}: {
  onQuickAction: (action: "create-course" | "create-class" | "manage-users") => void;
}) {
  // Cấu hình data cho giống ảnh
  const stats = [
    {
      title: "Total Courses",
      value: mockCourses.length,
      trend: "+3 new",
      icon: BookOpen,
      iconColor: "#0056b3", // Xanh dương
      iconBg: "#e6f0ff", // Nền xanh nhạt
    },
    {
      title: "Total Classes",
      value: mockClasses.length,
      trend: "+5 active",
      icon: School,
      iconColor: "#e0a800", // Vàng đậm
      iconBg: "#fff9db", // Nền vàng nhạt
    },
    {
      title: "Total Students",
      value: 125,
      trend: "+12 this week",
      icon: Users,
      iconColor: "#28a745", // Xanh lá
      iconBg: "#e6fffa", // Nền xanh lá nhạt
    },
  ];

  return (
    <div className="p-8">
      <h1 className="mb-8">Admin Dashboard</h1>

      {/* Phần thống kê mới: Icon tròn bên phải */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-card p-6 rounded-lg border border-border shadow-sm flex items-center justify-between animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-foreground mb-2">{stat.value}</h3>
              <div
                className="flex items-center gap-1 text-sm font-medium"
                style={{ color: "#28a745" }}
              >
                <TrendingUp className="w-4 h-4" />
                <span>{stat.trend}</span>
              </div>
            </div>

            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: stat.iconBg }}
            >
              <stat.icon className="w-6 h-6" style={{ color: stat.iconColor }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="bg-card p-6 rounded-lg border border-border shadow-sm animate-fade-in-up"
          style={{ animationDelay: "400ms" }}
        >
          <h3 className="mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
              <div className="w-2 h-2 rounded-full bg-success"></div>
              <p style={{ fontSize: "0.875rem" }}>New course "Speaking Preparation 101" created</p>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
              <div className="w-2 h-2 rounded-full bg-[#0056b3]"></div>
              <p style={{ fontSize: "0.875rem" }}>
                5 students enrolled in Speaking Preparation 101
              </p>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
              <div className="w-2 h-2 rounded-full bg-[#ffc107]"></div>
              <p style={{ fontSize: "0.875rem" }}>
                Class "Listening Preparation 101 - Section B" started
              </p>
            </div>
          </div>
        </div>

        <div
          className="bg-card p-6 rounded-lg border border-border shadow-sm animate-fade-in-up"
          style={{ animationDelay: "500ms" }}
        >
          <h3 className="mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button
              className="w-full text-left px-4 py-3 bg-muted/50 rounded-md hover:bg-muted transition-colors"
              onClick={() => onQuickAction("create-course")}
            >
              <div className="flex items-center gap-3">
                <Plus className="w-4 h-4 text-[#0056b3]" />
                <span style={{ fontSize: "0.875rem" }}>Create New Course</span>
              </div>
            </button>
            <button
              className="w-full text-left px-4 py-3 bg-muted/50 rounded-md hover:bg-muted transition-colors"
              onClick={() => onQuickAction("create-class")}
            >
              <div className="flex items-center gap-3">
                <Plus className="w-4 h-4 text-[#0056b3]" />
                <span style={{ fontSize: "0.875rem" }}>Create New Class</span>
              </div>
            </button>
            <button
              className="w-full text-left px-4 py-3 bg-muted/50 rounded-md hover:bg-muted transition-colors"
              onClick={() => onQuickAction("manage-users")}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-[#0056b3]" />
                <span style={{ fontSize: "0.875rem" }}>Manage Users</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<(typeof mockCourses)[0] | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; courseId: string | null }>({
    isOpen: false,
    courseId: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string | null>>({});
  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const data = await courseService.listCourse();
      setCourses(Array.isArray(data.data.courses) ? data.data.courses : []);
    } catch (error) {
      toast.error("Failed to fetch courses");
    }
    setLoadingCourses(false);
  };
  // Fetch courses from API when mount
  React.useEffect(() => {
    fetchCourses();

    const handleQuickAction = () => {
      setEditingCourse(null);
      setFormData({ title: "", description: "" });
      setShowModal(true);
    };
    window.addEventListener("admin-add-course", handleQuickAction);
    return () => window.removeEventListener("admin-add-course", handleQuickAction);
  }, []);

  const handleCreate = async () => {
    // Validate manually trước
    if (!formData.title.trim()) {
      toast.error("Course name is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (formData.description.trim().length < 10) {
      toast.error("Description must be at least 10 characters");
      return;
    }

    const validation = validateForm(formData, {
      title: commonRules.courseName,
      description: { required: true, minLength: 10 },
    });
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      toast.error("Please fix the form errors");
      return;
    }
    setIsSaving(true);
    try {
      if (editingCourse) {
        // Update course
        const updated = await courseService.updateCourse(editingCourse.id, formData);

        if (updated.ok) {
          fetchCourses();
          toast.success("Course updated successfully!");
        } else {
          toast.error("Failed to update course!");
        }
      } else {
        // Create course
        const created = await courseService.createCourse(formData);
        if (created.ok) {
          fetchCourses();
          toast.success("Course created successfully!");
        } else {
          toast.error("Failed to create course!");
        }
      }
      setShowModal(false);
      setFormData({ title: "", description: "" });
      setFormErrors({});
      setEditingCourse(null);
    } catch (error) {
      toast.error("API error!");
    }
    setIsSaving(false);
  };

  // Filter courses based on search
  const filteredCourses = courses.filter(
    (course) =>
      (course.title && course.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pagination
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedData: paginatedCourses,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination({ data: filteredCourses, initialItemsPerPage: 10 });

  const handleInlineEdit = async (courseId: string, field: keyof Course, newValue: string) => {
    try {
      const course = courses.find((c) => c.id === courseId);
      if (!course) return;
      const updated = await courseService.updateCourse(courseId, { ...course, [field]: newValue });
      setCourses(courses.map((c) => (c.id === courseId ? { ...c, ...updated } : c)));
      toast.success("Course updated!");
    } catch (error) {
      toast.error("Failed to update course!");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1>Courses</h1>
        <button
          onClick={() => {
            setEditingCourse(null);
            setFormData({ title: "", description: "" });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-[#212529] hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#ffc107" }}
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
          description={
            searchQuery
              ? "Try adjusting your search query"
              : "Create your first course to get started!"
          }
          action={
            !searchQuery
              ? {
                  label: "Create Course",
                  onClick: () => {
                    setEditingCourse(null);
                    setFormData({ title: "", description: "" });
                    setShowModal(true);
                  },
                }
              : undefined
          }
        />
      ) : (
        <>
          <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden animate-fade-in-up">
            <div className="overflow-x-auto">
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
                    <tr
                      key={course.id}
                      className="border-t border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="px-6 py-4">
                        <InlineEdit
                          value={course.title}
                          onSave={(newValue: string) =>
                            handleInlineEdit(course.id, "title", newValue)
                          }
                        />
                      </td>
                      <td className="px-6 py-4">
                        <InlineEdit
                          value={course.description}
                          onSave={(newValue: string) =>
                            handleInlineEdit(course.id, "description", newValue)
                          }
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            className="p-2 hover:bg-muted rounded-md transition-all transform hover:scale-110"
                            onClick={() => {
                              setEditingCourse(course);
                              setFormData({ title: course.title, description: course.description });
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
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50 animate-fade-in-up"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-card rounded-lg p-6 w-full max-w-md animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3>{editingCourse ? "Edit Course" : "Create Course"}</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <ValidatedInput
                label="Course Name"
                value={formData.title}
                onChange={(value) => setFormData({ ...formData, title: value })}
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
                  onFilesSelected={(files: File[]) => {
                    console.log("Files selected:", files);
                  }}
                />
              </div>

              <LoadingButton
                loading={isSaving}
                loadingText={editingCourse ? "Updating..." : "Creating..."}
                onClick={handleCreate}
                className="w-full px-4 py-2 rounded-md text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#0056b3" }}
              >
                {editingCourse ? "Update Course" : "Create Course"}
              </LoadingButton>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, courseId: null })}
        onConfirm={async () => {
          if (deleteConfirm.courseId) {
            try {
              await courseService.deleteCourse(deleteConfirm.courseId);
              setCourses(courses.filter((c) => c.id !== deleteConfirm.courseId));
              toast.success("Course deleted successfully!");
            } catch (error) {
              toast.error("Failed to delete course!");
            }
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
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  // Simplified formData - chỉ giữ các trường có trong backend schema
  const [formData, setFormData] = useState({
    title: "",
    courseId: "",
    teacherId: "", // optional field
  });

  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; classId: string | null }>({
    isOpen: false,
    classId: null,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const fetchClasses = async () => {
    try {
      const response = await classService.listClass();

      const classesData = response?.data?.classes || response?.classes || [];

      setClasses(Array.isArray(classesData) ? classesData : []);
    } catch (error) {
      console.error("Fetch error:", error); // Debug log
      toast.error("Failed to fetch classes");
    }
  };
  const fetchTeachers = async () => {
    try {
      const response = await userService.listTeacher();
      const teachersData = response?.data?.user || response?.user || [];
      setTeachers(Array.isArray(teachersData) ? teachersData : []);
    } catch (error) {
      console.error("Fetch teachers error:", error);
      toast.error("Failed to fetch teachers");
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await courseService.listCourse();
      const courseData = response?.data?.courses || response?.courses || [];
      setCourses(Array.isArray(courseData) ? courseData : []);
    } catch (error) {
      console.error("Fetch courses error:", error);
      toast.error("Failed to fetch courses");
    }
  };

  // Listen for Quick Action events
  React.useEffect(() => {
    fetchClasses();
    fetchTeachers();
    fetchCourses();
    const handleQuickAction = () => {
      setEditingClass(null);
      setFormData({
        title: "",
        courseId: "",
        teacherId: "",
      });
      setShowModal(true);
    };
    window.addEventListener("admin-add-class", handleQuickAction);
    return () => window.removeEventListener("admin-add-class", handleQuickAction);
  }, []);

  // Debug: Log classes state

  // Filter classes based on search
  const filteredClasses = classes.filter((cls) => {
    const q = searchQuery.toLowerCase();
    return (
      (cls.title && cls.title.toLowerCase().includes(q)) ||
      ((cls as any).course?.title && (cls as any).course.title.toLowerCase().includes(q)) ||
      ((cls as any).course?.description &&
        (cls as any).course.description.toLowerCase().includes(q))
    );
  });

  // Pagination
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedData: paginatedClasses,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination({ data: filteredClasses, initialItemsPerPage: 10 });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1>Classes</h1>
        <button
          onClick={() => {
            setEditingClass(null);
            setFormData({
              title: "",
              courseId: "",
              teacherId: "",
            });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-[#212529] hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#ffc107" }}
        >
          <Plus className="w-4 h-4" />
          New Class
        </button>
      </div>

      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search classes by name or course..."
        />
      </div>

      {filteredClasses.length === 0 ? (
        <EmptyState
          icon={School}
          title="No classes found"
          description={
            searchQuery
              ? "Try adjusting your search query"
              : "Create your first class to get started!"
          }
          action={
            !searchQuery
              ? {
                  label: "Create Class",
                  onClick: () => {
                    setEditingClass(null);
                    setFormData({
                      title: "",
                      courseId: "",
                      teacherId: "",
                    });
                    setShowModal(true);
                  },
                }
              : undefined
          }
        />
      ) : (
        <>
          <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden animate-fade-in-up">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left">#</th>
                    <th className="px-6 py-3 text-left">Class Name</th>
                    <th className="px-6 py-3 text-left">Course</th>
                    <th className="px-6 py-3 text-left">Description</th>
                    <th className="px-6 py-3 text-left">Teacher Name</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedClasses.map((cls, index) => (
                    <tr
                      key={cls.id}
                      className="border-t border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="px-6 py-4">{cls.title}</td>
                      <td className="px-6 py-4">{(cls as any).course?.title || "N/A"}</td>
                      <td className="px-6 py-4">
                        {(cls as any).course?.description || "No description"}
                      </td>
                      <td className="px-6 py-4">{(cls as any).teacher?.name || "N/A"}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            className="p-2 hover:bg-muted rounded-md transition-all transform hover:scale-110"
                            onClick={() => {
                              setEditingClass(cls);
                              setFormData({
                                title: cls.title,
                                courseId: cls.courseId,
                                teacherId: cls.teacherId || "",
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
                  ))}
                </tbody>
              </table>
            </div>
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
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50 h-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-card rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3>{editingClass ? "Edit Class" : "Create Class"}</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium">Class Name</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Listening Preparation 101"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Course Name</label>
                <select
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="" disabled={!!editingClass}>
                    -- Select Course --
                  </option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Teacher Name</label>
                <select
                  value={formData.teacherId}
                  onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="" disabled={!!editingClass}>
                    -- Select Teacher --
                  </option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name} ({teacher.email})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={async () => {
                  // Validate chi tiết từng field
                  if (!formData.title.trim()) {
                    toast.error("Class name is required");
                    return;
                  }
                  if (!formData.courseId) {
                    toast.error("Course selection is required");
                    return;
                  }

                  try {
                    if (editingClass) {
                      // Update class - chỉ gửi các trường có trong schema
                      const updateData: any = {
                        title: formData.title,
                        courseId: formData.courseId,
                      };
                      if (formData.teacherId) {
                        updateData.teacherId = formData.teacherId;
                      }
                      await classService.updateClass(editingClass.id, updateData);
                      toast.success("Class updated successfully!");
                    } else {
                      // Create class - chỉ gửi các trường có trong schema
                      const createData: any = {
                        title: formData.title,
                        courseId: formData.courseId,
                      };
                      if (formData.teacherId) {
                        createData.teacherId = formData.teacherId;
                      }
                      await classService.createClass(createData);
                      toast.success("Class created successfully!");
                    }
                    setShowModal(false);
                    fetchClasses();
                  } catch (error) {
                    toast.error("Failed to save class!");
                  }
                }}
                className="w-full px-4 py-2 rounded-md text-white mt-2"
                style={{ backgroundColor: "#0056b3" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#004494")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
              >
                {editingClass ? "Update Class" : "Create Class"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, classId: null })}
        onConfirm={async () => {
          if (deleteConfirm.classId) {
            try {
              await classService.deleteClass(deleteConfirm.classId);
              fetchClasses();
              toast.success("Class deleted successfully!");
            } catch (error) {
              toast.error("Failed to delete class!");
            }
          }
        }}
        title="Delete Class"
        message="Are you sure you want to delete this class? This action cannot be undone."
      />
    </div>
  );
}

function EnrollmentManagement() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<User[]>([]);

  const [formData, setFormData] = useState({
    classId: "",
    userId: "",
  });

  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    enrollmentId: string | null;
    classId?: string;
    userId?: string;
  }>({
    isOpen: false,
    enrollmentId: null,
  });

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const response = await courseService.getCourseEnrollmentsByAdmin();
      setEnrollments(Array.isArray(response.data.enrollments) ? response.data.enrollments : []);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch enrollments");
    }
    setLoading(false);
  };

  const fetchClasses = async () => {
    try {
      const response = await classService.listClass();
      const classesData = response?.data?.classes || response?.classes || [];
      setClasses(Array.isArray(classesData) ? classesData : []);
    } catch (error) {
      console.error("Fetch classes error:", error);
      toast.error("Failed to fetch classes");
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await userService.listStudent();
      const usersData = response?.data?.user || response?.user || [];
      setStudents(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error("Fetch students error:", error);
      toast.error("Failed to fetch students");
    }
  };

  React.useEffect(() => {
    fetchEnrollments();
    fetchClasses();
    fetchStudents();
  }, []);

  // Filter enrollments
  const filteredEnrollments = enrollments.filter((enrollment) => {
    const q = searchQuery.toLowerCase();
    return (
      (enrollment.user?.name && enrollment.user.name.toLowerCase().includes(q)) ||
      (enrollment.user?.email && enrollment.user.email.toLowerCase().includes(q)) ||
      (enrollment.class?.title && enrollment.class.title.toLowerCase().includes(q)) ||
      (enrollment.class?.course?.title && enrollment.class.course.title.toLowerCase().includes(q))
    );
  });

  // Pagination
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedData: paginatedEnrollments,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination({ data: filteredEnrollments, initialItemsPerPage: 10 });

  const handleRemoveEnrollment = async (classId: string, userId: string) => {
    try {
      const response = await courseService.unenrollFromClassStudent(classId, userId);
      if (response.ok) {
        fetchEnrollments();
        toast.success("Student removed from class successfully!");
      }
    } catch (error) {
      toast.error("Failed to remove student!");
    }
  };

  const handleEnrollStudent = async () => {
    // Validate từng field riêng
    if (!formData.classId) {
      toast.error("Class selection is required");
      return;
    }
    if (!formData.userId) {
      toast.error("Student selection is required");
      return;
    }

    try {
      await courseService.enrollToClassStudent(formData.classId, formData.userId);
      toast.success("Student enrolled successfully!");
      setShowModal(false);
      setFormData({ classId: "", userId: "" });
      fetchEnrollments();
    } catch (error) {
      toast.error("Failed to enroll student!");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1>Enrollment Management</h1>
        <button
          onClick={() => {
            setFormData({ classId: "", userId: "" });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-[#212529] hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#ffc107" }}
        >
          <Plus className="w-4 h-4" />
          Assign Student to Class
        </button>
      </div>

      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by student name, email, or class..."
        />
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : filteredEnrollments.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No enrollments found"
          description={
            searchQuery ? "Try adjusting your search query" : "No students are enrolled yet"
          }
          action={
            !searchQuery
              ? {
                  label: "Assign Student",
                  onClick: () => {
                    setFormData({ classId: "", userId: "" });
                    setShowModal(true);
                  },
                }
              : undefined
          }
        />
      ) : (
        <>
          <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden animate-fade-in-up">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left">#</th>
                    <th className="px-6 py-3 text-left">Student Name</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Class</th>
                    <th className="px-6 py-3 text-left">Course</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Enrolled Date</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEnrollments.map((enrollment, index) => (
                    <tr
                      key={enrollment.id}
                      className="border-t border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="px-6 py-4">{enrollment.user?.name || "N/A"}</td>
                      <td className="px-6 py-4">{enrollment.user?.email || "N/A"}</td>
                      <td className="px-6 py-4">{enrollment.class?.title || "N/A"}</td>
                      <td className="px-6 py-4">{enrollment.class?.course?.title || "N/A"}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            enrollment.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {enrollment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(enrollment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          className="p-2 hover:bg-muted rounded-md transition-all transform hover:scale-110"
                          onClick={() =>
                            setDeleteConfirm({
                              isOpen: true,
                              enrollmentId: enrollment.id,
                              classId: enrollment.classId,
                              userId: enrollment.userId,
                            })
                          }
                          title="Remove enrollment"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredEnrollments.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        </>
      )}

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-card rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3>Assign Student to Class</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium">Class</label>
                <select
                  value={formData.classId}
                  onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">-- Select Class --</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.title} {cls.course?.title && `(${cls.course.title})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Student</label>
                <select
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">-- Select Student --</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.email})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleEnrollStudent}
                className="w-full px-4 py-2 rounded-md text-white mt-2"
                style={{ backgroundColor: "#0056b3" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#004494")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
              >
                Assign Student
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, enrollmentId: null })}
        onConfirm={async () => {
          if (deleteConfirm.classId && deleteConfirm.userId) {
            await handleRemoveEnrollment(deleteConfirm.classId, deleteConfirm.userId);
          }
        }}
        title="Remove Student"
        message="Are you sure you want to remove this student from the class? This action cannot be undone."
      />
    </div>
  );
}
function UserManagement() {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; userId: string | null }>({
    isOpen: false,
    userId: null,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await userService.listUser();
      const usersData = response?.data?.user || response?.user || [];
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch users");
    }
  };

  React.useEffect(() => {
    fetchUsers();
    const handleQuickAction = () => {
      setEditingUser(null);
      setFormData({ name: "", email: "" });
      setShowModal(true);
    };
    window.addEventListener("admin-add-user", handleQuickAction);
    return () => window.removeEventListener("admin-add-user", handleQuickAction);
  }, []);

  // Filter users based on search
  const filteredUsers = users.filter((user) => {
    const q = searchQuery.toLowerCase();
    return (
      (user.name && user.name.toLowerCase().includes(q)) ||
      (user.email && user.email.toLowerCase().includes(q))
    );
  });

  // Pagination
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedData: paginatedUsers,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination({ data: filteredUsers, initialItemsPerPage: 10 });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1>Users</h1>
        <button
          onClick={() => {
            setEditingUser(null);
            setFormData({ name: "", email: "" });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-[#212529] hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#ffc107" }}
        >
          <Plus className="w-4 h-4" />
          New User
        </button>
      </div>

      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search users by name or email..."
        />
      </div>

      {filteredUsers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description={
            searchQuery
              ? "Try adjusting your search query"
              : "Create your first user to get started!"
          }
          action={
            !searchQuery
              ? {
                  label: "Create User",
                  onClick: () => {
                    setEditingUser(null);
                    setFormData({ name: "", email: "" });
                    setShowModal(true);
                  },
                }
              : undefined
          }
        />
      ) : (
        <>
          <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden animate-fade-in-up">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left">#</th>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Created At</th>
                    <th className="px-6 py-3 text-left">Updated At</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className="border-t border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="px-6 py-4">{user.name}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{new Date(user.updatedAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            className="p-2 hover:bg-muted rounded-md transition-all transform hover:scale-110"
                            onClick={() => {
                              setEditingUser(user);
                              setFormData({
                                name: user.name,
                                email: user.email,
                              });
                              setShowModal(true);
                            }}
                            title="Edit user"
                          >
                            <Edit className="w-4 h-4 text-[#0056b3]" />
                          </button>
                          <button
                            className="p-2 hover:bg-muted rounded-md transition-all transform hover:scale-110"
                            onClick={() => setDeleteConfirm({ isOpen: true, userId: user.id })}
                            title="Delete user"
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
          </div>

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredUsers.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        </>
      )}

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-card rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3>{editingUser ? "Edit User" : "Create User"}</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="john@example.com"
                />
              </div>

              <button
                onClick={async () => {
                  // Validate từng field
                  if (!formData.name.trim()) {
                    toast.error("Name is required");
                    return;
                  }

                  if (!formData.email.trim()) {
                    toast.error("Email is required");
                    return;
                  }

                  // Email validation
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(formData.email)) {
                    toast.error("Please enter a valid email address");
                    return;
                  }

                  try {
                    toast.success("User saved successfully!");
                    setShowModal(false);
                  } catch (error) {
                    toast.error("Failed to save user!");
                  }
                }}
                className="w-full px-4 py-2 rounded-md text-white mt-2"
                style={{ backgroundColor: "#0056b3" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#004494")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
              >
                {editingUser ? "Update User" : "Create User"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, userId: null })}
        onConfirm={async () => {
          if (deleteConfirm.userId) {
            try {
              // await userService.deleteUser(deleteConfirm.userId);
              // fetchUsers();
              toast.success("User deleted successfully!");
            } catch (error) {
              toast.error("Failed to delete user!");
            }
          }
        }}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
      />
    </div>
  );
}
