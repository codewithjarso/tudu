document.addEventListener("todoSelected", (e) => {
  const todo = e.detail;

  // Clean up existing sidebar
  const existing = document.querySelector(".todo-sidebar");
  if (existing) existing.remove();

  const sidebar = document.createElement("div");
  sidebar.className = "todo-sidebar";
  sidebar.dataset.id = todo.id; // Store ID for reference

  sidebar.innerHTML = `
    <div class="sidebar-content">
      <h3>${todo.text}</h3>
      <label>Due Date:</label>
      <input type="date" class="sidebar-date" value="${todo.date || ''}">
      
      <div class="subtask-section">
        <button class="add-subtask-btn">Add Subtask</button>
        <ul class="subtask-list"></ul>
      </div>

      <button class="delete-btn">Delete Todo</button>
    </div>
  `;

  // Attach logic to the new elements
  sidebar.querySelector(".delete-btn").addEventListener("click", () => {
    document.dispatchEvent(new CustomEvent("todoDeleted", { detail: todo.id }));
    sidebar.remove();
  });

  sidebar.querySelector(".sidebar-date").addEventListener("change", (event) => {
    document.dispatchEvent(new CustomEvent("todoUpdated", { 
      detail: { id: todo.id, date: event.target.value } 
    }));
  });

  document.body.appendChild(sidebar);
});