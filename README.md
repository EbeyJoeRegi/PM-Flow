#  PM Flow – Project Management Workflow Application

A role-based project management system with Admin, Manager, and Employee dashboards.
Built using React.js, Vite, Bootstrap, and React Router DOM.
---

## Setup Instructions:
Follow these steps to set up and run the project locally:
---

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
You’ll be prompted to enter the MySQL root password.<br>
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


