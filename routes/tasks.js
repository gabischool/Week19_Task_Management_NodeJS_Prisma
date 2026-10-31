import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

// findMany, findUnique, create, update, delete

// GET /api/tasks - Get all tasks
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: { user: true },
      orderBy: { id: "asc" },
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/tasks/:id", async (req, res) => {
  try {
    // The id from the URL is a string, so we turn it into a number
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id: Number(id) },
      include: { user: true },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/tasks - Create a task
router.post("/tasks", async (req, res) => {
  try {

    const { title, description, completed, userId } = req.body; 

    if ( !title || !userId) {
      return res.status(400).json ({ error: "Title and userId are required", });
    }

  const newTask = await prisma.task.create({ 
    data:{
      title,
      description,
      completed: completed ?? false,
      userId: Number(userId)
    },
  });

  res.status(201).json(newTask);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }

});

// PUT /api/tasks/:id - Update a task
router.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const updatTask = await prisma.task.update({
      where: {id: Number(id)},
      data: {
        title,
        description,
        completed,
      },
    });
    res.json(updatTask)
    
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete("/tasks/:id", async (req, res) => {
  try {
    // TODO: Get the id.
    // TODO: Use Prisma to delete the task and return it.

    const {id } = req.params;
    const deletTask = await prisma.task.delete({
  where: { id: Number(id) },

    });

    res.json(deletTask);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(500).json({ error: error.message });
  }
});

export default router;
