(() => {
  const storageKey = "todos";

  function generateId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return `id_${Date.now()}_${Math.floor(Math.random() * 1e9)}`;
  }

  function loadTodos() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveTodos(todos) {
    localStorage.setItem(storageKey, JSON.stringify(todos));
  }

  function createTodoElement(todo) {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex align-items-center justify-content-between";
    li.dataset.id = todo.id;

    const left = document.createElement("div");
    left.className = "d-flex align-items-center gap-2";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "form-check-input";
    checkbox.checked = !!todo.completed;
    checkbox.setAttribute("aria-label", "Toggle complete");

    const label = document.createElement("span");
    label.textContent = todo.title;
    label.className = todo.completed
      ? "text-decoration-line-through text-body-secondary"
      : "";

    left.appendChild(checkbox);
    left.appendChild(label);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-sm btn-outline-danger";
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("aria-label", `Delete ${todo.title}`);

    li.appendChild(left);
    li.appendChild(deleteBtn);

    return { li, checkbox, label, deleteBtn };
  }

  function updateSummary(todos) {
    const summaryEl = document.getElementById("todo-summary");
    if (!summaryEl) return;
    const total = todos.length;
    const remaining = todos.filter((t) => !t.completed).length;
    if (total === 0) {
      summaryEl.textContent = "No tasks yet.";
    } else {
      summaryEl.textContent = `${remaining} of ${total} remaining`;
    }
  }

  function renderTodos(todos) {
    const list = document.getElementById("todo-list");
    if (!list) return;
    list.innerHTML = "";
    todos.forEach((todo) => {
      const { li, checkbox, label, deleteBtn } = createTodoElement(todo);

      checkbox.addEventListener("change", () => {
        todo.completed = checkbox.checked;
        label.className = todo.completed
          ? "text-decoration-line-through text-body-secondary"
          : "";
        saveTodos(todos);
        updateSummary(todos);
      });

      deleteBtn.addEventListener("click", () => {
        const idx = todos.findIndex((t) => t.id === todo.id);
        if (idx !== -1) {
          todos.splice(idx, 1);
          saveTodos(todos);
          li.remove();
          updateSummary(todos);
        }
      });

      list.appendChild(li);
    });

    updateSummary(todos);
  }

  function attachHandlers(todos) {
    const input = document.getElementById("todo-input");
    const addBtn = document.getElementById("add-todo-btn");
    const clearCompletedBtn = document.getElementById("clear-completed-btn");
    const clearAllBtn = document.getElementById("clear-all-btn");

    function addTodoFromInput() {
      if (!input) return;
      const title = (input.value || "").trim();
      if (title.length === 0) return;
      const newTodo = {
        id: generateId(),
        title,
        completed: false,
        createdAt: Date.now(),
      };
      todos.unshift(newTodo);
      saveTodos(todos);
      renderTodos(todos);
      input.value = "";
      input.focus();
    }

    if (addBtn) {
      addBtn.addEventListener("click", addTodoFromInput);
    }

    if (input) {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addTodoFromInput();
        }
      });
    }

    if (clearCompletedBtn) {
      clearCompletedBtn.addEventListener("click", () => {
        const remaining = todos.filter((t) => !t.completed);
        if (remaining.length === todos.length) return;
        todos.length = 0;
        remaining.forEach((t) => todos.push(t));
        saveTodos(todos);
        renderTodos(todos);
      });
    }

    if (clearAllBtn) {
      clearAllBtn.addEventListener("click", () => {
        if (!confirm("Clear all tasks?")) return;
        todos.length = 0;
        saveTodos(todos);
        renderTodos(todos);
      });
    }
  }

  function init() {
    const todos = loadTodos();
    renderTodos(todos);
    attachHandlers(todos);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
