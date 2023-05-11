const inputTask = document.getElementById("inputTask");
const btnAdd = document.getElementById("btnAdd");
const btnImportant = document.getElementById("btnImportant");
const btnEdit = document.getElementById("btnEdit");
const btnDelete = document.getElementById("btnDelete");
const todo = document.getElementById("todo");
const btnClear = document.getElementById("clear");
const btnHepsi = document.getElementById("all");
const btnTamamlandi = document.getElementById("completed");
const btnBekleyen = document.getElementById("pending");

let taskEditDurum;
let editId;
let gorevList = [];

if (localStorage.getItem("gorevList") !== null) {
  gorevList = JSON.parse(localStorage.getItem("gorevList"));
}

displayTasks("all");
function displayTasks(filter) {
  todo.innerHTML = "";

  if (gorevList.length == 0) {
    todo.innerHTML = `<div class="card-body">
    <p>Hiç göreviniz kalmadı</p>
    </div>`;
  }
  for (let gorev of gorevList) {
    let completed = gorev.durum == "completed" ? "checked" : "";

    if (filter == gorev.durum || filter == "all") {
      let list = `<div class="card-body" id="cardId${gorev.id}" > 
  <div>
      <input type="checkbox" id="${gorev.id}" class="input-task " name='${gorev.id}' ${completed} onclick="updateStatus(this)"/>
      <label for="${gorev.id}" class="input-task ${completed}" >${gorev.gorevAd}</label>
  </div>
  <div>
      <button id="#btnEdit" class="btnEdit" onclick='editTask(${gorev.id}, "${gorev.gorevAd}")'>
      <i class="fa-solid fa-pen"></i>
      </button>
      <button id="#btnDelete" class="btnDelete" onclick="deleteTags(${gorev.id})">
      <i class="fa-solid fa-trash-can"></i>
      </button>
  </div>
</div>`;
      inputTask.value = "";
      inputTask.focus();
      todo.insertAdjacentHTML("beforeend", list);
    }
  }
}

btnAdd.addEventListener("click", newTask);
function newTask(event) {
  if (inputTask.value == "") {
    alert("Görev Girmelisin!");
  } else {
    if (!taskEditDurum) {
      gorevList.push({
        id: gorevList.length + 1,
        gorevAd: inputTask.value,
        durum: "pending",
      });
      btnAdd.textContent = "+ Ekle";
    } else {
      for (let gorev of gorevList) {
        if (gorev.id == editId) {
          gorev.gorevAd = inputTask.value;
        }
      }
      taskEditDurum = false;

      if (!taskEditDurum) {
        btnAdd.textContent = "+ Ekle";
      }
    }
  }

  hepsiFonksiyon();
  localStorage.setItem("gorevList", JSON.stringify(gorevList));
  event.preventDefault();
}
function keyPress(event) {
  let anahtar = event.key;
  if (anahtar == "Enter") {
    newTask();
  }
}
function deleteTags(id) {
  let deleteId;
  for (let index in gorevList) {
    if (gorevList[index].id == id) {
      deleteId = index;
    }
  }
  gorevList.splice(deleteId, 1);
  displayTasks("all");
  localStorage.setItem("gorevList", JSON.stringify(gorevList));
}
function editTask(taskId, taskAd) {
  editId = taskId;
  inputTask.value = taskAd;
  inputTask.focus();
  taskEditDurum = true;
  if (taskEditDurum) {
    btnAdd.textContent = "Düzenle";
  }
}
function updateStatus(selectedTask) {
  let label = selectedTask.nextElementSibling;
  let durum;
  if (selectedTask.checked) {
    label.classList.add("checked");
    durum = "completed";
  } else {
    label.classList.remove("checked");
    durum = "pending";
  }
  for (let gorev of gorevList) {
    if (gorev.id == selectedTask.id) {
      gorev.durum = durum;
    }
  }
  displayTasks(document.querySelector("button.aktive").id);
  localStorage.setItem("gorevList", JSON.stringify(gorevList));
}

function tasksClear() {
  gorevList.splice(0, gorevList.length);
  localStorage.setItem("gorevList", JSON.stringify(gorevList));
  hepsiFonksiyon();
}
btnHepsi.addEventListener("click", hepsiFonksiyon);

function hepsiFonksiyon() {
  displayTasks("all");
  btnHepsi.classList.add("aktive");
  btnBekleyen.classList.remove("aktive");
  btnTamamlandi.classList.remove("aktive");
}
btnTamamlandi.addEventListener("click", function () {
  btnHepsi.classList.remove("aktive");
  btnBekleyen.classList.remove("aktive");
  btnTamamlandi.classList.add("aktive");
  displayTasks("completed");
});
btnBekleyen.addEventListener("click", function () {
  btnHepsi.classList.remove("aktive");
  btnBekleyen.classList.add("aktive");
  btnTamamlandi.classList.remove("aktive");
  displayTasks("pending");
});
