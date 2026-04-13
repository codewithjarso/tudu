// UI Module - Handles all UI rendering

const UI = {
  // DOM Elements cache
  elements: {},
  
  // Initialize DOM element references
  init() {
    this.elements.taskList = document.getElementById('taskList');
    this.elements.countAll = document.getElementById('countAll');
    this.elements.countActive = document.getElementById('countActive');
    this.elements.countDone = document.getElementById('countDone');
    this.elements.overlay = document.getElementById('overlay');
    this.elements.taskDrawer = document.getElementById('taskDrawer');
    this.elements.taskTitle = document.getElementById('taskTitle');
    this.elements.subtaskList = document.getElementById('subtaskList');
    this.elements.progressBar = document.getElementById('progressBar');
    this.elements.progressText = document.getElementById('progressText');
    this.elements.toggleCompleteBtn = document.getElementById('toggleCompleteBtn');
    this.elements.taskStatus = document.getElementById('taskStatus');
    this.elements.taskDueDate = document.getElementById('taskDueDate');
  },
  
  // Update task counts display
  updateCounts(counts) {
    if (this.elements.countAll) this.elements.countAll.textContent = counts.all;
    if (this.elements.countActive) this.elements.countActive.textContent = counts.active;
    if (this.elements.countDone) this.elements.countDone.textContent = counts.done;
  },
  
  // Format date for display
  formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  },

  // Render task list based on filter
  renderTaskList(tasks, filter, onToggle, onDelete, onOpenDrawer) {
    if (!this.elements.taskList) return;
    
    this.elements.taskList.innerHTML = '';
    
    let filteredTasks = tasks;
    if (filter === 'active') {
      filteredTasks = tasks.filter(t => !t.completed);
    } else if (filter === 'done') {
      filteredTasks = tasks.filter(t => t.completed);
    }
    
    filteredTasks.forEach(task => {
      const dueDateHtml = task.dueDate ? `<span class="task-due-date">${this.formatDate(task.dueDate)}</span>` : '';
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      li.innerHTML = `
        <label class="task-label" onclick="event.stopPropagation()">
          <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
          <span class="task-text">${task.title}</span>
          ${dueDateHtml}
        </label>
        <button class="open-drawer-btn" data-id="${task.id}">⋮</button>
        <button class="delete-task-btn" data-id="${task.id}">×</button>
      `;
      
      // Checkbox event
      const checkbox = li.querySelector('.task-checkbox');
      checkbox.addEventListener('change', (e) => {
        e.stopPropagation();
        onToggle(task.id, e.target.checked);
      });
      
      // Open drawer button
      const openBtn = li.querySelector('.open-drawer-btn');
      openBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        onOpenDrawer(task.id);
      });
      
      // Delete button
      const deleteBtn = li.querySelector('.delete-task-btn');
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        onDelete(task.id);
      });
      
      // Task text clickable to open drawer
      const textSpan = li.querySelector('.task-text');
      textSpan.addEventListener('click', () => {
        onOpenDrawer(task.id);
      });
      
      this.elements.taskList.appendChild(li);
    });
  },
  
  // Open drawer with task details
  openDrawer(task) {
    if (!this.elements.taskDrawer) return;
    
    this.elements.taskTitle.textContent = task.title;
    this.elements.toggleCompleteBtn.textContent = task.completed ? '✔' : '○';
    this.elements.taskStatus.textContent = task.completed ? 'Done' : 'In Progress';
    
    // Set due date
    if (this.elements.taskDueDate) {
      this.elements.taskDueDate.value = task.dueDate || '';
    }
    
    this.elements.overlay.classList.remove('hidden');
    this.elements.taskDrawer.classList.remove('hidden');
  },
  
  // Close drawer
  closeDrawer() {
    if (!this.elements.overlay || !this.elements.taskDrawer) return;
    this.elements.overlay.classList.add('hidden');
    this.elements.taskDrawer.classList.add('hidden');
  },
  
  // Render subtasks in drawer
  renderSubtasks(task, onToggleSubtask, onDeleteSubtask) {
    if (!this.elements.subtaskList) return;
    
    this.elements.subtaskList.innerHTML = '';
    
    if (!task.subtasks) return;
    
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
      
      // Checkbox event
      const checkbox = div.querySelector('.subtask-checkbox');
      checkbox.addEventListener('change', (e) => {
        onToggleSubtask(parseInt(e.target.dataset.index));
      });
      
      // Delete button event
      const deleteBtn = div.querySelector('.delete-subtask-btn');
      deleteBtn.addEventListener('click', (e) => {
        onDeleteSubtask(parseInt(e.target.dataset.index));
      });
      
      this.elements.subtaskList.appendChild(div);
    });
  },
  
  // Update progress bar
  updateProgressBar(task) {
    if (!this.elements.progressBar || !this.elements.progressText) return;
    
    const total = task.subtasks ? task.subtasks.length : 0;
    const completed = task.subtasks ? task.subtasks.filter(s => s.completed).length : 0;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    this.elements.progressBar.style.width = percentage + '%';
    this.elements.progressText.textContent = `${completed} of ${total} subtasks completed`;
  },
  
  // Update drawer header (toggle button)
  updateDrawerHeader(task) {
    if (!this.elements.toggleCompleteBtn || !this.elements.taskStatus) return;
    this.elements.toggleCompleteBtn.textContent = task.completed ? '✔' : '○';
    this.elements.taskStatus.textContent = task.completed ? 'Done' : 'In Progress';
  }
};

// Export for use in other modules
window.UI = UI;