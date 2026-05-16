# /// script
# requires-python = ">=3.8"
# dependencies = [
#     "locust",
# ]
# ///

"""
ASR-PERF-01 Locust Load Testing Script

Load test: 500 concurrent users distributed across multiple endpoints
Users login first, then hit various API endpoints

Usage:
    uv run asr_perf_01/locustfile.py --host=http://localhost:8000 --users=500 --spawn-rate=50 --run-time=60s --headless
"""

from locust import HttpUser, task, between
import random


class SystemUser(HttpUser):
    """Simulates 500 concurrent users logged in and hitting various endpoints"""

    host = "http://localhost:8000"
    wait_time = between(0.1, 0.5)  # Small delay between requests

    def on_start(self):
        """Setup per user - login first"""
        self.user_id = random.randint(1, 500)
        # Spoof X-Forwarded-For to bypass rate limiter
        self.ip = f"10.0.{self.user_id // 250}.{(self.user_id % 250) + 1}"
        self.headers = {"X-Forwarded-For": self.ip}

        # Login
        login_response = self.client.post(
            "/api/auth/login",
            json={
                "email": f"user{self.user_id}@example.com",
                "password": "Student123!",
            },
            headers=self.headers,
        )

        if login_response.status_code == 200:
            self.logged_in = True
        else:
            self.logged_in = False
            print(f"Login failed for user{self.user_id}: {login_response.status_code}")
            if login_response.text:
                print(f"Response: {login_response.text}")

    @task(3)
    def get_assignments(self):
        """Fetch assignments"""
        if not self.logged_in:
            return
        with self.client.get(
            "/api/assignments", headers=self.headers, catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Status code: {response.status_code}")

    @task(2)
    def get_submissions(self):
        """Fetch submissions"""
        if not self.logged_in:
            return
        with self.client.get(
            "/api/submissions", headers=self.headers, catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Status code: {response.status_code}")

    @task(2)
    def get_feedback(self):
        """Fetch feedback"""
        if not self.logged_in:
            return
        with self.client.get(
            "/api/feedback", headers=self.headers, catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Status code: {response.status_code}")

    @task(2)
    def get_classes(self):
        """Fetch classes"""
        if not self.logged_in:
            return
        with self.client.get(
            "/api/classes", headers=self.headers, catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Status code: {response.status_code}")

    @task(2)
    def get_user_info(self):
        """Fetch current user info"""
        if not self.logged_in:
            return
        with self.client.get(
            "/api/user/info", headers=self.headers, catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Status code: {response.status_code}")

    @task(1)
    def list_teachers(self):
        """Fetch list of teachers"""
        if not self.logged_in:
            return
        with self.client.get(
            "/api/user/listTeachers", headers=self.headers, catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Status code: {response.status_code}")

    @task(1)
    def list_students(self):
        """Fetch list of students"""
        if not self.logged_in:
            return
        with self.client.get(
            "/api/user/listStudents", headers=self.headers, catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Status code: {response.status_code}")

    @task(2)
    def get_courses(self):
        """Fetch courses"""
        if not self.logged_in:
            return
        with self.client.get(
            "/api/courses", headers=self.headers, catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Status code: {response.status_code}")

    @task(1)
    def get_materials(self):
        """Fetch materials"""
        if not self.logged_in:
            return
        with self.client.get(
            "/api/materials", headers=self.headers, catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Status code: {response.status_code}")

    @task(2)
    def get_enrolled_courses(self):
        """Fetch courses student is enrolled in"""
        if not self.logged_in:
            return
        with self.client.get(
            "/api/courses/enrolled", headers=self.headers, catch_response=True
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Status code: {response.status_code}")
