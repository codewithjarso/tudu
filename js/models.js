function createTask(title) {
  return {
    id: Date.now().toString(),
    title,
    description: "",
    completed: false,
    priority: "low",
    subtasks: [],
    comments: []
  };
}

function createSubtask(title) {
  return {
    id: Date.now().toString(),
    title,
    completed: false
  };
}

function createComment(text) {
  return {
    id: Date.now().toString(),
    text,
    author: "User"
  };
}