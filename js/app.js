// Task storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Current filter
let currentFilter = 'all';

// Current selected task for drawer
let selectedTaskId = null;

// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');
const countAll = document.getElementById('countAll');
const countActive = document.getElementById('countActive');
const countDone = document.getElementById('countDone');

// Drawer elements
const overlay = document.getElementById('overlay');
const taskDrawer = document.getElementById('taskDrawer');
const taskTitle = document.getElementById('taskTitle');
const subtaskList = document.getElementById('subtaskList');
const subtaskInput = document.getElementById('subtaskInput');
const addSubtaskBtn = document.getElementById('addSubtaskBtn');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const toggleCompleteBtn = document.getElementById('toggleCompleteBtn');
const taskStatus = document.getElementById('taskStatus');
const deleteTaskBtn = document.getElementById('deleteTaskBtn');
const closeDrawerBtn = document.getElementById('closeDrawerBtn');

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update task counts
function updateCounts() {
  const all = tasks.length;
  const active = tasks.filter(t => !t.completed).length;
  const done = tasks.filter(t => t.completed).length;
  
  countAll.textContent = all;
  countActive.textContent = active;
  countDone.textContent = done;
}

// Render task list based on filter
function renderTasks() {
  taskList.innerHTML = '';
  
  let filteredTasks = tasks;
  if (currentFilter === 'active') {
    filteredTasks = tasks.filter(t => !t.completed);
  } else if (currentFilter === 'done') {
    filteredTasks = tasks.filter(t => t.completed);
  }
  
  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.innerHTML = `
      <label class="task-label" onclick="event.stopPropagation()">
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
        <span class="task-text">${task.title}</span>
      </label>
      <button class="open-drawer-btn" data-id="${task.id}">⋮</button>
      <button class="delete-task-btn" data-id="${task.id}">×</button>
    `;
    taskList.appendChild(li);
  });
  
  // Attach checkbox event listeners
  document.querySelectorAll('.task-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      e.stopPropagation();
      const taskId = e.target.dataset.id;
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        task.completed = e.target.checked;
        saveTasks();
        renderTasks();
        updateCounts();
      }
    });
  });
  
  // Attach open drawer button event listeners
  document.querySelectorAll('.open-drawer-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const taskId = btn.dataset.id;
      openDrawer(taskId);
    });
  });
  
  // Also make task text clickable to open drawer
  document.querySelectorAll('.task-text').forEach(text => {
    text.addEventListener('click', (e) => {
      const taskId = e.target.closest('.task-item').querySelector('.task-checkbox').dataset.id;
      openDrawer(taskId);
    });
  });
  
  // Attach delete button event listeners
  document.querySelectorAll('.delete-task-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const taskId = btn.dataset.id;
      tasks = tasks.filter(t => t.id !== taskId);
      saveTasks();
      renderTasks();
      updateCounts();
    });
  });
}

// Add new task
function addTask() {
  const title = taskInput.value.trim();
  if (!title) return;
  
  const task = {
    id: Date.now().toString(),
    title: title,
    completed: false,
    subtasks: []
  };
  
  tasks.push(task);
  taskInput.value = '';
  saveTasks();
  renderTasks();
  updateCounts();
}

// Open drawer with task details
function openDrawer(taskId) {
  selectedTaskId = taskId;
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;
  
  // Initialize subtasks array if not exists
  if (!task.subtasks) {
    task.subtasks = [];
  }
  
  // Show drawer
  taskTitle.textContent = task.title;
  toggleCompleteBtn.textContent = task.completed ? '✔' : '○';
  taskStatus.textContent = task.completed ? 'Done' : 'In Progress';
  
  renderSubtasks();
  updateProgressBar();
  
  overlay.classList.remove('hidden');
  taskDrawer.classList.remove('hidden');
}

// Close drawer
function closeDrawer() {
  selectedTaskId = null;
  overlay.classList.add('hidden');
  taskDrawer.classList.add('hidden');
}

// Render subtasks in drawer
function renderSubtasks() {
  const task = tasks.find(t => t.id === selectedTaskId);
  if (!task) return;
  
  subtaskList.innerHTML = '';
  
  task.subtasks.forEach((subtask, index) => {
    const div = document.createElement('div');
    div.className = `subtask-item ${subtask.completed ? 'completed' : ''}`;
    div.innerHTML = `
      <label>
        <input type="checkbox" class="subtask-checkbox" ${subtask.completed ? 'checked' : ''} data-index="${index}">
        <span>${subtask.title}</span>
      </label>
      <button class="delete-subtask-btn" data-index="${index}">×</button>
    `;
    subtaskList.appendChild(div);
  });
  
  // Attach checkbox listeners
  document.querySelectorAll('.subtask-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const index = parseInt(e.target.dataset.index);
      task.subtasks[index].completed = e.target.checked;
      saveTasks();
      renderSubtasks();
      updateProgressBar();
    });
  });
  
  // Attach delete listeners
  document.querySelectorAll('.delete-subtask-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      task.subtasks.splice(index, 1);
      saveTasks();
      renderSubtasks();
      updateProgressBar();
    });
  });
}

// Update progress bar
function updateProgressBar() {
  const task = tasks.find(t => t.id === selectedTaskId);
  if (!task) return;
  
  const total = task.subtasks.length;
  const completed = task.subtasks.filter(s => s.completed).length;
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  
  progressBar.style.width = percentage + '%';
  progressText.textContent = `${completed} of ${total} subtasks completed`;
}

// Add subtask
function addSubtask() {
  const title = subtaskInput.value.trim();
  if (!title || !selectedTaskId) return;
  
  const task = tasks.find(t => t.id === selectedTaskId);
  if (!task) return;
  
  task.subtitles = task.subtasks || [];
  task.subtitles.push({
    id: Date.now().toString(),
    title: title,
    completed: false
  });
  
  subtaskInput.value = '';
  saveTasks();
  renderSubtasks();
  updateProgressBar();
}

// Toggle task complete from drawer
function toggleTaskComplete() {
  const task = tasks.find(t => t.id === selectedTaskId);
  if (!task) return;
  
  task.completed = !task.completed;
  toggleCompleteBtn.textContent = task.completed ? '✔' : '○';
  taskStatus.textContent = task.completed ? 'Done' : 'In Progress';
  
  saveTasks();
  renderTasks();
  updateCounts();
}

// Delete task from drawer
function deleteTaskFromDrawer() {
  if (!selectedTaskId) return;
  
  tasks = tasks.filter(t => t.id !== selectedTaskId);
  saveTasks();
  closeDrawer();
  renderTasks();
  updateCounts();
}

// Event Listeners
addTaskBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Filter buttons
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// Drawer event listeners
addSubtaskBtn.addEventListener('click', addSubtask);
subtaskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addSubtask();
  }
});
toggleCompleteBtn.addEventListener('click', toggleTaskComplete);
deleteTaskBtn.addEventListener('click', deleteTaskFromDrawer);
closeDrawerBtn.addEventListener('click', closeDrawer);
overlay.addEventListener('click', closeDrawer);

// Initial render
updateCounts();
renderTasks();