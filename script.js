const form = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const dayButtons = document.querySelectorAll(".day-btn");

let selectedDay = "Pazartesi";

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
});

dayButtons.forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".day-btn.active")?.classList.remove("active");
    button.classList.add("active");
    selectedDay = button.getAttribute("data-day");
    loadTasks();
  });
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  if (taskText !== "") {
    addTask(taskText);
    saveTask(taskText);
    taskInput.value = "";
  }
});

function addTask(text, completed = false) {
  const li = document.createElement("li");
  if (completed) li.classList.add("completed");

  li.innerHTML = `
    <span>${text}</span>
    <div>
      <button onclick="toggleComplete(this)">✔</button>
      <button onclick="deleteTask(this)">❌</button>
    </div>
  `;

  taskList.appendChild(li);
}

function toggleComplete(button) {
  const li = button.closest("li");
  li.classList.toggle("completed");
  updateLocalStorage();
}

function deleteTask(button) {
  const li = button.closest("li");
  li.remove();
  updateLocalStorage();
}

function saveTask(task) {
  const tasks = getTasksFromStorage();
  tasks.push({ text: task, completed: false });
  localStorage.setItem(`tasks-${selectedDay}`, JSON.stringify(tasks));
}

function getTasksFromStorage() {
  return JSON.parse(localStorage.getItem(`tasks-${selectedDay}`)) || [];
}

function loadTasks() {
  taskList.innerHTML = "";
  const tasks = getTasksFromStorage();
  tasks.forEach(task => addTask(task.text, task.completed));
}

function updateLocalStorage() {
  const items = document.querySelectorAll("#task-list li");
  const updatedTasks = Array.from(items).map(li => ({
    text: li.querySelector("span").textContent,
    completed: li.classList.contains("completed"),
  }));
  localStorage.setItem(`tasks-${selectedDay}`, JSON.stringify(updatedTasks));
}
