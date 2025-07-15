#  PM Flow – Project Management Workflow Application

A role-based project management system with Admin, Manager, and Employee dashboards.Built using React.js, Vite, Bootstrap, React Router DOM, Spring Boot, and MySQL.


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
- Routing and navigation with React Router DOM
- Reusable components for Projects, Tasks, Users, and Chat
- Real-time-like UI feedback with Toastify (e.g., task updates)
- Dynamic filtering and sorting of Projects/Tasks
- Seamless integration with Spring Boot API using Axios/Fetch
- Protected routes and conditional rendering based on roles
- Form validations for login, registration, and task updates

## Prerequisites
| Tool                                                                                 | Description                                     |
| ------------------------------------------------------------------------------------ | ----------------------------------------------- |
| [Node.js](https://nodejs.org/)                                                       | JavaScript runtime for frontend (React + Vite)  |
| [npm](https://www.npmjs.com/)                                                        | Package manager (comes with Node.js)            |
| [Java JDK 17+](https://www.oracle.com/java/technologies/javase-jdk17-downloads.html) | Required for Spring Boot backend                |
| [MySQL Server](https://dev.mysql.com/downloads/mysql/)                               | Relational database for backend storage         |
| [Git](https://git-scm.com/downloads)                                                 | Version control for cloning the repository      |
| [Visual Studio Code](https://code.visualstudio.com/)                                 | Code editor with terminal and extension support |
| [Spring Tool Suite / IntelliJ / Eclipse](https://spring.io/tools)                    | IDE for managing Spring Boot backend            |

## Setup Instructions:

Follow these steps to set up and run the project locally:


## 1. Clone the Repository
```bash
git clone https://github.com/EbeyJoeRegi/PM-Flow

cd PM-Flow

cd Frontend
```
## 2. Install Dependencies
   
Make sure you have Node.js installed.
```bash
npm install
```
## 3. Start the Development Server
   ```bash
npm run dev
```
This will start the app on http://localhost:5173 by default.

## 4. Environment Variables
   
If needed, create a .env file at the root:

VITE_API_BASE_URL=http://localhost:8080/api

## 5.Start MySQL Server
```bash
cd C:\MySQL\bin

.\mysqld --defaults-file="C:\MySQL\my.ini" --console 
```
Login to MySQL CLI in a new terminal:<br>
```bash
cd C:\MySQL\bin

.\mysql -u root -p
```
Then create the database:
```bash
CREATE DATABASE pmflow;
```
## 6. Run Spring Boot Backend
Import the Project in Your IDE<br>
File → Import → Existing Maven Projects → Select PM-flow → Select Backend → Finish

File → Open → Select PM-flow → Select Backend 

Run the Spring Boot Application<br>
Locate PmflowBackendApplication.java, then:<br>
Right-click → Run as → Spring Boot App

The backend will start at:<br>
http://localhost:8080<br>

## 7. Frontend–Backend Connection
Ensure the frontend is configured to point to the backend API using the correct base URL.<br>
export const BASE_URL = "http://localhost:8080/api";


## Folder Structure

<summary><strong>Project Folder Structure</strong> (click to expand)</summary>

```bash
PM-Flow/
├── Backend/
│   ├── .classpath
│   ├── .factorypath
│   ├── .gitattributes
│   ├── .gitignore
│   ├── .project
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
│   ├── .mvn/
│   │   └── wrapper/
│   │       └── maven-wrapper.properties
│   ├── .settings/
│   │   ├── org.eclipse.core.resources.prefs
│   │   ├── org.eclipse.jdt.apt.core.prefs
│   │   ├── org.eclipse.jdt.core.prefs
│   │   ├── org.eclipse.m2e.core.prefs
│   │   └── org.springframework.ide.eclipse.prefs
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/pmflow/
│   │   │   │   ├── PmflowApplication.java
│   │   │   │   ├── controller/
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   ├── ChatController.java
│   │   │   │   │   ├── ProjectController.java
│   │   │   │   │   ├── TaskController.java
│   │   │   │   │   └── UserController.java
│   │   │   │   ├── dto/
│   │   │   │   │   ├── *.java (All request/response DTOs)
│   │   │   │   ├── entity/
│   │   │   │   │   ├── ChatMessage.java
│   │   │   │   │   ├── Project.java
│   │   │   │   │   ├── ProjectStatus.java
│   │   │   │   │   ├── Role.java
│   │   │   │   │   ├── Task.java
│   │   │   │   │   └── User.java
│   │   │   │   ├── enums/
│   │   │   │   │   ├── TaskPriority.java
│   │   │   │   │   └── TaskStatus.java
│   │   │   │   ├── repository/
│   │   │   │   │   ├── ChatMessageRepository.java
│   │   │   │   │   ├── ChatProjectRepository.java
│   │   │   │   │   ├── ProjectRepository.java
│   │   │   │   │   ├── RoleRepository.java
│   │   │   │   │   ├── TaskRepository.java
│   │   │   │   │   └── UserRepository.java
│   │   │   │   ├── security/
│   │   │   │   │   ├── JwtAuthFilter.java
│   │   │   │   │   ├── JwtService.java
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   └── TokenBlacklistService.java
│   │   │   │   └── service/
│   │   │   │       ├── AuthService.java
│   │   │   │       ├── ChatService.java
│   │   │   │       ├── ProjectService.java
│   │   │   │       ├── TaskService.java
│   │   │   │       ├── UserDetailsServiceImpl.java
│   │   │   │       └── UserService.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/java/com/example/pmflow/
│       └── PmflowApplicationTests.java
│   └── target/
│       ├── classes/
│       ├── generated-sources/
│       ├── generated-test-sources/
│       ├── test-classes/
│       └── META-INF/
├── Frontend/
│   ├── .env
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── vite.config.js
│   ├── node_modules/
│   ├── public/
│   │   └── logo/
│   │       ├── Logo.png
│   │       └── PM Flow.png
│   └── src/
│       ├── App.jsx
│       ├── config.jsx
│       ├── main.jsx
│       ├── api/
│       │   ├── adminApi.jsx
│       │   ├── commonApi.jsx
│       │   ├── managerApi.jsx
│       │   └── teamMemberApi.jsx
│       ├── components/
│       │   └── Pagination.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── NotFound.jsx
│       │   ├── Register.jsx
│       │   ├── admin/
│       │   │   ├── AdminDashboard.jsx
│       │   │   ├── ProjectDetails.jsx
│       │   │   ├── Projects.jsx
│       │   │   └── Users.jsx
│       │   ├── manager/
│       │   │   ├── CollaborationProjects.jsx
│       │   │   ├── ManagerDashboard.jsx
│       │   │   ├── managerProjectDetail.jsx
│       │   │   ├── managerProjects.jsx
│       │   │   ├── managerTaskDetail.jsx
│       │   │   └── ProjectChatPage.jsx
│       │   └── member/
│       │       ├── AssignedTasks.jsx
│       │       ├── MemberCollaboration.jsx
│       │       ├── MemberCollaborationProjects.jsx
│       │       ├── MemberDashboard.jsx
│       │       ├── MemberLayout.jsx
│       │       └── ProjectCollaboration.jsx
│       ├── redux/
│       │   ├── store.jsx
│       │   └── userSlice.jsx
│       ├── routes/
│       │   ├── AppRoutes.jsx
│       │   └── ProtectedRoute.jsx
│       ├── styles/
│       │   ├── Admin.css
│       │   ├── collaborationProjects.css
│       │   ├── Home.css
│       │   ├── login.css
│       │   ├── managerDashboard.css
│       │   ├── managerProjectDetail.css
│       │   ├── managerProjects.css
│       │   ├── managerTaskDetail.css
│       │   ├── Member.css
│       │   ├── memberchatpage.css
│       │   ├── notfound.css
│       │   ├── projectChatPage.css
│       │   ├── ProjectCollab.css
│       │   ├── Register.css
│       │   └── style.css
│       └── utils/
│           └── Helper.js

```

## Features

-  Role-based Authentication (Admin, Manager, Employee)
-  Task Assignment and Filtering
-  Project Progress Overview
-  Real-time Collaboration Chat
-  Project & User Management
  
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

## Chat Module API Endpoints
| **Method** | **Endpoint**                                                             | **Access**      | **Description**        |
| ---------- | ------------------------------------------------------------------------ | --------------- | ---------------------- |
| POST       | `/api/chat/private/sender/{sid}/receiver/{rid}/project/{pid}/task/{tid}` | Sender/Receiver | Send private message   |
| POST       | `/api/chat/group/sender/{sid}/project/{pid}`                             | Project Users   | Send group message     |
| GET        | `/api/chat/private/sender/{sid}/receiver/{rid}/project/{pid}/task/{tid}` | Sender/Receiver | Fetch private messages |
| GET        | `/api/chat/group/project/{pid}`                                          | Project Users   | Get group chat         |
| GET        | `/api/chat/assigned-projects`                                            | Authenticated   | Get assigned projects  |

## Future Scope
- Add WebSocket (STOMP) for real-time messaging
- Email/notification integration
- Drag-and-drop UI for task reordering and project management
- Accessibility improvements for keyboard navigation and screen readers

