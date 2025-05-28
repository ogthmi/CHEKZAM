# CHEKZAM

## 1. Introduction

### 1.1 Project Description
- CHEKZAM is an online learning platform that provides a centralized space for teachers to manage classes and for students to access materials and assessments.
- It standardizes online class organization, reduces technical barriers, and improves teacher–student interaction.
- The system follows an e-classroom model with separate spaces for tests, member management, and activity tracking.

### 1.2 Project Objectives
- Help teachers easily create and manage online classes.
- Provide multiple-choice testing with automatic grading.
- Support student management and allow flexible joining or leaving of classes.

---

## 2. Tech Stack
- **Backend:** Spring Boot (Spring Web, Spring Data JPA, Spring Security, OAuth2 Resource Server (JWT), Lombok, MySQL Connector/J)
- **Frontend:** ReactJS (react-dom, react-router-dom, react-bootstrap, react-icons, react-toastify)
- **Database:** MySQL

---

## 3. Analysis and Design

### 3.1 Specification

#### 3.1.1 Actors
- **Admin:** Manages and monitors the entire system, including user management.
- **Teacher:** Creates and manages classes and assignments, and guides students.
- **Student:** Joins classes, completes assignments, and tracks personal progress.
- *(Before role assignment, all users are general users.)*

#### 3.1.2 System Functions
- **General Users:** Register, log in, and update personal information.
- **Admin:** Create, update, and delete user accounts.
- **Teacher:** Manage classes (create, edit, delete, add/remove students) and assignments (create, assign, track results).
- **Student:** Join/leave classes, complete assignments, and view submission history.

![system_usecases](readme_assets/system_usecases.png)

---

### 3.2 Entity & Database Model

#### 3.2.1 Entities
- User
- Classroom
- Assignment
- Question
- Answer
- Submission
- ClassroomStudents (junction)
- AssignmentClassrooms (junction)
- AssignmentQuestions (junction)
- SubmissionAnswers (junction)

#### 3.2.2 Relationships

| Relationship                      | Type |
|----------------------------------|------|
| User – Classroom                 | N–N  |
| User – Assignment                | 1–N  |
| Assignment – Classroom           | N–N  |
| Assignment – Question            | N–N  |
| Question – Answer                | 1–N  |
| Submission – AssignmentClassrooms| N–1  |
| Submission – Answer              | N–N  |

#### 3.2.3 Database
![database](readme_assets/database.png)

---

## 4. Project Structure

### 4.1 Backend Architecture

The backend is modularized for scalability, maintainability, and clear separation of concerns.

- `common/`: Shared components
- `module/`: Feature-based modules

---

### 4.1.1 Common Module (`common/`)

| Folder/File        | Responsibility | Key Components |
|-------------------|---------------|----------------|
| `configuration/`  | System configuration | SecurityConfig, CustomJwtDecoder, AdminConfig |
| `exception/`      | Error handling | ApplicationException, GlobalExceptionHandler |
| `message/`        | Message codes | ExceptionMessageCode, SuccessMessageCode |
| `util/`           | Utilities | IdGenerator, JwtUtil, PaginationUtil |
| `ApiResponse`     | API response format | Standardized response structure |
| `Endpoint`        | API endpoints | Centralized route definitions |

---

### 4.1.2 Feature Modules (`module/`)

**Design Principles**
- Feature-based structure
- Each module includes:
    - Controller
    - Service
    - Repository
    - Entity & DTO
    - Optional: mapper, enum

- N-N relationships are separated into dedicated modules (SRP compliant)

**Modules**

| Module | Description |
|--------|------------|
| `user/` | User management |
| `auth/` | Authentication & JWT |
| `classroom/` | Classroom management |
| `classroom_student/` | Student–classroom relationship |
| `assignment/` | Assignment management |
| `assignment_classroom/` | Assignment–classroom mapping |
| `assignment_question/` | Assignment–question mapping |
| `question/` | Question management |
| `answer/` | Answer management |
| `submission/` | Submission & grading |
| `submission_answer/` | Submission details |

---

## 5. Demo Screenshots

### 5.1 Landing Page
![landing](readme_assets/demo_landing.png)

### 5.2 Teacher

#### Classroom
![teacher_classroom_list](readme_assets/demo_teacher_classroom_list.png)
![teacher_create_classroom](readme_assets/demo_teacher_create_classroom.png)
![teacher_classroom_assignment_list](readme_assets/demo_teacher_classroom_assignment_list.png)
![teacher_assign_assignment](readme_assets/demo_teacher_assign_assignment_1.png)
![teacher_assign_assignment](readme_assets/demo_teacher_assign_assignment_2.png)
![teacher_assign_assignment](readme_assets/demo_teacher_assign_assignment_3.png)
![teacher_classroom_student](readme_assets/demo_teacher_classroom_student.png)
![teacher_assign_student](readme_assets/demo_teacher_assign_student.png)

#### Assignment
![teacher_assignment](readme_assets/demo_teacher_assignment_list.png)
![teacher_assignment](readme_assets/demo_teacher_assignment_create.png)
![teacher_assignment](readme_assets/demo_teacher_assignment_detail.png)
![teacher_assignment](readme_assets/demo_teacher_assignment_history.png)
![teacher_assignment](readme_assets/demo_teacher_assignment_history_detail.png)

---

### 5.3 Student
![student](readme_assets/demo_student_do_exercise_1.png)
![student](readme_assets/demo_student_do_exercise_2.png)

---

### 5.4 Admin
![admin](readme_assets/demo_admin_user_list.png)

---

### 5.5 User Profile
![user](readme_assets/demo_common_user_profile.png)
![user](readme_assets/demo_common_user_profile_edit.png)