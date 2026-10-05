const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
let pendingDeleteRow = null;

function toast(message, type = "") {
  const container = $("#toasts");
  if (!container) return;
  const item = document.createElement("div");
  item.className = `toast ${type}`.trim();
  item.setAttribute("role", "status");
  item.textContent = message;
  container.append(item);
  window.setTimeout(() => item.remove(), 3500);
}

function achievementToast(title, description, xp) {
  const container = $("#toasts");
  if (!container) return;
  const item = document.createElement("div");
  item.className = "toast achievement-toast";
  item.setAttribute("role", "status");
  const label = document.createElement("div");
  label.className = "achievement-toast-label";
  label.textContent = "ACHIEVEMENT UNLOCKED · DEMO";
  const name = document.createElement("div");
  name.className = "achievement-toast-title";
  name.textContent = title;
  const detail = document.createElement("p");
  detail.className = "achievement-toast-description";
  detail.textContent = description;
  const reward = document.createElement("span");
  reward.className = "achievement-toast-xp";
  reward.textContent = xp;
  item.append(label, name, detail, reward);
  container.append(item);
  window.setTimeout(() => item.remove(), 5000);
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function applyFilters() {
  const query = $("[data-filter-search]")?.value.trim().toLowerCase() || "";
  const level = $("[data-filter-level]")?.value || "";
  const status = $("[data-filter-status]")?.value || "";
  let visibleCount = 0;

  $$("[data-filter-item]").forEach((item) => {
    const matchesQuery = !query || item.textContent.toLowerCase().includes(query);
    const matchesLevel = !level || item.dataset.level === level;
    const matchesStatus = !status || item.dataset.status === status;
    const visible = matchesQuery && matchesLevel && matchesStatus;
    item.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  const emptyState = $("[data-empty-state]");
  if (emptyState) emptyState.hidden = visibleCount !== 0;
  const count = $("[data-result-count]");
  if (count) count.textContent = `${visibleCount} ${visibleCount === 1 ? "result" : "results"}`;
}

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const button = target.closest("[data-menu], [data-open], [data-close], [data-toast], [data-tab], [data-check-answer], [data-run], [data-delete-row], [data-confirm-delete], [data-achievement-title]");
  if (!button) return;

  if (button.hasAttribute("data-delete-row")) {
    pendingDeleteRow = button.closest("tr");
    const modal = $("#delete-course-dialog");
    if (modal) {
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      $("[data-confirm-delete]", modal)?.focus();
    }
  }

  if (button.hasAttribute("data-confirm-delete") && pendingDeleteRow) {
    const courseName = $("td", pendingDeleteRow)?.textContent.trim() || "Course";
    pendingDeleteRow.remove();
    pendingDeleteRow = null;
    closeModal(button.closest(".modal"));
    toast(`${courseName} was removed from this demo list.`);
    applyFilters();
  }

  if (button.hasAttribute("data-menu")) {
    const sidebar = $("#sb");
    if (sidebar) {
      const app = sidebar.closest(".app");
      if (window.matchMedia("(max-width: 820px)").matches) {
        app?.classList.remove("sidebar-collapsed");
        sidebar.classList.toggle("open");
      } else if (app) {
        app.classList.toggle("sidebar-collapsed");
      }
    }
  }

  if (button.dataset.open) {
    const modal = document.getElementById(button.dataset.open);
    if (modal) {
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      $("[autofocus]", modal)?.focus();
    }
  }

  if (button.hasAttribute("data-close")) closeModal(button.closest(".modal"));

  if (button.dataset.toast) {
    toast(button.dataset.toast, button.dataset.type || "");
    closeModal(button.closest(".modal"));
  }

  if (button.dataset.achievementTitle) {
    achievementToast(
      button.dataset.achievementTitle,
      button.dataset.achievementDescription || "Milestone reached in your C learning path.",
      button.dataset.achievementXp || "+50 XP"
    );
  }

  if (button.dataset.tab) {
    $$("[data-tab]").forEach((tab) => tab.setAttribute("aria-selected", String(tab === button)));
    $$("[data-panel]").forEach((panel) => {
      panel.hidden = panel.dataset.panel !== button.dataset.tab;
    });
    if (button.dataset.tab === "in") history.replaceState(null, "", location.pathname);
    if (button.dataset.tab === "up") history.replaceState(null, "", `${location.pathname}?mode=register`);
  }

  if (button.hasAttribute("data-check-answer")) {
    const result = $("#quiz-result");
    const answer = $('input[name="quiz-answer"]:checked');
    if (!result) return;
    if (!answer) {
      result.textContent = "Choose an answer before checking.";
      result.className = "error-text";
      result.setAttribute("role", "alert");
    } else if (answer.value === "main") {
      result.textContent = "Correct. main() is where a standard C program begins.";
      result.className = "hint";
      result.setAttribute("role", "status");
      const badge = $("#lesson-status");
      if (badge) {
        badge.textContent = "Completed";
        badge.className = "badge b-completed";
      }
    } else {
      result.textContent = "Not quite. Review the topic and try again.";
      result.className = "error-text";
      result.setAttribute("role", "alert");
    }
  }

  if (button.hasAttribute("data-run")) {
    const output = $("#editor-output");
    if (output) output.textContent = 'Sum: 8\n(sample output — C compilation is not connected)';
  }
});

function onFilterChange(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLSelectElement)) return;
  if (!target.matches("[data-filter-search], [data-filter-level], [data-filter-status]")) return;
  applyFilters();
}
document.addEventListener("input", onFilterChange);
document.addEventListener("change", onFilterChange);

document.addEventListener("submit", (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;

  if (form.matches("[data-demo-form]")) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const message = form.dataset.successMessage || "Saved successfully.";
    toast(message);
    const modal = form.closest(".modal");
    closeModal(modal);
    form.reset();
  }

  if (form.matches("[data-auth-form]")) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    location.href = "dashboard.html";
  }

  if (form.matches("[data-create-course]")) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const title = form.elements.namedItem("title").value.trim();
    const level = form.elements.namedItem("level").value;
    const description = form.elements.namedItem("description").value.trim();
    const body = $("#courses-body");
    if (!body) return;

    const row = document.createElement("tr");
    row.dataset.filterItem = "";
    row.dataset.courseRow = "";
    row.dataset.status = "draft";
    const titleCell = document.createElement("td");
    const titleText = document.createElement("strong");
    titleText.textContent = title;
    titleCell.append(titleText);
    if (description) {
      const descriptionText = document.createElement("span");
      descriptionText.className = "small muted";
      descriptionText.textContent = description;
      titleCell.append(document.createElement("br"), descriptionText);
    }
    const levelCell = document.createElement("td");
    const levelBadge = document.createElement("span");
    levelBadge.className = `badge b-${level}`;
    levelBadge.textContent = level.charAt(0).toUpperCase() + level.slice(1);
    levelCell.append(levelBadge);
    const lessonsCell = document.createElement("td");
    lessonsCell.textContent = "0";
    const statusCell = document.createElement("td");
    const statusBadge = document.createElement("span");
    statusBadge.className = "badge b-pending";
    statusBadge.textContent = "Draft";
    statusCell.append(statusBadge);
    const actionsCell = document.createElement("td");
    const actions = document.createElement("div");
    actions.className = "row";
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "btn btn-outline btn-sm";
    editButton.dataset.toast = "Course editing is not connected in this demo.";
    editButton.textContent = "Edit";
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "btn btn-outline btn-sm";
    deleteButton.dataset.deleteRow = "";
    deleteButton.textContent = "Delete";
    actions.append(editButton, deleteButton);
    actionsCell.append(actions);
    row.append(titleCell, levelCell, lessonsCell, statusCell, actionsCell);
    body.prepend(row);
    closeModal(form.closest(".modal"));
    form.reset();
    applyFilters();
    toast(`${title} was added as a draft.`);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") $$(".modal.open").forEach(closeModal);
});

const mode = new URLSearchParams(location.search).get("mode");
if (mode === "register") {
  const registerTab = $('[data-tab="up"]');
  registerTab?.click();
}
