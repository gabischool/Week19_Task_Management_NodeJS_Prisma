import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

// findMany, findUnique, create, update, delete

// GET /api/users - Get all users
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "asc" },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users/:id/tasks - Get all tasks for one user
router.get("/:id/tasks", async (req, res) => {
  try {
    // TODO: Get the id.
    // TODO: Use Prisma to get all tasks for that user and return them.

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users/:id - Get one user
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/users - Create a user
router.post("/", async (req, res) => {
  try {
    // Step 1: Get the information of the user
    const { name, email } = req.body;

    // Step 2: Verify the required information
    if (!name || !email) {
      return res.status(400).json({ error: "Missing Required fields" });
    }

    // Step 3: Create the user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Email already exists" });
    }

    res.status(400).json({ error: error.message });
  }
});

// PUT /api/users/:id - Update a user
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        name,
        email,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }

    if (error.code === "P2002") {
      return res.status(400).json({ error: "Email already exists" });
    }

    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/users/:id - Delete a user
// Their tasks are deleted with them once the Task relation is set up that way
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.json(deletedUser);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(500).json({ error: error.message });
  }
});

export default router;
