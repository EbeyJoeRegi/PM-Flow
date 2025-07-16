#  PM Flow – Project Management Workflow Application

PM-Flow is a modern, web-based application designed to help teams efficiently manage and track their projects from inception to completion. It will provide functionalities for task management, team collaboration, progress monitoring, and reporting, all in real-time. This project will expose students to various real-world scenarios, including concurrent user interactions, data persistence, secure authentication, and a responsive user interface.


## Project Requirements

## Functional Requirements(Backend)

- JWT-based login and registration
- Role-based access for ADMIN, PROJECT_MANAGER, and MEMBER
- Password encryption using BCrypt
- CRUD operations on Projects and Tasks
- Chat Module with Private and Group Chat
- SLF4J logging
- JUnit tests using MockMvc

## Functional Requirements (Frontend)

- Role-based login and dashboard navigation (Admin, Manager, Employee)
- Interactive UI using React.js, Vite, and Bootstrap 5
- Reusable components for Projects, Tasks, Users, and Chat
- Real-time-like UI feedback with Toastify (e.g., task updates)
- Dynamic filtering and sorting of Projects/Tasks
- Seamless integration with Spring Boot API using Axios
- Protected routes and conditional rendering based on roles
- Form validations for login, registration, and task updates

## Prerequisites
| Tool                                                                                   | Description                                                                 |
|----------------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| [Node.js](https://nodejs.org/)                                                         | JavaScript runtime environment required to run and build the React + Vite frontend. |
| [npm](https://www.npmjs.com/)                                                          | Node package manager used to install frontend dependencies like React, Axios, Redux, etc. |
| [Java JDK 17+](https://www.oracle.com/java/technologies/javase-jdk17-downloads.html)   | Required to compile and run the Spring Boot backend services.              |
| [MySQL Server](https://dev.mysql.com/downloads/mysql/)                                 | Relational database used for storing users, projects, tasks, and chat data. |
| [Git](https://git-scm.com/downloads)                                                   | Version control system used to clone, track, and manage the project repository. |
| [Visual Studio Code](https://code.visualstudio.com/)                                   | Code editor for writing frontend code (React), supports terminal and extensions. |
| [Spring Tool Suite](https://spring.io/tools)                      | IDE used for developing and managing the Spring Boot backend (Java + Maven). |

## Setup Instructions:

Follow these steps to set up and run the project locally:


## 1. Clone the Repository
```bash
git clone https://github.com/EbeyJoeRegi/PM-Flow
```
```bash
cd PM-Flow
```
## 2. Set Up the Frontend
```bash
cd Frontend
```
  Install Dependencies
```bash
npm install
```
Start the Development Server
   ```bash
npm run dev
```
This will start the app on http://localhost:5173 by default.

## 3. Environment Variables
   
create a .env file at the root
```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

## 4. Open the Backend in Eclipse 
Go to File → Import → Existing Maven Project

Select the Backend folder inside the PM-Flow project

## 5.Create MySQL Database
Open the MySQL terminal or MySQL Workbench and run:
```bash
CREATE DATABASE pmflow;
```
```bash
USE pmflow;
```
```bash
INSERT INTO user (email, first_name, last_name, password_hash, role, username) VALUES ('admin@incture.com', 'Admin', 'PM FLOW', '$2a$10$2e55q3vpUrxSzTjZIXdwp.c9UaTlut6lZiSctLbhDsyCia.NwAibi', 'ADMIN', 'admin');
```
## 6. Configure application.properties
File location: src/main/resources/application.properties

Update it with your MySQL credentials:
```bash
spring.datasource.url=jdbc:mysql://localhost:3306/pmflow
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
```

## 7. Run the Backend Application
In Eclipse:

Right-click on PmflowApplication.java

Choose: Run As → Spring Boot Application

Console output should include:
Started PmflowApplication in ... seconds

Backend will be available at: http://localhost:8080

### NOTE : 
The Manager role is not available by default. An Admin must promote a member to the Manager role.<br>

Default Admin Credentials:<br>
-	Email: admin@incture.com<br>
-	Password: PASS@word123<br>


## Folder Structure

<summary><strong>Project Folder Structure</strong> (click to expand)</summary>

```bash
├── Logo.png
│ │ └── PM Flow.png
│ │
│ └── src/
│ ├── App.jsx
│ ├── config.jsx
│ ├── main.jsx
│ │
│ ├── api/
│ │ ├── adminApi.jsx
│ │ ├── commonApi.jsx
│ │ ├── managerApi.jsx
│ │ └── teamMemberApi.jsx
│ │
│ ├── components/
│ │ └── Pagination.jsx
│ │
│ ├── pages/
│ │ ├── CollaborationProjects.jsx
│ │ ├── Home.jsx
│ │ ├── Login.jsx
│ │ ├── NotFound.jsx
│ │ ├── ProjectChatPage.jsx
│ │ ├── Register.jsx
│ │ │
│ │ ├── admin/
│ │ │ ├── AdminDashboard.jsx
│ │ │ ├── ProjectDetails.jsx
│ │ │ ├── Projects.jsx
│ │ │ └── Users.jsx
│ │ │
│ │ ├── manager/
│ │ │ ├── ManagerDashboard.jsx
│ │ │ ├── managerProjectDetail.jsx
│ │ │ ├── managerProjects.jsx
│ │ │ └── managerTaskDetail.jsx
│ │ │
│ │ └── member/
│ │ ├── AssignedTasks.jsx
│ │ ├── MemberDashboard.jsx
│ │ └── ProjectCollaboration.jsx
│ │
│ ├── redux/
│ │ ├── store.jsx
│ │ └── userSlice.jsx
│ │
│ ├── routes/
│ │ ├── AppRoutes.jsx
│ │ └── ProtectedRoute.jsx
│ │
│ ├── styles/
│ │ ├── Admin.css
│ │ ├── collaborationProjects.css
│ │ ├── Home.css
│ │ ├── login.css
│ │ ├── managerDashboard.css
│ │ ├── managerProjectDetail.css
│ │ ├── managerProjects.css
│ │ ├── managerTaskDetail.css
│ │ ├── Member.css
│ │ ├── notfound.css
│ │ ├── projectChatPage.css
│ │ ├── ProjectCollab.css
│ │ ├── Register.css
│ │ └── style.css
│ │
│ └── utils/
│ └── Helper.js
│
├── Backend/
│ ├── pom.xml
│ ├── mvnw
│ ├── mvnw.cmd
│ ├── HELP.md
│ └── target/
│ ├── src/
│ │ ├── main/
│ │ │ ├── java/
│ │ │ │ └── com/example/pmflow/
│ │ │ │ ├── PmflowApplication.java
│ │ │ │ │
│ │ │ │ ├── controller/
│ │ │ │ │ ├── AuthController.java
│ │ │ │ │ ├── ChatController.java
│ │ │ │ │ ├── ProjectController.java
│ │ │ │ │ ├── TaskController.java
│ │ │ │ │ └── UserController.java
│ │ │ │ │
│ │ │ │ ├── dto/
│ │ │ │ │ ├── AdminUpdateTaskRequest.java
│ │ │ │ │ ├── AdminUpdateUserRequest.java
│ │ │ │ │ ├── AuthRequest.java
│ │ │ │ │ ├── AuthResponse.java
│ │ │ │ │ ├── ChatRequestDTO.java
│ │ │ │ │ ├── ChatResponseDTO.java
│ │ │ │ │ ├── ChatSummaryDTO.java
│ │ │ │ │ ├── MemberProjectDTO.java
│ │ │ │ │ ├── ProjectCreateRequestDTO.java
│ │ │ │ │ ├── ProjectDetailDTO.java
│ │ │ │ │ ├── ProjectSummaryDTO.java
│ │ │ │ │ ├── ProjectUpdateRequestDTO.java
│ │ │ │ │ ├── RegisterRequest.java
│ │ │ │ │ ├── StatusEndDateUpdateDTO.java
│ │ │ │ │ ├── TaskRequest.java
│ │ │ │ │ ├── TaskResponse.java
│ │ │ │ │ ├── TeamMemberDTO.java
│ │ │ │ │ ├── UpdateTaskRequest.java
│ │ │ │ │ └── UserDTO.java
│ │ │ │ │
│ │ │ │ ├── entity/
│ │ │ │ │ ├── ChatMessage.java
│ │ │ │ │ ├── Project.java
│ │ │ │ │ ├── ProjectStatus.java
│ │ │ │ │ ├── Role.java
│ │ │ │ │ ├── Task.java
│ │ │ │ │ └── User.java
│ │ │ │ │
│ │ │ │ ├── enums/
│ │ │ │ │ ├── TaskPriority.java
│ │ │ │ │ └── TaskStatus.java
│ │ │ │ │
│ │ │ │ ├── repository/
│ │ │ │ │ ├── ChatMessageRepository.java
│ │ │ │ │ ├── ChatProjectRepository.java
│ │ │ │ │ ├── ProjectRepository.java
│ │ │ │ │ ├── RoleRepository.java
│ │ │ │ │ ├── TaskRepository.java
│ │ │ │ │ └── UserRepository.java
│ │ │ │ │
│ │ │ │ ├── security/
│ │ │ │ │ ├── JwtAuthFilter.java
│ │ │ │ │ ├── JwtService.java
│ │ │ │ │ ├── SecurityConfig.java
│ │ │ │ │ └── TokenBlacklistService.java
│ │ │ │ │
│ │ │ │ └── service/
│ │ │ │ ├── AuthService.java
│ │ │ │ ├── ChatService.java
│ │ │ │ ├── ProjectService.java
│ │ │ │ ├── TaskService.java
│ │ │ │ ├── UserDetailsServiceImpl.java
│ │ │ │ └── UserService.java
│ │ │ │
│ │ │ └── resources/
│ │ │ ├── static/
│ │ │ ├── templates/
│ │ │ └── application.properties
│ │
│ └── test/
│ └── java/
│ └── com/example/pmflow/
│ ├── PmflowApplicationTests.java
│ └── controller/
│ ├── AuthControllerTest.java
│ ├── ChatControllerTest.java
│ ├── ProjectControllerTest.java
│ ├── TaskControllerTest.java
│ └── UserControllerTest.java

```

## Features

-  Role-based Authentication (Admin, Manager, Employee)
-  Task Assignment and Filtering
-  Project Progress Overview
-  Real-time Collaboration Chat
-  Project & User Management

## Screenshots
###  Login Page
<img width="1600" height="600" alt="login" src="Screenshots\Login.png" />

###  Admin Dashboard
<img width="1600" height="600" alt="admin" src="Screenshots\Admin\DashBoard.png" />

###  Manager Dashboard
<img width="1600" height="845" alt="manager" src="Screenshots\Manager\Dashboard.png" />

###  Member Dashboard
<img width="1600" height="600" alt="member" src="Screenshots\Member\Dashboard.png" />

## Database Design

1.USERS

- id (BIGINT, PK, Auto Increment)
- username (VARCHAR, UNIQUE)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR, NOT NULL)
- role (ENUM: ADMIN, PROJECT_MANAGER, MEMBER)

2.PROJECTS

- id (BIGINT, PK)
- name (VARCHAR)
- description (TEXT)
- status (ENUM)
- start_date (DATE)
- end_date (DATE)
- manager_id (BIGINT, FK → users.id)
- PROJECT_TEAM_MEMBERS (JOIN TABLE)
- project_id (BIGINT, FK, PK)
- user_id (BIGINT, FK, PK)

3.TASKS

- id (BIGINT, PK)
- name (VARCHAR)
- description (TEXT)
- due_date (DATETIME)
- priority (ENUM)
- status (ENUM)
- project_id (BIGINT, FK)
- assignee_id (BIGINT, FK)

4.CHAT_MESSAGES

- id (BIGINT, PK)
- sender_id (BIGINT, FK)
- receiver_id (BIGINT, FK, Nullable)
- project_id (BIGINT, FK)
- task_id (BIGINT, FK)
- content (TEXT)
- is_group (BOOLEAN)
- timestamp (DATETIME)

## Role-Based Access
| **Role**        | **Access Level**       |
| --------------- | ---------------------- |
| Admin           | Full access            |
| Project Manager | Access to own projects |
| Member          | Assigned tasks only    |

## Logging & Testing
- SLF4J logging in controller and service layers
- JUnit tests using @WebMvcTest and MockMvc
- Postman used for endpoint testing

## Future Scope
- Add WebSocket (STOMP) for real-time messaging
- Email/notification integration
- Drag-and-drop UI for task reordering and project management
- Accessibility improvements for keyboard navigation and screen readers
- Dark Mode Support - Dark/light theme toggle for better accessibility and user preference.

