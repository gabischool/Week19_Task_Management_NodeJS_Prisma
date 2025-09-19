import express from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskServices.js";

const router = express.Router();

// GET /api/tasks - Get all tasks
// This route handles GET requests to /api/tasks
// req = request object (contains data sent by client)
// res = response object (used to send data back to client)
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await getAllTasks();

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/tasks/:id - Get task by ID
// :id is a route parameter - it captures the value from the URL
// Example: /api/tasks/1 will set req.params.id = "1"
//comment1
router.get("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extract the ID from the URL
    const task = await getTaskById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      }); // 404 = Not Found
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    }); // 500 = Server Error
  }
});

// POST /api/tasks - Create new task
// POST requests are used to create new resources
// req.body contains the data sent in the request body
router.post("/tasks", async (req, res) => {
  try {
    const taskData = req.body;
    const newTask = await createTask(taskData);

    res.status(201).json({
      success: true,
      data: newTask,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    }); // 400 = Bad Request for validation errors
  }
});

// PUT /api/tasks/:id - Update task
// PUT requests are used to update existing resources
// The entire resource is replaced with the new data
router.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedTask = await updateTask(id, updateData);

    res.json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    if (error.message === "Task not found") {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
});

// DELETE /api/tasks/:id - Delete task
// DELETE requests are used to remove resources
router.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await deleteTask(id);

    res.json({
      success: true,
      data: deletedTask,
    });
  } catch (error) {
    if (error.message === "Task not found") {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
});

export default router;
