let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const title = document.getElementById("title").value;
  const desc = document.getElementById("desc").value;
  const dueDate = document.getElementById("dueDate").value;

  if (!title || !dueDate) {
    alert("Title and Due Date are required!");
    return;
  }

  tasks.push({
    title,
    desc,
    dueDate,
    completed: false
  });

  saveTasks();
  renderTasks();
  document.getElementById("title").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("dueDate").value = "";
}

function renderTasks(filter = 'all') {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  const now = new Date();
  let deadlineAlert = "";

  tasks.forEach((task, index) => {
    if (
      filter === "completed" && !task.completed ||
      filter === "incomplete" && task.completed
    ) return;

    const due = new Date(task.dueDate);
    const diff = due - now;

    if (diff < 24 * 60 * 60 * 1000 && diff > 0 && !task.completed) {
      deadlineAlert += `⚠️ "${task.title}" is due soon!\n`;
    }

    const div = document.createElement("div");
    div.className = "task" + (task.completed ? " complete" : "");
    div.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.desc}</p>
      <p><strong>Due:</strong> ${new Date(task.dueDate).toLocaleDateString()}</p>
      <div class="actions">
        <button class="done" onclick="toggleComplete(${index})">${task.completed ? "Undo" : "Done"}</button>
        <button class="edit" onclick="editTask(${index})">Edit</button>
        <button class="delete" onclick="deleteTask(${index})">Delete</button>
      </div>
    `;
    list.appendChild(div);
  });

  const reminderBanner = document.getElementById("reminderBanner");
  if (deadlineAlert) {
    reminderBanner.textContent = deadlineAlert.trim();
    reminderBanner.style.display = "block";
  } else {
    reminderBanner.style.display = "none";
  }
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  if (confirm("Delete this task?")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

function editTask(index) {
  const task = tasks[index];
  document.getElementById("title").value = task.title;
  document.getElementById("desc").value = task.desc;
  document.getElementById("dueDate").value = task.dueDate;

  deleteTask(index);
}

function filterTasks(filter) {
  renderTasks(filter);
}

// Initial render
renderTasks();
