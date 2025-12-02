import prisma from '../lib/prisma.js';

// Helper function for consistency
const convertToPrismaStatus = (status) => {
  if (status === 'in-progress') return 'in_progress';
  return status;
};

// Simpler approach - just get all tasks
export async function getAllTasks() {
  return await prisma.task.findMany({
    include: {
      subtasks: true
    },
    orderBy: {
      createdAt: 'desc' // Use string literal for 'desc'
    },
  });
}

// Get task by ID
export async function getTaskById(id) {
  try {
    // Check if task exists
    const task = await prisma.task.findUnique({
      where: { id },
      include: { subtasks: true }, // Include subtasks for a complete view
    });

    // If not, throw an error
    if (!task) {
      throw new Error('Task not found');
    }

    // If it does, return the task
    return task;

  } catch (error) {
    throw new Error(`Error retrieving task: ${error.message}`);
  }
}

// Create new task
export async function createTask(taskData) {
  try {
    // Convert status from kebab-case to snake_case for Prisma enum
    const status = convertToPrismaStatus(taskData.status);

    // Create the new task and its subtasks using a nested write
    const newTask = await prisma.task.create({
      data: {
        ...taskData, // Spread other task data (title, description, dueDate, etc.)
        status,
         subtasks: {
           create: taskData.subtasks || [], // Use 'create' to connect and create subtasks simultaneously
         },
       },
       include: {
         subtasks: true, // Return the created task and its subtasks using the include option.
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
    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });
    if (!existingTask) {
      throw new Error('Task not found');
    }

    // Convert status from kebab-case to snake_case for Prisma enum
    if (updateData.status) {
      updateData.status = convertToPrismaStatus(updateData.status);
    }
    
    // Handle dueDate conversion
    if (updateData.dueDate) {
      updateData.dueDate = new Date(updateData.dueDate);
    }

    // Note: This function only updates the 'task' itself, not its subtasks.
    // Handling nested updates for subtasks within a single `updateTask` call
    // often requires more complex logic or separate function calls (like updateSubtask).
      console.log(updateData)
    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      // include: {
      //   subtasks: true,
      // },
    });
    return task;
  } catch (error) {
    throw new Error(`Error updating task: ${error.message}`);
  }
}

// Delete task
export async function deleteTask(id) {
  try {
    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id },
      // include: {
      //   subtasks: true,
      // },
    });
    if (!existingTask) {
      throw new Error('Task not found');
    }

    // Delete the task (subtasks will be deleted automatically due to cascade)
    await prisma.task.delete({
      where: { id },
    });
    
    return existingTask; // Return the deleted object

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
