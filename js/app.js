"use strict";
const form = document.querySelector(".form"),
  taskList = document.querySelector(".list"),
  input = document.querySelector(".form__input"),
  deleteWrapper = document.querySelector(".delete"),
  formLine = document.querySelector(".form__line"),
  mainWrapper = document.querySelector(".main__wrapper");

let toDoList = [];

form.addEventListener("submit", addTaskHandler);
deleteWrapper.addEventListener("click", deleteHandler);
taskList.addEventListener("click", crossTaskHandler);

//добавление
function addTaskHandler(ev) {
  ev.preventDefault();

  if (input.value.trim() === "") return;

  mainWrapper.classList.add("active-wrapper");
  formLine.style.display = "block";
  deleteWrapper.style.display = "flex";
  taskList.style.display = "flex";

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
    <input class="list__checkbox" id="checkbox" type="checkbox">
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
  if (ev.target.className === "delete__all btn") deleteAll();

  if (ev.target.className === "delete__done btn") deleteDone();
}

// удаление всех
function deleteAll() {
  toDoList = [];
  taskList.innerHTML = "";
  input.value = "";
  mainWrapper.classList.remove("active-wrapper");
  formLine.style.display = "none";
  deleteWrapper.style.display = "none";
  taskList.style.display = "none";
  saveToLocalStorage();
}

//удаление завершенных
function deleteDone() {
  const tasksToDelete = [...document.querySelectorAll(".list__item")];

  tasksToDelete.forEach((taskNode) => {
    const taskNodeId = parseInt(taskNode.id);
    const task = toDoList.find((task) => task.id === taskNodeId);

    if (task && task.isDone) taskNode.remove();
  });

  toDoList = toDoList.filter((task) => !task.isDone);

  console.log(taskList);

  if (taskList.innerHTML === "") {
    mainWrapper.classList.remove("active-wrapper");
    formLine.style.display = "none";
    deleteWrapper.style.display = "none";
    taskList.style.display = "none";
  }

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
  if (event.target.classList.contains("list__cross")) {
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

  tasks.forEach((obj) => renderTask(obj));
}
getFromLocalStorage();

if (toDoList.length) {
  mainWrapper.classList.add("active-wrapper");
  formLine.style.display = "block";
  deleteWrapper.style.display = "flex";
  taskList.style.display = "flex";
}
