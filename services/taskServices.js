import prisma from "../lib/prisma.js";

// Get all tasks (with subtasks)
export async function getAllTasks() {
  return await prisma.task.findMany({
    include: { subtasks: true },
    orderBy: { createdAt: "desc" },
  });
}

// Get task by ID
export async function getTaskById(id) {
  try {
    const task = await prisma.task.findUnique({
      where: { id },
      include: { subtasks: true },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    return task;
  } catch (error) {
    throw new Error(`Error retrieving task: ${error.message}`);
  }
}

// Create new task (with subtasks)
export async function createTask(taskData) {
  try {
    // Convert kebab-case status to Prisma enum style
    const status =
      taskData.status === "in-progress" ? "in_progress" : taskData.status;

    // Convert dueDate if provided
    let dueDate = null;
    if (taskData.dueDate) {
      dueDate = new Date(taskData.dueDate);
    }

    const newTask = await prisma.task.create({
      data: {
        title: taskData.title,
        description: taskData.description,
        status,
        priority: taskData.priority,
        dueDate,
        assignedTo: taskData.assignedTo || null,
        subtasks: {
          create:
            taskData.subtasks?.map((sub) => ({
              title: sub.title,
              description: sub.description,
              completed: sub.completed || false,
            })) || [],
        },
      },
      include: {
        subtasks: true,
      },
    });

    return newTask;
  } catch (error) {
    throw new Error(`Error creating task: ${error.message}`);
  }
}

// Update task
export async function updateTask(id, updateData) {
  try {
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      throw new Error("Task not found");
    }

    if (updateData.status && updateData.status === "in-progress") {
      updateData.status = "in_progress";
    }

    if (updateData.dueDate) {
      updateData.dueDate = new Date(updateData.dueDate);
    }

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        subtasks: true,
      },
    });

    return task;
  } catch (error) {
    throw new Error(`Error updating task: ${error.message}`);
  }
}

// Delete task
export async function deleteTask(id) {
  try {
    const existingTask = await prisma.task.findUnique({
      where: { id },
      include: { subtasks: true },
    });

    if (!existingTask) {
      throw new Error("Task not found");
    }

    await prisma.task.delete({
      where: { id },
    });

    return existingTask;
  } catch (error) {
    throw new Error(`Error deleting task: ${error.message}`);
  }
}

// Create subtask
export async function createSubtask(taskId, subtaskData) {
  try {
    const subtask = await prisma.subtask.create({
      data: {
        title: subtaskData.title,
        description: subtaskData.description,
        completed: subtaskData.completed || false,
        taskId: taskId,
      },
    });

    return subtask;
  } catch (error) {
    throw new Error(`Error creating subtask: ${error.message}`);
  }
}

// Update subtask
export async function updateSubtask(id, updateData) {
  try {
    const subtask = await prisma.subtask.update({
      where: { id },
      data: updateData,
    });

    return subtask;
  } catch (error) {
    throw new Error(`Error updating subtask: ${error.message}`);
  }
}

// Delete subtask
export async function deleteSubtask(id) {
  try {
    const subtask = await prisma.subtask.delete({
      where: { id },
    });

    return subtask;
  } catch (error) {
    throw new Error(`Error deleting subtask: ${error.message}`);
  }
}
