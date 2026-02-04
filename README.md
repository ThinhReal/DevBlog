# 🚀 DevBlog - MERN Knowledge Manager
A personal technical blog system built with the MERN stack and TypeScript. This Website is a place for uesr to store and keep track all their knowledge.

Status: 🚧 Work In Progress

## 🏗 Architecture & Design
Decoupled Architecture: Separate client/ (React + Vite) and server/ (Node.js + Express) folders for scalability.

Communication: RESTful API using JSON.

Database: Document-oriented storage with MongoDB & Mongoose.

## 🛠 Tech Stack
Frontend: React, TypeScript, Tailwind CSS.

Backend: Node.js, Express, TypeScript.

Database: MongoDB Atlas.

Tooling: concurrently, ts-node-dev, dotenv.

## 🧩 Feature-Based Architecture
The project follows a Feature-Driven organization to ensure scalability and clean separation of concerns:

Encapsulation: Each domain (e.g., Algorithm, Data Structure, Git, Web Development,...) contains its own dedicated components, logic, and types.

Scalability: New features can be added as independent modules without cluttering the global directory.

Maintainability: Easier to locate and update code related to specific business logic.

## 🚀 Quick Start
Install: npm install in both client and server folders.

Env: Create .env in server/ with MONGODB_URI.

Run: Execute npm run dev from the root.

Author: Nguyen Van Thinh – RMIT University IT Student
