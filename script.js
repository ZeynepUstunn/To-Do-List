const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const weekContainer = document.getElementById("week-container");

document.addEventListener("DOMContentLoaded", () => {
  days.forEach(day => createDaySection(day));
  loadNotes();
});

// Günlük görev alanı
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

  loadTasks(day, ul);

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

// Görev işlemleri
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

function toggleComplete(button, day) {
  const li = button.closest("li");
  li.classList.toggle("completed");
  updateStorage(day);
}

function deleteTask(button, day) {
  const li = button.closest("li");
  li.remove();
  updateStorage(day);
}

function saveTaskToStorage(day, text) {
  const tasks = getTasksFromStorage(day);
  tasks.push({ text, completed: false });
  localStorage.setItem(`tasks-${day}`, JSON.stringify(tasks));
}

function getTasksFromStorage(day) {
  return JSON.parse(localStorage.getItem(`tasks-${day}`)) || [];
}

function loadTasks(day, ul) {
  const tasks = getTasksFromStorage(day);
  tasks.forEach(task => addTaskToUI(task.text, ul, day, task.completed));
}

function updateStorage(day) {
  const ul = document.getElementById(`list-${day}`);
  const items = ul.querySelectorAll("li");
  const updatedTasks = Array.from(items).map(li => ({
    text: li.querySelector("span").textContent,
    completed: li.classList.contains("completed")
  }));
  localStorage.setItem(`tasks-${day}`, JSON.stringify(updatedTasks));
}

// 📒 Notlar kısmı
const notesForm = document.getElementById("notes-form");
const noteInput = document.getElementById("note-input");
const notesList = document.getElementById("notes-list");

notesForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const note = noteInput.value.trim();
  if (note !== "") {
    addNoteToUI(note);
    saveNoteToStorage(note);
    noteInput.value = "";
  }
});

function addNoteToUI(note) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.textContent = note;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.style.marginLeft = "10px";
  deleteBtn.onclick = () => deleteNote(note, li);

  li.appendChild(span);
  li.appendChild(deleteBtn);
  notesList.appendChild(li);
}

let lastDeletedNote = null;

function deleteNote(noteText, liElement) {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  const updated = notes.filter(n => n !== noteText);
  localStorage.setItem("notes", JSON.stringify(updated));
  liElement.remove();

  lastDeletedNote = noteText;
  showUndo();
}

function showUndo() {
  let undoDiv = document.getElementById("undo-note");
  if (!undoDiv) {
    undoDiv = document.createElement("div");
    undoDiv.id = "undo-note";
    undoDiv.style.position = "fixed";
    undoDiv.style.bottom = "20px";
    undoDiv.style.right = "20px";
    undoDiv.style.backgroundColor = "#ffe082";
    undoDiv.style.padding = "10px";
    undoDiv.style.borderRadius = "5px";
    undoDiv.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
    document.body.appendChild(undoDiv);
  }

  undoDiv.innerHTML = `Not silindi. <button id="undo-btn">Geri Al</button>`;

  document.getElementById("undo-btn").addEventListener("click", () => {
    undoDeleteNote();
    undoDiv.remove();
  });

  setTimeout(() => {
    if (undoDiv && document.body.contains(undoDiv)) {
      undoDiv.remove();
      lastDeletedNote = null;
    }
  }, 5000); // 10 saniye sonra otomatik kaldır
}

function undoDeleteNote() {
  if (lastDeletedNote) {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    notes.push(lastDeletedNote);
    localStorage.setItem("notes", JSON.stringify(notes));
    addNoteToUI(lastDeletedNote);
    lastDeletedNote = null;
  }
}

function saveNoteToStorage(note) {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes.push(note);
  localStorage.setItem("notes", JSON.stringify(notes));
}

function loadNotes() {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes.forEach(note => addNoteToUI(note));
}

