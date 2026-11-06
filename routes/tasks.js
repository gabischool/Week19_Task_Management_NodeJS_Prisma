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

// GET /api/tasks/:id - Get one task
// Example: /api/tasks/1 sets req.params.id to "1"
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

   // TODO: Get title, description, completed, and userId.
    // TODO: Make sure the required fields are present.
    // TODO: Use Prisma to create the task and return it.
// POST /api/tasks - Create a task
router.post("/tasks", async (req, res) => {
  try {
    const {title,description,completed,userId } = req.body 
    if (! title || userId === undefined || userId === null) 
    {
      return res.status(400).json({
        error:"title and userId are required",
      });
    }
    // new task 
    const newTask = await prisma.task.create({
      data:{
        title,
        description,
        completed: completed  ?? false,
        userId: Number (userId),
      },
      include : {user: true},
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/tasks/:id - Update a task
router.put("/tasks/:id", async (req, res) => {
  try {
    // TODO: Get the id, title, description, and completed.
    // TODO: Use Prisma to update the task and return it.
const {id} = req.params;
const {title,description,completed } = req.body;
const updatedTask = await prisma.task.update({
  where: {  id : Number(id) },
  data: {
     title,
        description,
        completed,
      },

})
res.json(updatedTask);
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
const {id} = req.params
 const  deletedTask = await prisma.task.delete ({
  where: {  id : Number (id) },
  
    });
      res.json(deletedTask);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(500).json({ error: error.message });
  }
});

export default router;
