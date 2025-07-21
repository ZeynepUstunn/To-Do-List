const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const weekContainer = document.getElementById("week-container");

document.addEventListener("DOMContentLoaded", () => {
  days.forEach(day => createDaySection(day));
});

// Her gün için bir alan oluştur
function createDaySection(day) {
  const dayCard = document.createElement("div");
  dayCard.className = "day-card";

  dayCard.innerHTML = `
    <h2>${day}</h2>
    <form data-day="${day}">
      <input type="text" placeholder="Görev gir..." required />
      <button type="submit">Ekle</button>
    </form>
    <ul id="list-${day}"></ul>
  `;

  weekContainer.appendChild(dayCard);

  const form = dayCard.querySelector("form");
  const input = form.querySelector("input");
  const ul = dayCard.querySelector("ul");

  // Görevleri yükle
  loadTasks(day, ul);

  // Ekle butonuna basılınca
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text !== "") {
      addTaskToUI(text, ul, day);
      saveTaskToStorage(day, text);
      input.value = "";
    }
  });
}

// Görevi ekranda göster
function addTaskToUI(text, ul, day, completed = false) {
  const li = document.createElement("li");
  if (completed) li.classList.add("completed");

  li.innerHTML = `
    <span>${text}</span>
    <div>
      <button onclick="toggleComplete(this, '${day}')">✔</button>
      <button onclick="deleteTask(this, '${day}')">❌</button>
    </div>
  `;
  ul.appendChild(li);
}

// Görevi tamamlandı olarak işaretle
function toggleComplete(button, day) {
  const li = button.closest("li");
  li.classList.toggle("completed");
  updateStorage(day);
}

// Görevi sil
function deleteTask(button, day) {
  const li = button.closest("li");
  li.remove();
  updateStorage(day);
}

// LocalStorage’a görev kaydet
function saveTaskToStorage(day, text) {
  const tasks = getTasksFromStorage(day);
  tasks.push({ text, completed: false });
  localStorage.setItem(`tasks-${day}`, JSON.stringify(tasks));
}

// LocalStorage’dan görev çek
function getTasksFromStorage(day) {
  return JSON.parse(localStorage.getItem(`tasks-${day}`)) || [];
}

// Sayfa yüklenince görevleri getir
function loadTasks(day, ul) {
  const tasks = getTasksFromStorage(day);
  tasks.forEach(task => addTaskToUI(task.text, ul, day, task.completed));
}

// Değişiklik sonrası güncelle
function updateStorage(day) {
  const ul = document.getElementById(`list-${day}`);
  const items = ul.querySelectorAll("li");
  const updatedTasks = Array.from(items).map(li => ({
    text: li.querySelector("span").textContent,
    completed: li.classList.contains("completed")
  }));
  localStorage.setItem(`tasks-${day}`, JSON.stringify(updatedTasks));
}
