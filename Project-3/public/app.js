const rows = document.getElementById("studentRows");
const modal = document.getElementById("studentModal");
const form = document.getElementById("studentForm");
const message = document.getElementById("formMessage");
const saveBtn = document.getElementById("saveBtn");
const toast = document.getElementById("toast");
let editingId = null;
let toastTimer;

async function api(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.errors ? result.errors.join(" ") : result.message || "Request failed.");
  return result;
}

function notify(text) {
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}

async function loadStudents(search = "") {
  try {
    const result = await api(`/api/students?search=${encodeURIComponent(search)}`);
    document.getElementById("totalCount").textContent = result.count;
    document.getElementById("recordCount").textContent = `Showing ${result.count} record${result.count === 1 ? "" : "s"}`;
    if (!result.data.length) {
      rows.innerHTML = `<tr><td colspan="5" class="empty">No student records found. Add your first student.</td></tr>`;
      return;
    }
    rows.innerHTML = result.data.map(student => `
      <tr>
        <td>${escapeHtml(student.full_name)}<span class="muted">${escapeHtml(student.email || "No email provided")}</span></td>
        <td>${escapeHtml(student.matric_no)}</td>
        <td>${escapeHtml(student.department)}</td>
        <td><span class="level">${escapeHtml(student.level)} level</span></td>
        <td><div class="actions"><button class="small-btn" data-edit="${student.id}">Edit</button><button class="small-btn delete" data-delete="${student.id}">Delete</button></div></td>
      </tr>`).join("");
  } catch (error) {
    rows.innerHTML = `<tr><td colspan="5" class="empty">${escapeHtml(error.message)}</td></tr>`;
  }
}

function openModal(student = null) {
  editingId = student ? student.id : null;
  form.reset();
  message.textContent = "";
  document.getElementById("modalTitle").textContent = student ? "Edit student" : "Add a student";
  saveBtn.textContent = student ? "Update student" : "Save student";
  if (student) {
    for (const [key, value] of Object.entries(student)) {
      if (form.elements[key]) form.elements[key].value = value || "";
    }
  }
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
  editingId = null;
}

document.getElementById("addBtn").addEventListener("click", () => openModal());
document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("cancelBtn").addEventListener("click", closeModal);
modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });

form.addEventListener("submit", async event => {
  event.preventDefault();
  message.textContent = "";
  saveBtn.disabled = true;
  saveBtn.textContent = "Saving...";
  const payload = Object.fromEntries(new FormData(form).entries());
  try {
    const url = editingId ? `/api/students/${editingId}` : "/api/students";
    await api(url, { method: editingId ? "PUT" : "POST", body: JSON.stringify(payload) });
    closeModal();
    await loadStudents(document.getElementById("searchInput").value);
    notify(editingId ? "Student updated successfully." : "Student added successfully.");
  } catch (error) {
    message.textContent = error.message;
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = editingId ? "Update student" : "Save student";
  }
});

rows.addEventListener("click", async event => {
  const editButton = event.target.closest("[data-edit]");
  const deleteButton = event.target.closest("[data-delete]");
  if (editButton) {
    try {
      const result = await api(`/api/students/${editButton.dataset.edit}`);
      openModal(result.data);
    } catch (error) { notify(error.message); }
  }
  if (deleteButton) {
    const id = deleteButton.dataset.delete;
    if (!confirm("Delete this student record? This action cannot be undone.")) return;
    try {
      await api(`/api/students/${id}`, { method: "DELETE" });
      await loadStudents(document.getElementById("searchInput").value);
      notify("Student deleted successfully.");
    } catch (error) { notify(error.message); }
  }
});

let searchTimer;
document.getElementById("searchInput").addEventListener("input", event => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => loadStudents(event.target.value), 250);
});

loadStudents();
