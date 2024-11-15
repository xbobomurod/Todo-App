const form = document.querySelector("#form");
const taskInput = document.querySelector("#add-task-input");
const tbody = document.querySelector(".todo");
const modal = document.querySelector(".modal-edit");
const modalInput = document.querySelector(".modal-input");
const closeBtn = document.querySelector(".close-btn");
const doneBtn = document.querySelector(".done-btn");

// Ma'lumotlarni saqlash uchun bo'sh massiv
let tasksArray = [];

// Sahifa yuklanganda localStorage-dan vazifalarni yuklash
document.addEventListener("DOMContentLoaded", initializeTasks);

form.addEventListener("submit", displayTask);

function displayTask(event) {
  event.preventDefault();

  const taskName = taskInput.value.trim();

  if (taskName) {
    const taskData = {
      id: tasksArray.length + 1,
      name: taskName,
      status: "Todo",
    };
    tasksArray.push(taskData);

    addTaskToDOM(taskData);
    taskInput.value = "";
    edit();
    addRemove();
    saveTasksToLocalStorage(); // Vazifa qo'shilgandan so'ng saqlash
  } else {
    alert("Please enter a task!");
  }
}

// Vazifani DOMga qo'shish funksiyasi
const TEXT_LIMIT = 20;

function addTaskToDOM(task) {
  const newRow = document.createElement("tr");
  newRow.setAttribute("data-id", task.id);

  const taskNameContent = task.status === "Done" ? `<del>${task.name}</del>` : task.name;
  const taskShortText = task.name.length > TEXT_LIMIT ? task.name.substring(0, TEXT_LIMIT) + "..." : task.name;
  
  newRow.innerHTML = `  
    <td class="task-number">${tasksArray.indexOf(task) + 1}</td>  
    <td class="task-name" style="cursor: pointer;">
      <span class="short-text">${taskShortText}</span>
      <span class="full-text" style="display:none;">${task.name}</span>
    </td>
    <td><button onclick="doneTask(event)" type="button" class="status-btn ${task.status === "Done" ? "done" : ""}">${task.status}</button></td>
    <td><button type="button" class="edit-btn"><i class="fa-solid fa-pen"></i></button></td>
    <td><button class="remove-btn" type="button"><i class="fa-solid fa-trash-can"></i></button></td>  
  `;

  tbody.appendChild(newRow);
  updateIndices();
  addTaskExpandToggle(newRow);
}

// text-name ga hodisa ishlov beruvchisini qo'shish funksiyasi
function addTaskExpandToggle(row) {
  const taskNameCell = row.querySelector(".task-name");
  const shortText = taskNameCell.querySelector(".short-text");
  const fullText = taskNameCell.querySelector(".full-text");

  taskNameCell.addEventListener("click", () => {
    if (shortText.style.display === "none") {
      shortText.style.display = "";
      fullText.style.display = "none";
    } else {
      shortText.style.display = "none";
      fullText.style.display = "";
    }
  });
}

function edit() {
  const editBtns = document.querySelectorAll(".edit-btn");
  editBtns.forEach((editBtn) => {
    editBtn.addEventListener("click", () => {
      const taskRow = editBtn.closest("tr");
      const taskId = taskRow.getAttribute("data-id");
      const taskIndex = tasksArray.findIndex(
        (task) => task.id === Number(taskId)
      );
      const taskData = tasksArray[taskIndex];

      modal.classList.add("active");
      modalInput.value = taskData.name;

      doneBtn.onclick = function (event) {
        event.preventDefault();
        modal.classList.remove("active");
        const updatedTask = modalInput.value.trim();
        if (updatedTask) {
          taskData.name = updatedTask;
          taskRow.querySelector(".task-name").textContent = updatedTask;

          const statusBtn = taskRow.querySelector(".status-btn");
          statusBtn.classList.remove("done");
          statusBtn.innerText = "Todo";

          saveTasksToLocalStorage(); // Tahrirlashdan keyin saqlash
        } else {
          alert("Please enter a task!");
        }
      };

      closeBtn.onclick = () => {
        modal.classList.remove("active");
      };
    });
  });
}

function addRemove() {
  const removeBtns = document.querySelectorAll(".remove-btn");

  removeBtns.forEach((removeBtn) => {
    removeBtn.addEventListener("click", (event) => {
      const taskRow = event.target.closest("tr");
      const taskId = Number(taskRow.getAttribute("data-id"));

      tasksArray = tasksArray.filter((task) => task.id !== taskId); // ID bo'yicha vazifani o'chirish
      taskRow.remove();

      saveTasksToLocalStorage(); // O'chirilgandan keyin saqlash
      updateIndices(); // Indekslarni yangilash
    });
  });
}

function updateIndices() {
  const rows = document.querySelectorAll(".todo tr");
  rows.forEach((row, i) => {
    row.querySelector(".task-number").textContent = i + 1;
  });
}

function doneTask(event) {
  const statusBtn = event.target;
  const trElement = event.target.closest("tr");
  const taskName = trElement.querySelector(".task-name");
  const taskId = Number(trElement.getAttribute("data-id"));
  const task = tasksArray.find((task) => task.id === taskId);

  // Проверка на длину текста
  const taskShortText =
    task.name.length > TEXT_LIMIT
      ? task.name.substring(0, TEXT_LIMIT) + "..."
      : task.name;

  if (!statusBtn.classList.contains("done")) {
    // Если статус меняется на Done
    statusBtn.classList.add("done");
    statusBtn.innerText = "Done";

    // Если текст меньше TEXT_LIMIT, не добавляем "..."
    taskName.querySelector(".short-text").innerHTML =
      task.name.length > TEXT_LIMIT
        ? `<del>${task.name.substring(0, TEXT_LIMIT)}...</del>`
        : `<del>${task.name}</del>`;
    taskName.querySelector(".full-text").innerHTML = `<del>${task.name}</del>`;
    task.status = "Done";
  } else {
    // Если статус меняется обратно на Todo
    statusBtn.classList.remove("done");
    statusBtn.innerText = "Todo";

    // Если текст меньше TEXT_LIMIT, не добавляем "..."
    taskName.querySelector(".short-text").innerHTML =
      task.name.length > TEXT_LIMIT
        ? task.name.substring(0, TEXT_LIMIT) + "..."
        : task.name;
    taskName.querySelector(".full-text").innerHTML = task.name;
    task.status = "Todo";
  }

  addTaskExpandToggle(trElement); // Повторно применяем функцию раскрытия текста после изменения статуса

  saveTasksToLocalStorage(); // Сохраняем изменения в localStorage
}


// Vazifalarni localStorage'ga saqlash funksiyasi
function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasksArray));
}

// localStorage'dan vazifalarni yuklash funksiyasi
function loadTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem("tasks");
  return storedTasks ? JSON.parse(storedTasks) : [];
}

// localStorage'dan vazifalarni yuklash va boshlash funksiyasi
function initializeTasks() {
  tasksArray = loadTasksFromLocalStorage(); // localStorage'dan vazifalarni yuklash
  tasksArray.forEach((task) => addTaskToDOM(task)); // Vazifalarni DOMga qo'shish

  edit();
  addRemove();
  updateIndices();
}