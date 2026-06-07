// src/main.js
// TODO: Import TaskManager, instantiate it, and connect it to the DOM events.

import { TaskManager } from "./TaskManager.js";

// 1. TODO: Instantiate TaskManager
const manager = null;

// DOM elements
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const pendingCount = document.getElementById("pending-count");

// 2. TODO: Implement updateUI() to clear the list, rebuild task items, and update count
function updateUI() {
  // Use manager.tasks and manager.pendingCount
}

// 3. TODO: Handle adding a task on 'Enter' keypress in taskInput
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const title = taskInput.value.trim();
    if (title) {
      // Add and clear input
    }
  }
});

// 4. TODO: Handle toggle and delete events using Event Delegation on taskList
taskList.addEventListener("click", (e) => {
  // Use e.target.closest() or check data-id attributes
});
