document.addEventListener("DOMContentLoaded", function () {
  const priorityMap = { High: 1, Medium: 2, Low: 3 };
  const sortSelect = document.getElementById("sortOptions");
  const modal = document.getElementById("taskModal");
  const closeBtn = document.querySelector(".close-btn");
  const newTaskBtn = document.querySelector(".new-task");

  function parseDate(text) {
    const [day, month, year] = text.trim().split("/").map(Number);
    return new Date(year, month - 1, day);
  }

  function sortTasks(criteria, tbody) {
    const rows = Array.from(tbody.querySelectorAll("tr"));
    const activeRows = rows.filter(row => !row.classList.contains("completed"));
    const completedRows = rows.filter(row => row.classList.contains("completed"));

    activeRows.sort((a, b) => {
      const aPrio = priorityMap[a.children[2].textContent.trim()] || 99;
      const bPrio = priorityMap[b.children[2].textContent.trim()] || 99;
      const aDate = parseDate(a.children[4].textContent);
      const bDate = parseDate(b.children[4].textContent);

      if (criteria === "priority") {
        return aPrio - bPrio || aDate - bDate;
      } else {
        return aDate - bDate || aPrio - bPrio;
      }
    });

    tbody.innerHTML = "";
    [...activeRows, ...completedRows].forEach(row => tbody.appendChild(row));
  }

  function updateCounts() {
    const taskTable = document.querySelector("#my-tasks tbody");
    const rows = [...taskTable.querySelectorAll("tr")];
    let inProgress = 0, onHold = 0, completed = 0;

    rows.forEach(row => {
      if (row.classList.contains("completed")) completed++;
      else if (row.classList.contains("on-hold")) onHold++;
      else inProgress++;
    });

    document.querySelector(".box.in-progress span").textContent = inProgress;
    document.querySelector(".box.on-hold span").textContent = onHold;
    document.querySelector(".box.completed span").textContent = completed;
    document.querySelector(".box.total span").textContent = rows.length;
  }

  function initTaskTable(tbody, updateCount = false) {
    let pressTimer = null;
    let longPress = false;

    tbody.addEventListener("mousedown", function (e) {
      if (e.target.type === "checkbox") {
        e.preventDefault();
        const checkbox = e.target;
        const row = checkbox.closest("tr");
        longPress = false;

        pressTimer = setTimeout(() => {
          longPress = true;
          checkbox.checked = false;
          checkbox.indeterminate = true;
          row.classList.remove("completed");
          row.classList.add("on-hold");
          row.style.backgroundColor = "#fff3cd";
          if (updateCount) updateCounts();
        }, 400);
      }
    });

    tbody.addEventListener("mouseup", function () {
      clearTimeout(pressTimer);
    });

    tbody.addEventListener("click", function (e) {
      if (e.target.type === "checkbox") {
        const checkbox = e.target;
        const row = checkbox.closest("tr");

        if (longPress) {
          e.preventDefault();
          return;
        }

        if (row.classList.contains("completed") || row.classList.contains("on-hold")) {
          checkbox.checked = false;
          checkbox.indeterminate = false;
          row.classList.remove("completed", "on-hold");
          row.style.backgroundColor = "";
        } else {
          checkbox.checked = true;
          checkbox.indeterminate = false;
          row.classList.add("completed");
          row.classList.remove("on-hold");
          row.style.backgroundColor = "#d4edda";
          tbody.appendChild(row);
        }

        if (updateCount) updateCounts();
        sortTasks(sortSelect.value, tbody);
      }
    });

    sortTasks(sortSelect.value, tbody);
    if (updateCount) updateCounts();
  }

  const myTbody = document.querySelector("#my-tasks tbody");
  const teamTbody = document.querySelector("#team-tasks tbody");

  initTaskTable(myTbody, true);
  initTaskTable(teamTbody, false);

  sortSelect.addEventListener("change", () => {
    const activeTab = document.querySelector(".tab-button.active").dataset.tab;
    const tbody = document.querySelector(`#${activeTab}-tasks tbody`);
    sortTasks(sortSelect.value, tbody);
  });

  // Tabs
  const myTasksSection = document.getElementById("my-tasks");
  const teamTasksSection = document.getElementById("team-tasks");

  document.querySelectorAll(".tab-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const tab = btn.dataset.tab;
      myTasksSection.style.display = tab === "my" ? "block" : "none";
      teamTasksSection.style.display = tab === "team" ? "block" : "none";

      const tbody = document.querySelector(`#${tab}-tasks tbody`);
      sortTasks(sortSelect.value, tbody);
      if (tab === "my") updateCounts();
    });
  });

  // Δεξί Κλικ για Ανάθεση στην Ομάδα
  function assignToTeam(row) {
    const teamTbody = document.querySelector("#team-tasks tbody");
    const taskName = row.querySelector("td:nth-child(2)").textContent;
    const taskPriority = row.querySelector("td:nth-child(3)").textContent;
    const taskDesc = row.querySelector("td:nth-child(4)").textContent;
    const taskDeadline = row.querySelector("td:nth-child(5)").textContent;

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td><input type="checkbox" /></td>
      <td>${taskName}</td>
      <td class="${taskPriority.toLowerCase()}">${taskPriority}</td>
      <td>${taskDesc}</td>
      <td>${taskDeadline}</td>
    `;

    teamTbody.appendChild(newRow);
    row.remove();
    updateSummary();
    updateCounts();
  }

  function addRightClickMenu() {
    const myTasksTbody = document.querySelector("#my-tasks tbody");

    myTasksTbody.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      const row = e.target.closest("tr");
      if (!row) return;

      const menu = document.createElement("ul");
      menu.style.position = "absolute";
      menu.style.left = `${e.pageX}px`;
      menu.style.top = `${e.pageY}px`;
      menu.style.backgroundColor = "#fff";
      menu.style.border = "1px solid #ccc";
      menu.style.padding = "10px";
      menu.style.zIndex = "1000";
      menu.style.listStyleType = "none";
      menu.innerHTML = `<li id="assignToTeam">Assign to Team</li>`;

      document.body.appendChild(menu);

      document.getElementById("assignToTeam").addEventListener("click", function () {
        assignToTeam(row);
        menu.remove();
      });

      document.addEventListener("click", function () {
        menu.remove();
      }, { once: true });
    });
  }

  addRightClickMenu();

  // Modal εμφάνιση/απόκρυψη
  newTaskBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Προσθήκη Task
  document.getElementById("taskForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("taskName").value;
    const priority = document.getElementById("taskPriority").value;
    const desc = document.getElementById("taskDescription").value;
    const deadline = document.getElementById("taskDeadline").value;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="checkbox" /></td>
      <td>${name}</td>
      <td class="${priority}">${capitalize(priority)}</td>
      <td>${desc}</td>
      <td>${formatDate(deadline)}</td>
    `;

    const activeTab = document.querySelector(".tab-button.active").dataset.tab;
    const tableBody = document.querySelector(`#${activeTab}-tasks tbody`);
    tableBody.appendChild(row);

    modal.style.display = "none";
    this.reset();

    updateSummary();
  });

  function updateSummary() {
    const totalTasksBox = document.querySelector("#totalTasks");
    const inProgressBox = document.querySelector("#inProgressTasks");

    const activeTab = document.querySelector(".tab-button.active").dataset.tab;
    const rows = document.querySelectorAll(`#${activeTab}-tasks tbody tr`);

    let totalTasks = rows.length;
    let inProgressTasks = 0;

    rows.forEach(row => {
      const priority = row.querySelector("td:nth-child(3)").textContent.toLowerCase();
      if (priority === "high" || priority === "medium") {
        inProgressTasks++;
      }
    });

    totalTasksBox.textContent = `Συνολικά Tasks: ${totalTasks}`;
    inProgressBox.textContent = `In Progress: ${inProgressTasks}`;
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("el-GR");
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
});
