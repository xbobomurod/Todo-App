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
function addTaskToDOM(task) {
  const newRow = document.createElement("tr");
  newRow.setAttribute("data-id", task.id);

  // Agar vazifa holati "Done" bo'lsa, vazifa nomi chizilgan bo'ladi
  const taskNameContent =
    task.status === "Done" ? `<del>${task.name}</del>` : task.name;
  
  newRow.innerHTML = `  
            <td class="task-number">${tasksArray.indexOf(task) + 1}</td>  
            <td class="task-name">${taskNameContent}</td>  
            <td><button onclick="doneTask(event)" type="button" class="status-btn ${
              task.status === "Done" ? "done" : ""
            }">${task.status}</button></td>  
            <td><button type="button" class="edit-btn"><i class="fa-solid fa-pen"></i></button></td>  
            <td><button class="remove-btn" type="button"><i class="fa-solid fa-trash-can"></i></button></td>  
        `;
  tbody.appendChild(newRow);
  updateIndices(); // Qo'shgandan keyin indekslarni yangilash
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

  if (!statusBtn.classList.contains("done")) {
    statusBtn.classList.add("done");
    statusBtn.innerText = "Done";
    taskName.innerHTML = `<del>${taskName.innerText}</del>`;
    task.status = "Done";
  } else {
    statusBtn.classList.remove("done");
    statusBtn.innerText = "Todo";
    taskName.innerHTML = `${task.name}`;
    task.status = "Todo";
  }

  saveTasksToLocalStorage(); // Holat o'zgartirilgandan keyin saqlash
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