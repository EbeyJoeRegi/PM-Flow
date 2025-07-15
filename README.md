#  PM Flow – Project Management Workflow Application

A role-based project management system with Admin, Manager, and Employee dashboards.Built using React.js, Vite, Bootstrap, React Router DOM, Spring Boot, and MySQL.
---

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
  
## Setup Instructions:
---
Follow these steps to set up and run the project locally:


## 1. Clone the Repository

git clone https://github.com/EbeyJoeRegi/PM-Flow<br>
cd PM-Flow<br>
cd Frontend<br>

## 2. Install Dependencies
   
Make sure you have Node.js installed.

npm install

## 3. Start the Development Server
   
npm run dev

This will start the app on http://localhost:5173 by default.

## 4. Environment Variables
   
If needed, create a .env file at the root:

VITE_API_BASE_URL=http://localhost:8080/api

## 5.Start MySQL Server

cd C:\MySQL\bin <br>
.\mysqld --defaults-file="C:\MySQL\my.ini" --console <br>

Login to MySQL CLI in a new terminal:<br>

cd C:\MySQL\bin<br>
.\mysql -u root -p<br>

Then create the database:<br>
CREATE DATABASE pmflow;<br>

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

## Tech Stack<br>
1.React.js<br>
2.Vite<br>
3.Bootstrap 5<br>
4.React Router DOM<br>
5.React Icons<br>
6.Toastify<br>
7.Spring Boot<br>
8.MySQL

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

