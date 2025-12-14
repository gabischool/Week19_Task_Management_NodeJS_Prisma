import prisma from "../lib/prisma.js";

// Simpler approach - just get all tasks
// GET all tasks for a specific user
export async function getAllTasks(userId) {
  return await prisma.task.findMany({
    where: { userId },
    include: { subtasks: true },
    orderBy: { createdAt: "desc" },
  });
}

// Get task by ID
export async function getTaskById(id, userId) {
  try {
    // TODO: Check if task exists
    const task = await prisma.task.findFirst({
      where: {
        id,
        userId,
      },
      include: { subtasks: true },
    });

    // TODO: If not, throw an error
    if (!task) {
      throw new Error("Task not found");
    }

    // TODO: If it does, return the task
    return task;
  } catch (error) {
    throw new Error(`Error retrieving task: ${error.message}`);
  }
}

// Create new task
export async function createTask(taskData, userId) {
  try {
    // Convert status from kebab-case to snake_case for Prisma enum
    const status =
      taskData.status === "in-progress" ? "in_progress" : taskData.status;

    // TODO: Create the new task where all the task data is in "taskData",
    // also create the subtasks with the data in "taskData.subtasks".
    // Return the created task and its subtasks using the include option.
    const task = await prisma.task.create({
      data: {
        title: taskData.title,
        description: taskData.description,
        status: status,
        priority: taskData.priority,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
        assignedTo: taskData.assignedTo,
        userId: userId,
        subtasks: {
          create: taskData.subtasks || [],
        },
      },
      include: {
        subtasks: true,
      },
    });

    return task;
  } catch (error) {
    throw new Error(`Error creating task: ${error.message}`);
  }
}

// Update task
export async function updateTask(id, updateData, userId) {
  try {
    // Check if task exists
    const existingTask = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existingTask) {
      throw new Error("Task not found");
    }

    // Convert status from kebab-case to snake_case for Prisma enum
    if (updateData.status && updateData.status === "in-progress") {
      updateData.status = "in_progress";
    }

    // Handle dueDate conversion
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
export async function deleteTask(id, userId) {
  try {
    // Check if task exists
    const existingTask = await prisma.task.findFirst({
      where: { id, userId },
      include: {
        subtasks: true,
      },
    });

    if (!existingTask) {
      throw new Error("Task not found");
    }

    // Delete the task (subtasks will be deleted automatically due to cascade)
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
