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
  TrendingUp, // Đã thêm icon này
} from "lucide-react";
import { toast } from "sonner";
import { mockCourses, mockClasses, Course, Class } from "@/data/mockData";
import NotificationManagement from "@/pages/NotificationManagement";
import { title } from "process";

type MenuItem = "dashboard" | "courses" | "classes" | "users" | "notifications";

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
            onClick={() => setActiveMenu("users")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md mb-2 transition-colors ${
              activeMenu === "users" ? "bg-[#004494]" : "hover:bg-[#004494]"
            }`}
          >
            <Users className="w-5 h-5" />
            <span>User Management</span>
          </button>
          <button
            onClick={() => setActiveMenu("notifications")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md mb-2 transition-colors ${
              activeMenu === "notifications" ? "bg-[#004494]" : "hover:bg-[#004494]"
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
        {activeMenu === "users" && <UserManagement />}
        {activeMenu === "notifications" && <NotificationManagement />}
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
              <p style={{ fontSize: "0.875rem" }}>New course "Advanced React" created</p>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
              <div className="w-2 h-2 rounded-full bg-[#0056b3]"></div>
              <p style={{ fontSize: "0.875rem" }}>5 students enrolled in Web Development</p>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
              <div className="w-2 h-2 rounded-full bg-[#ffc107]"></div>
              <p style={{ fontSize: "0.875rem" }}>Class "React 101 - Section B" started</p>
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
        >
          <div className="bg-card rounded-lg p-6 w-full max-w-md animate-slide-in">
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
                  onFilesSelected={(files) => console.log("Files:", files)}
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
      console.log("API Response:", response); // Debug log
      
      // Kiểm tra cấu trúc response từ API
      const classesData = response?.data?.classes || response?.classes || [];
      console.log("Classes Data:", classesData); // Debug log
      
      setClasses(Array.isArray(classesData) ? classesData : []);
    } catch (error) {
      console.error("Fetch error:", error); // Debug log
      toast.error("Failed to fetch classes");
    }
  };

  // Listen for Quick Action events
  React.useEffect(() => {
    fetchClasses();
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
      ((cls as any).course?.description && (cls as any).course.description.toLowerCase().includes(q))
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
                    <td className="px-6 py-4">{(cls as any).course?.title || 'N/A'}</td>
                    <td className="px-6 py-4">{(cls as any).course?.description || 'No description'}</td>
                    <td className="px-6 py-4">{(cls as any).teacher?.name || 'N/A'}</td>
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
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
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
                  placeholder="Web Development - Section A"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Course ID</label>
                <input
                  type="text"
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter course ID"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Teacher ID (Optional)</label>
                <input
                  type="text"
                  value={formData.teacherId}
                  onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter teacher ID (optional)"
                />
              </div>

              <button
                onClick={async () => {
                  // Validate
                  if (!formData.title || !formData.courseId) {
                    toast.error("Please fill in all required fields");
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

function UserManagement() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1>User Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-[#212529]"
          style={{ backgroundColor: "#ffc107" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e0a800")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffc107")}
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
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
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
                  toast.success("Teacher account created. Temporary password sent via email.");
                  setShowModal(false);
                }}
                className="w-full px-4 py-2 rounded-md text-white"
                style={{ backgroundColor: "#0056b3" }}
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
