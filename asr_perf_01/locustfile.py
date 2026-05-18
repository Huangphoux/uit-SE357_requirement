# /// script
# requires-python = ">=3.8"
# dependencies = [
#     "locust",
# ]
# ///

"""
ASR-PERF-01 Locust Load Testing Script

Load test: 250 concurrent students and 250 concurrent teachers

Data model (from seed.ts):
- 250 students (student1@example.com - student250@example.com)
- 250 teachers (teacher1@example.com - teacher250@example.com)
- 250 classes (one per teacher)
- Each student enrolled in one class: classIdx = studentId % 250
- Each class has 1 teacher, 1 assignment, 1 student submission, 1 feedback

Usage:
    uv run asr_perf_01/locustfile.py --host=http://localhost:8000 --users=500 --spawn-rate=50 --run-time=60s --headless
"""

from locust import HttpUser, task, between  # ty:ignore[unresolved-import]
import random


class StudentUser(HttpUser):
    """Simulates 250 concurrent students, each with one class enrollment"""

    host = "http://localhost:8000"
    wait_time = between(0.1, 0.5)  # Small delay between requests
    weight = 1  # 250 students: 500 users total

    def on_start(self):
        """Setup per user - login first"""
        self.user_id = random.randint(1, 250)
        self.user_type = "student"
        # Each student enrolled in their corresponding class: student_i -> class_i
        self.enrolled_class_idx = self.user_id
        # Spoof X-Forwarded-For to bypass rate limiter
        self.ip = f"10.0.{self.user_id // 250}.{(self.user_id % 250) + 1}"
        self.headers = {"X-Forwarded-For": self.ip}

        # Login
        login_response = self.client.post(
            "/api/auth/login",
            json={
                "email": f"student{self.user_id}@example.com",
                "password": "Student123!",
            },
            headers=self.headers,
        )

        if login_response.status_code == 200:
            self.logged_in = True
        else:
            self.logged_in = False
            print(
                f"Login failed for student{self.user_id}: {login_response.status_code}"
            )
            if login_response.text:
                print(f"Response: {login_response.text}")

    @task(3)
    def get_assignments(self):
        """Fetch assignments for enrolled class only"""
        if not self.logged_in:
            return
        with self.client.get(
            "/api/assignments",
            headers=self.headers,
            catch_response=True,
        ) as response:
            if response.status_code >= 500:
                response.failure(f"Server error: {response.status_code}")
            else:
                response.success()

    @task(2)
    def get_submissions(self):
        """Fetch submissions owned by this student only"""
        if not self.logged_in:
            return
        with self.client.get(
            "/api/submissions/student", headers=self.headers, catch_response=True
        ) as response:
            if response.status_code >= 500:
                response.failure(f"Server error: {response.status_code}")
            else:
                response.success()

    @task(2)
    def get_feedback(self):
        """Fetch feedback for this student's submissions only (backend filters by authorization)"""
        if not self.logged_in:
            return
        with self.client.get(
            "/api/feedback", headers=self.headers, catch_response=True
        ) as response:
            if response.status_code >= 500:
                response.failure(f"Server error: {response.status_code}")
            else:
                response.success()

    @task(2)
    def get_enrolled_classes(self):
        """Fetch classes student is enrolled in"""
        if not self.logged_in:
            return
        with self.client.get(
            "/api/classes", headers=self.headers, catch_response=True
        ) as response:
            if response.status_code >= 500:
                response.failure(f"Server error: {response.status_code}")
            else:
                response.success()

    @task(2)
    def get_user_info(self):
        """Fetch current user info"""
        if not self.logged_in:
            return
        with self.client.get(
            "/api/user/info", headers=self.headers, catch_response=True
        ) as response:
            if response.status_code >= 500:
                response.failure(f"Server error: {response.status_code}")
            else:
                response.success()

    @task(1)
    def list_teachers(self):
        """Fetch list of teachers"""
        if not self.logged_in:
            return
        with self.client.get(
            "/api/user/listTeachers", headers=self.headers, catch_response=True
        ) as response:
            if response.status_code >= 500:
                response.failure(f"Server error: {response.status_code}")
            else:
                response.success()

    @task(1)
    def get_enrolled_courses(self):
        """Fetch courses student is enrolled in"""
        if not self.logged_in:
            return
        with self.client.get(
            "/api/courses/enrolled", headers=self.headers, catch_response=True
        ) as response:
            if response.status_code >= 500:
                response.failure(f"Server error: {response.status_code}")
            else:
                response.success()

    @task(1)
    def get_materials(self):
        """Fetch materials for enrolled class only"""
        if not self.logged_in:
            return
        with self.client.get(
            "/api/materials",
            headers=self.headers,
            catch_response=True,
        ) as response:
            if response.status_code >= 500:
                response.failure(f"Server error: {response.status_code}")
            else:
                response.success()


class TeacherUser(HttpUser):
    """Simulates 250 concurrent teachers, each with one assigned class"""

    host = "http://localhost:8000"
    wait_time = between(0.1, 0.5)
    weight = 1  # 250 teachers: 500 users total

    def on_start(self):
        """Setup per user - login first (all teachers have assigned classes)"""
        self.user_id = random.randint(1, 250)
        self.user_type = "teacher"
        # Each teacher has one assigned class: teacher_i -> class_i
        self.class_id = self.user_id
        # Course distribution: teacher_i -> course ((i-1) % 3) + 1
        self.course_id = ((self.user_id - 1) % 3) + 1
        # Spoof X-Forwarded-For to bypass rate limiter
        self.ip = f"10.1.{self.user_id // 250}.{(self.user_id % 250) + 1}"
        self.headers = {"X-Forwarded-For": self.ip}

        # Login
        login_response = self.client.post(
            "/api/auth/login",
            json={
                "email": f"teacher{self.user_id}@example.com",
                "password": "Teacher123!",
            },
            headers=self.headers,
        )

        if login_response.status_code == 200:
            self.logged_in = True
        else:
            self.logged_in = False
            print(
                f"Login failed for teacher{self.user_id}: {login_response.status_code}"
            )
            if login_response.text:
                print(f"Response: {login_response.text}")

    @task(3)
    def get_classes(self):
        """Fetch classes taught by this teacher"""
        if not self.logged_in:
            return
        with self.client.get(
            "/api/classes", headers=self.headers, catch_response=True
        ) as response:
            if response.status_code >= 500:
                response.failure(f"Server error: {response.status_code}")
            else:
                response.success()

    @task(2)
    def get_submissions(self):
        """Fetch submissions for classes this teacher teaches"""
        if not self.logged_in:
            return
        with self.client.get(
            "/api/submissions", headers=self.headers, catch_response=True
        ) as response:
            if response.status_code >= 500:
                response.failure(f"Server error: {response.status_code}")
            else:
                response.success()

    @task(2)
    def get_feedback(self):
        """Fetch feedback created by this teacher"""
        if not self.logged_in:
            return
        with self.client.get(
            "/api/feedback", headers=self.headers, catch_response=True
        ) as response:
            if response.status_code >= 500:
                response.failure(f"Server error: {response.status_code}")
            else:
                response.success()

    @task(2)
    def get_assignments(self):
        """Fetch assignments created by this teacher"""
        if not self.logged_in:
            return
        with self.client.get(
            "/api/assignments", headers=self.headers, catch_response=True
        ) as response:
            if response.status_code >= 500:
                response.failure(f"Server error: {response.status_code}")
            else:
                response.success()

    @task(1)
    def list_students(self):
        """Fetch list of students"""
        if not self.logged_in:
            return
        with self.client.get(
            "/api/user/listStudents", headers=self.headers, catch_response=True
        ) as response:
            if response.status_code >= 500:
                response.failure(f"Server error: {response.status_code}")
            else:
                response.success()

    @task(1)
    def get_materials(self):
        """Fetch materials for classes this teacher teaches"""
        if not self.logged_in:
            return
        with self.client.get(
            "/api/materials", headers=self.headers, catch_response=True
        ) as response:
            if response.status_code >= 500:
                response.failure(f"Server error: {response.status_code}")
            else:
                response.success()

    @task(2)
    def get_user_info(self):
        """Fetch current user info"""
        if not self.logged_in:
            return
        with self.client.get(
            "/api/user/info", headers=self.headers, catch_response=True
        ) as response:
            if response.status_code >= 500:
                response.failure(f"Server error: {response.status_code}")
            else:
                response.success()

    @task(1)
    def get_courses(self):
        """Fetch courses this teacher teaches"""
        if not self.logged_in:
            return
        with self.client.get(
            "/api/courses", headers=self.headers, catch_response=True
        ) as response:
            if response.status_code >= 500:
                response.failure(f"Server error: {response.status_code}")
            else:
                response.success()
