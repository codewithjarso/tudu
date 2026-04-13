// Task Storage Module - Handles all localStorage operations

const Storage = {
  KEY: 'tasks',
  
  // Load tasks from localStorage
  load() {
    return JSON.parse(localStorage.getItem(this.KEY)) || [];
  },
  
  // Save tasks to localStorage
  save(tasks) {
    localStorage.setItem(this.KEY, JSON.stringify(tasks));
  },
  
  // Add a new task
  addTask(tasks, title, dueDate = null) {
    const task = {
      id: Date.now().toString(),
      title: title,
      dueDate: dueDate,
      completed: false,
      subtasks: []
    };
    tasks.push(task);
    this.save(tasks);
    return tasks;
  },

  // Update task due date
  updateTaskDueDate(tasks, taskId, dueDate) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.dueDate = dueDate;
      this.save(tasks);
    }
    return tasks;
  },
  
  // Delete a task
  deleteTask(tasks, taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    this.save(tasks);
    return tasks;
  },
  
  // Toggle task completion
  toggleTask(tasks, taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.save(tasks);
    }
    return tasks;
  },
  
  // Set task completion status
  setTaskCompleted(tasks, taskId, completed) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = completed;
      this.save(tasks);
    }
    return tasks;
  },
  
  // Add a subtask to a task
  addSubtask(tasks, taskId, title) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      if (!task.subtasks) task.subtasks = [];
      task.subtasks.push({
        id: Date.now().toString(),
        title: title,
        completed: false
      });
      this.save(tasks);
    }
    return tasks;
  },
  
  // Toggle subtask completion
  toggleSubtask(tasks, taskId, subtaskIndex) {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.subtasks && task.subtasks[subtaskIndex]) {
      task.subtasks[subtaskIndex].completed = !task.subtasks[subtaskIndex].completed;
      this.save(tasks);
    }
    return tasks;
  },
  
  // Delete a subtask
  deleteSubtask(tasks, taskId, subtaskIndex) {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.subtasks) {
      task.subtasks.splice(subtaskIndex, 1);
      this.save(tasks);
    }
    return tasks;
  },
  
  // Get task counts
  getCounts(tasks) {
    return {
      all: tasks.length,
      active: tasks.filter(t => !t.completed).length,
      done: tasks.filter(t => t.completed).length
    };
  }
};

// Export for use in other modules
window.Storage = Storage;
