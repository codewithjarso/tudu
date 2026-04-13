// App - Main application coordinator

// State
let tasks = [];
let currentFilter = 'all';
let selectedTaskId = null;

// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const dueDateInput = document.getElementById('dueDateInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const subtaskInput = document.getElementById('subtaskInput');
const addSubtaskBtn = document.getElementById('addSubtaskBtn');
const toggleCompleteBtn = document.getElementById('toggleCompleteBtn');
const deleteTaskBtn = document.getElementById('deleteTaskBtn');
const closeDrawerBtn = document.getElementById('closeDrawerBtn');
const overlay = document.getElementById('overlay');
const taskDueDate = document.getElementById('taskDueDate');

// Initialize
function init() {
  // Load tasks from storage
  tasks = Storage.load();
  
  // Initialize UI
  UI.init();
  
  // Render initial state
  render();
  
  // Setup event listeners
  setupEventListeners();
}

// Render task list and counts
function render() {
  UI.renderTaskList(tasks, currentFilter, handleToggleTask, handleDeleteTask, handleOpenDrawer);
  UI.updateCounts(Storage.getCounts(tasks));
}

// Handle add task
function handleAddTask() {
  const title = taskInput.value.trim();
  if (!title) return;
  
  const dueDate = dueDateInput.value || null;
  tasks = Storage.addTask(tasks, title, dueDate);
  taskInput.value = '';
  dueDateInput.value = '';
  render();
}

// Handle toggle task
function handleToggleTask(taskId, completed) {
  tasks = Storage.setTaskCompleted(tasks, taskId, completed);
  render();
}

// Handle delete task
function handleDeleteTask(taskId) {
  tasks = Storage.deleteTask(tasks, taskId);
  render();
}

// Handle open drawer
function handleOpenDrawer(taskId) {
  selectedTaskId = taskId;
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;
  
  UI.openDrawer(task);
  UI.renderSubtasks(task, handleToggleSubtask, handleDeleteSubtask);
  UI.updateProgressBar(task);
}

// Handle due date change in drawer
function handleDueDateChange(e) {
  if (!selectedTaskId) return;
  tasks = Storage.updateTaskDueDate(tasks, selectedTaskId, e.target.value || null);
  render();
}

// Handle close drawer
function handleCloseDrawer() {
  selectedTaskId = null;
  UI.closeDrawer();
}

// Handle toggle subtask
function handleToggleSubtask(subtaskIndex) {
  if (!selectedTaskId) return;
  tasks = Storage.toggleSubtask(tasks, selectedTaskId, subtaskIndex);
  
  const task = tasks.find(t => t.id === selectedTaskId);
  UI.renderSubtasks(task, handleToggleSubtask, handleDeleteSubtask);
  UI.updateProgressBar(task);
  render();
}

// Handle delete subtask
function handleDeleteSubtask(subtaskIndex) {
  if (!selectedTaskId) return;
  tasks = Storage.deleteSubtask(tasks, selectedTaskId, subtaskIndex);
  
  const task = tasks.find(t => t.id === selectedTaskId);
  UI.renderSubtasks(task, handleToggleSubtask, handleDeleteSubtask);
  UI.updateProgressBar(task);
}

// Handle add subtask
function handleAddSubtask() {
  const title = subtaskInput.value.trim();
  if (!title || !selectedTaskId) return;
  
  tasks = Storage.addSubtask(tasks, selectedTaskId, title);
  subtaskInput.value = '';
  
  const task = tasks.find(t => t.id === selectedTaskId);
  UI.renderSubtasks(task, handleToggleSubtask, handleDeleteSubtask);
  UI.updateProgressBar(task);
}

// Handle toggle task complete from drawer
function handleToggleTaskComplete() {
  if (!selectedTaskId) return;
  
  const task = tasks.find(t => t.id === selectedTaskId);
  if (!task) return;
  
  task.completed = !task.completed;
  Storage.save(tasks);
  UI.updateDrawerHeader(task);
  render();
}

// Handle delete task from drawer
function handleDeleteTaskFromDrawer() {
  if (!selectedTaskId) return;
  
  tasks = Storage.deleteTask(tasks, selectedTaskId);
  handleCloseDrawer();
  render();
}

// Setup event listeners
function setupEventListeners() {
  // Add task
  addTaskBtn.addEventListener('click', handleAddTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAddTask();
  });
  
  // Filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      render();
    });
  });
  
  // Drawer events
  addSubtaskBtn.addEventListener('click', handleAddSubtask);
  subtaskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAddSubtask();
  });
  toggleCompleteBtn.addEventListener('click', handleToggleTaskComplete);
  deleteTaskBtn.addEventListener('click', handleDeleteTaskFromDrawer);
  closeDrawerBtn.addEventListener('click', handleCloseDrawer);
  overlay.addEventListener('click', handleCloseDrawer);
  if (taskDueDate) taskDueDate.addEventListener('change', handleDueDateChange);
}

// Start the app
init();