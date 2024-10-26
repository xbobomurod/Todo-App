const form = document.querySelector("#form");
const taskInput = document.querySelector("#add-task-input");
const tbody = document.querySelector(".todo");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const taskName = taskInput.value.trim(); // Input'dan value olamiz

  if (taskName) {
    // Joriy value qaysi raqamda qoshilishini aniqlaymiz
    const TaskCount = tbody.querySelectorAll("tr").length + 1;

    // Yangi <tr> yaratamiz
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td class="task-number">${TaskCount}</td>
        <td class="task-name">${taskName}</td>
        <td><button type="button" class="status-btn">Todo</button></td>
        <td><button type="button" class="edit-btn"><i class="fa-solid fa-pen"></i></button></td>
        <td><button class="remove-btn" type="button"><i class="fa-solid fa-trash-can"></i></button></td>     
    `;

    // <tbody> ga yangi qator qo'shamiz
    tbody.appendChild(newRow);

    // Input maydonini tozalaymiz
    taskInput.value = "";
  } else {
    alert("Please enter a task name!");
  }
});
