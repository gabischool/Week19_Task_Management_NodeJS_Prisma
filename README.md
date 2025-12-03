# Week 19: Task Management API using Prisma ORM with Supabase

## RESTful API Development and CRUD Operations

## Introduction

- You have learned the basics of Node.js and Express.js, now let's test your knowledge of how to setup API endpoints with this Task Management project using Prisma ORM and Supabase database.

### Task 1: Project Setup

1. Fork and Clone this project repository in your terminal
2. CD into the project base directory `cd Week19_Task_Management_NodeJS_Prisma`
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory with your Supabase database URL
5. Complete the Prisma schema and service functions (see tasks below)
6. Generate Prisma client and push schema to database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
7. Start the server:
   ```bash
   npm run dev
   ```
8. The server will run on `http://localhost:3000`

### Task 2: Understanding the Current Implementation

The project currently has a basic task management API with the following structure:

#### Current API Endpoints

**Main Task Operations:**

- `GET /api/tasks` - Get all tasks (Already implemented)
- `GET /api/tasks/:id` - Get task by ID (Already implemented)
- `POST /api/tasks` - Create new task (Already implemented)
- `PUT /api/tasks/:id` - Update entire task (Already implemented)
- `DELETE /api/tasks/:id` - Delete specific task (Already implemented)

**Note:** The routes are already implemented. You need to complete the underlying service functions and Prisma schema.

#### Data Structure

Each task has the following structure:

```json
{
  
  "title": "Task Title",
  "description": "Task description",
  "status": "pending",
  "priority": "low",
  "dueDate": "2024-01-15",
  "assignedTo": "John Doe",
  "subtasks": [
    {
      
      "title": "Subtask Title",
      "description": "Subtask description",
      "completed": false
    }
  ],
  

}
```

### Task 3: MVP Requirements (Minimum Viable Product)

You need to complete the following:

#### 1. Complete Prisma Schema - `prisma/schema.prisma`

**Location:** `prisma/schema.prisma`

The schema file is partially completed with TODO comments. You need to complete the following models and enums:

**Subtask Model:**

```prisma
model Subtask {
  id          String   @id @default(cuid())
  title       String
  description String
  completed   Boolean  @default(false)
  taskId      String
  task        Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("subtasks")
}
```

**TaskStatus Enum:**

```prisma
enum TaskStatus {
  pending
  in_progress
  completed
  cancelled
}
```

**Priority Enum:**

```prisma
enum Priority {
  low
  medium
  high
  urgent
}
```

#### 2. Configure Environment Variables - `.env`

**Location:** `.env`

- Add your Supabase database URL
- Set the application port and environment

#### 3. Complete getTaskById Function - `services/taskServices.js`

**Location:** `services/taskServices.js` - getTaskById function

The function has TODO comments that need to be implemented:

- Check if task exists using Prisma
- If not found, throw an error
- If found, return the task with subtasks included

#### 4. Complete createTask Function - `services/taskServices.js`

**Location:** `services/taskServices.js` - createTask function

The function has TODO comments that need to be implemented:

- Create the new task using Prisma with all task data from taskData
- Create subtasks if provided in taskData.subtasks
- Return the created task with subtasks included using the include option

### Task 4: Testing Your Implementation

You can use Postman or curl to test your endpoints.

## Task 5: Stretch Goals

### Add Task Filtering

**Objective:** Add filtering capabilities to the GET /api/tasks endpoint.

**Requirements:**

1. **Update the getAllTasks function** in `services/taskServices.js` to accept filters
2. **Add query parameter support** for filtering by status, priority, or assignedTo
3. **Implement search functionality** for task titles
4. **Add pagination** for large datasets

#### Add Task Categories

**Objective:** Add category support to tasks.

**Requirements:**

1. **Create a Category model** in the Prisma schema
2. **Add category relationship** to tasks
3. **Update the Task model** to include categoryId
4. **Implement category-based filtering**

## Learning Objectives

By completing this project, you will demonstrate understanding of:

1. **Prisma ORM Setup** - Database schema design and Prisma client configuration
2. **Supabase Integration** - Cloud database setup and connection
3. **RESTful API Design** - Proper endpoint naming and HTTP methods
4. **Data Validation** - Input validation and sanitization using Prisma
5. **Error Handling** - HTTP status codes and error responses
6. **Express.js Routing** - Route parameters and query strings
7. **Async/Await** - Handling asynchronous database operations
8. **Service Layer Architecture** - Separating business logic from routes

## Submission Format

- [ ] Complete the Prisma schema with all required models and relationships (Subtask model, TaskStatus enum, Priority enum)
- [ ] Configure environment variables with Supabase credentials
- [ ] Complete getTaskById function with proper error handling and task existence checks
- [ ] Complete createTask function with validation and subtask support
- [ ] Test all endpoints using curl or Postman
- [ ] Optional: Implement stretch goals with filtering and categories

## Getting Help

1. **Check the existing code** - Study the implemented functions for patterns
2. **Read Prisma documentation** - Understand the Prisma client methods
3. **Check Supabase dashboard** - Verify your database connection
4. **Test frequently** - Test each function as you build it
5. **Ask questions** - Don't hesitate to ask for clarification

Good luck with your implementation! 🚀
