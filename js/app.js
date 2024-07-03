"use strict";
const form = document.querySelector(".form");
const taskList = document.querySelector(".list");
const input = document.querySelector(".form__input");
const deleteWrapper = document.querySelector(".delete");
let toDoList = [];

form.addEventListener("submit", addTaskHandler);
deleteWrapper.addEventListener("click", deleteHandler);
taskList.addEventListener("click", crossTaskHandler);

//добавление
function addTaskHandler(ev) {
  ev.preventDefault();

  if (input.value.trim() === "") {
    return;
  }

  const taskObj = {
    text: input.value,
    isDone: false,
    id: new Date().getTime(),
  };

  renderTask(taskObj);
}

// отрисовка
function renderTask(taskObj) {
  const taskNode = document.createElement("li");
  taskNode.className = "list__item";
  taskNode.id = taskObj.id;

  taskNode.innerHTML = `
  <div class="list__wrapper">
      <input class="list__checkbox" type="checkbox">
      <p class="list__text">${taskObj.text}</p>
  </div>
      <button class="list__cross">❌</button>
  `;

  taskList.prepend(taskNode);
  input.value = "";
  toDoList.push(taskObj);
  saveToLocalStorage();
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
  saveToLocalStorage();
}

//удаление завершенных
function deleteDone() {
  const tasksToDelete = [...document.querySelectorAll(".list__item")];

  tasksToDelete.forEach((taskNode) => {
    const taskNodeId = parseInt(taskNode.id);
    const task = toDoList.find((task) => task.id === taskNodeId);

    if (task && task.isDone) {
      taskNode.remove();
    }
  });

  toDoList = toDoList.filter((task) => !task.isDone);
  saveToLocalStorage();
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
    saveToLocalStorage();
  }

  // удаление конкретной задачи
  if (ev.target.className === "list__cross") {
    const id = ev.target.parentNode.id;
    toDoList = toDoList.filter((task) => task.id != id);
    ev.target.parentNode.remove();
    saveToLocalStorage();
  }
}

// сохранение в локальное хранилище
function saveToLocalStorage() {
  localStorage.setItem("toDoList", JSON.stringify(toDoList));
}

function getFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem("toDoList") || []);

  tasks.forEach((obj) => {
    renderTask(obj);
  });
}
getFromLocalStorage();
