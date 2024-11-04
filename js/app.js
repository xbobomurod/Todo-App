const form = document.querySelector("#form");
const taskInput = document.querySelector("#add-task-input");
const tbody = document.querySelector(".todo");
const modal = document.querySelector(".modal-edit");
const modalInput = document.querySelector(".modal-input");
const closeBtn = document.querySelector(".close-btn");
const doneBtn = document.querySelector(".done-btn");

// Ma'lumotlarni saqlash uchun bo'sh massiv
const tasksArray = [];

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

    const newRow = document.createElement("tr");
    newRow.setAttribute("data-index", tasksArray.length - 1);

    newRow.innerHTML = `  
            <td class="task-number">${taskData.id}</td>  
            <td class="task-name">${taskData.name}</td>  
            <td><button type="button" class="status-btn">${taskData.status}</button></td>  
            <td><button type="button" class="edit-btn"><i class="fa-solid fa-pen"></i></button></td>  
            <td><button class="remove-btn" type="button"><i class="fa-solid fa-trash-can"></i></button></td>  
        `;

    tbody.appendChild(newRow);

    taskInput.value = "";
    edit();
    addRemove();
    // Har safar qo'shganda indekslarni yangilang.
    updateIndices();
  } else {
    alert("Please enter a task name!");
  }
}

function edit() {
  const editBtns = document.querySelectorAll(".edit-btn");
  editBtns.forEach((editBtn, index) => {
    editBtn.addEventListener("click", () => {
      modal.classList.add("active");
      modalInput.value = tasksArray[index].name;

      doneBtn.onclick = function (event) {
        event.preventDefault();
        modal.classList.remove("active");
        const updatedTask = modalInput.value.trim();
        if (updatedTask) {
          tasksArray[index].name = updatedTask;
          const taskName = tbody.querySelectorAll(".task-name")[index];
          taskName.textContent = updatedTask;
        } else {
          alert("Please enter a task name!");
        }
      };

      closeBtn.onclick = () => {
        modal.classList.remove("active");
      };
    });
  });
}

// Vazifani o'chirish
function addRemove() {
  const removeBtns = document.querySelectorAll(".remove-btn");

  removeBtns.forEach((removeBtn) => {
    removeBtn.addEventListener("click", (event) => {
      const taskRow = event.target.closest("tr");

      // Vazifani o'chirish
      taskRow.remove();

      // Yangi indekslarni yangilash
      updateIndices();
    });
  });
}

// Indekslarni yangilash funksiya
function updateIndices() {
  const rows = document.querySelectorAll(".todo tr");
  rows.forEach((row, i) => {
    row.setAttribute("data-index", i);
    // Raqamlarni yangilash
    row.querySelector(".task-number").textContent = i + 1;
  });
}
