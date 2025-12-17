let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
let isKanban = false;

const body = document.body;
const jobList = document.getElementById("jobList");
const kanbanView = document.getElementById("kanbanView");
const tableView = document.getElementById("tableView");

const toggleViewBtn = document.getElementById("toggleView");
const toggleThemeBtn = document.getElementById("toggleTheme");

/* ---------- THEME ---------- */
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark");
}

toggleThemeBtn.onclick = () => {
  body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    body.classList.contains("dark") ? "dark" : "light"
  );
};

/* ---------- VIEW ---------- */
toggleViewBtn.onclick = () => {
  isKanban = !isKanban;
  tableView.classList.toggle("hidden", isKanban);
  kanbanView.classList.toggle("hidden", !isKanban);
  toggleViewBtn.textContent = isKanban ? "Table View" : "Kanban View";
  renderJobs();
};

/* ---------- CRUD ---------- */
function renderJobs() {
  jobList.innerHTML = "";
  document.querySelectorAll(".kanban-list").forEach((l) => (l.innerHTML = ""));

  jobs.forEach((j, i) => {
    // TABLE
    const row = `
      <tr>
        <td>${j.company}</td>
        <td>${j.position}</td>
        <td>${j.status}</td>
        <td>${j.date}</td>
        <td>
          <button onclick="editJob(${i})">Edit</button>
          <button onclick="deleteJob(${i})">Delete</button>
        </td>
      </tr>`;
    jobList.innerHTML += row;

    // KANBAN
    const col = document.querySelector(
      `[data-status="${j.status}"] .kanban-list`
    );
    if (col) {
      col.innerHTML += `
        <div class="kanban-card">
          <strong>${j.company}</strong>
          <div>${j.position}</div>
          <button onclick="editJob(${i})">Edit</button>
          <button onclick="deleteJob(${i})">Delete</button>
        </div>`;
    }
  });

  localStorage.setItem("jobs", JSON.stringify(jobs));
}

function deleteJob(i) {
  jobs.splice(i, 1);
  renderJobs();
}

function editJob(i) {
  const j = jobs[i];
  editIndex.value = i;
  companyInput.value = j.company;
  positionInput.value = j.position;
  dateInput.value = j.date;
  linkInput.value = j.link;
  statusInput.value = j.status;
  notesInput.value = j.notes;
  jobModal.style.display = "flex";
}

/* ---------- MODAL ---------- */
const jobModal = document.getElementById("jobModal");
const openAddModal = document.getElementById("openAddModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const jobForm = document.getElementById("jobForm");

openAddModal.onclick = () => {
  jobForm.reset();
  editIndex.value = "";
  jobModal.style.display = "flex";
};

closeModalBtn.onclick = () => (jobModal.style.display = "none");

jobForm.onsubmit = (e) => {
  e.preventDefault();
  const data = {
    company: companyInput.value,
    position: positionInput.value,
    date: dateInput.value,
    link: linkInput.value,
    status: statusInput.value,
    notes: notesInput.value,
  };

  if (editIndex.value) jobs[editIndex.value] = data;
  else jobs.push(data);

  jobModal.style.display = "none";
  renderJobs();
};

renderJobs();
