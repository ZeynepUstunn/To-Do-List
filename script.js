const form = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

// Sayfa yüklendiğinde localStorage'dan görevleri getir
document.addEventListener("DOMContentLoaded", loadTasks);

// Görev ekleme
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  if (taskText !== "") {
    addTask(taskText);
    saveTask(taskText);
    taskInput.value = "";
  }
});

// Görevleri listeye ekle
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

// Görevi tamamlandı olarak işaretle
function toggleComplete(button) {
  const li = button.closest("li");
  li.classList.toggle("completed");
  updateLocalStorage();
}

// Görevi sil
function deleteTask(button) {
  const li = button.closest("li");
  li.remove();
  updateLocalStorage();
}

// localStorage’a görev kaydet
function saveTask(task) {
  const tasks = getTasksFromStorage();
  tasks.push({ text: task, completed: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// localStorage’dan görevleri çek
function getTasksFromStorage() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

// Sayfa açıldığında görevleri yükle
function loadTasks() {
  const tasks = getTasksFromStorage();
  tasks.forEach(task => addTask(task.text, task.completed));
}

// Değişiklik sonrası localStorage güncelle
function updateLocalStorage() {
  const items = document.querySelectorAll("#task-list li");
  const updatedTasks = Array.from(items).map(li => ({
    text: li.querySelector("span").textContent,
    completed: li.classList.contains("completed"),
  }));
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}
