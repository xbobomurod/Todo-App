const form = document.querySelector("#form");
const taskInput = document.querySelector("#add-task-input");
const tbody = document.querySelector(".todo");

// Ma'lumotlarni saqlash uchun bo'sh massiv yaratamiz
const tasksArray = [];

form.addEventListener("submit", displayTask);

function displayTask(event) {
  event.preventDefault();

  const taskName = taskInput.value.trim();

  if (taskName) {
    // Task tartib raqamini aniqlaymiz
    const TaskCount = tasksArray.length + 1;

    // Yangi task ma'lumotlarini arrayga qo'shamiz
    const taskData = {
      id: TaskCount,
      name: taskName,
      status: "Todo",
    };
    tasksArray.push(taskData);

    // Yangi <tr> elementini yaratamiz
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td class="task-number">${taskData.id}</td>
        <td class="task-name">${taskData.name}</td>
        <td><button type="button" class="status-btn">${taskData.status}</button></td>
        <td><button type="button" class="edit-btn"><i class="fa-solid fa-pen"></i></button></td>
        <td><button class="remove-btn" type="button"><i class="fa-solid fa-trash-can"></i></button></td>     
    `;

    // <tbody> elementiga yangi qatorni qo'shamiz
    tbody.appendChild(newRow);

    // Input maydonini tozalaymiz
    taskInput.value = "";
  } else {
    alert("Please enter a task name!");
  }
}
