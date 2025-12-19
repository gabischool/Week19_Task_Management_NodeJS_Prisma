import express from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskServices.js";

const router = express.Router();

/**
 * GET /api/tasks
 */
router.get("/tasks", async (req, res, next) => {
  try {
    const tasks = await getAllTasks();
    res.json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/tasks/:id
 */
router.get("/tasks/:id", async (req, res, next) => {
  try {
    const task = await getTaskById(req.params.id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/tasks
 */
router.post("/tasks", async (req, res, next) => {
  try {
    const task = await createTask(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/tasks/:id
 */
router.put("/tasks/:id", async (req, res, next) => {
  try {
    const task = await updateTask(req.params.id, req.body);
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/tasks/:id
 */
router.delete("/tasks/:id", async (req, res, next) => {
  try {
    await deleteTask(req.params.id);
    res.json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
});

export default router; // ✅ THIS LINE FIXES THE ERROR
