"use strict";
const form = document.querySelector(".form");
const taskList = document.querySelector(".list");
const input = document.querySelector(".form__input");
const deleteWrapper = document.querySelector(".delete");
let toDoList = [];

form.addEventListener("submit", addTaskHandler);
deleteWrapper.addEventListener("click", deleteHandler);
taskList.addEventListener("click", crossTaskHandler);

//обработчик добавление задач
function addTaskHandler(ev) {
  ev.preventDefault();

  if (input.value.trim() === "") {
    return;
  }

  const taskObj = {
    text: input.value,
    isDone: false,
    id: toDoList.length,
  };

  const taskNode = document.createElement("li");
  taskNode.className = "list__item";
  taskNode.id = taskObj.id;

  taskNode.innerHTML = ` 
<div class="list__wrapper">
    <input class="list__checkbox" type="checkbox">
    <p class="list__text">${input.value}</p> 
</div>
    <button class="list__cross">❌</button>
`;

  // taskList.prepend(taskNode);

  input.value = "";
  // toDoList.push(taskObj);
  renderTask(taskNode, taskObj);
}

function renderTask(task, taskObj) {
  taskList.prepend(task);
  toDoList.push(taskObj);
}

//обработчик удаления
function deleteHandler(ev) {
  if (ev.target.className === "delete__all btn") {
    deleteAll();
  }

  if (ev.target.className === "delete__done btn") {
    deleteDone();
  }
}

// удаление всех
function deleteAll() {
  toDoList = [];
  taskList.innerHTML = "";
  input.value = "";
}

//удаление завершенных
function deleteDone() {
  toDoList = toDoList.filter((task) => task.isDone == false);
}

//обработчик завершение задач
function crossTaskHandler(ev) {
  if (ev.target.matches(`input[type="checkbox"]`)) {
    const taskNode = ev.target.closest(".list__item");
    const taskNodeText = taskNode.querySelector(".list__text");

    taskNodeText.classList.toggle("crossed");

    toDoList = toDoList.map((task) =>
      taskNode.id == task.id ? { ...task, isDone: !task.isDone } : task
    );
  }

  // удаление конкретной задачи
  if (ev.target.className === "list__cross") {
    const id = ev.target.parentNode.id;
    toDoList = toDoList.filter((task) => task.id != id);
    ev.target.parentNode.remove();
  }
}

function saveToLocalStorage() {
  localStorage.setItem("toDoList", toDoList);
}

