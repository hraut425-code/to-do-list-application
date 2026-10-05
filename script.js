const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const count = document.getElementById("todo-count");

const STORAGE_KEY = "todo-tasks";

// Load saved tasks (or start empty)
let tasks = [];
try {
  tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
} catch (e) {
  tasks = [];
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    // storage not available, app still works for this session
  }
}

function render() {
  list.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "todo-item" + (task.done ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const text = document.createElement("span");
    text.textContent = task.text;

    const del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "✕";
    del.setAttribute("aria-label", "Delete task");
    del.addEventListener("click", () => deleteTask(task.id));

    li.append(checkbox, text, del);
    list.appendChild(li);
  });

  const remaining = tasks.filter((t) => !t.done).length;
  count.textContent = tasks.length
    ? remaining + " of " + tasks.length + " tasks remaining"
    : "No tasks yet. Add one above!";
}

function addTask(text) {
  tasks.push({ id: Date.now(), text: text, done: false });
  save();
  render();
}

function toggleTask(id) {
  tasks = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  save();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  save();
  render();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = input.value.trim();
  if (!value) return;
  addTask(value);
  input.value = "";
  input.focus();
});

render();
