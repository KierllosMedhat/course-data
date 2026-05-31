// DOM MANIPULATION & EVENTS — Lecture 11

// ===== 1. SELECTING ELEMENTS =====
const title = document.getElementById("main-title");
const texts = document.getElementsByClassName("text"); // Returns HTMLCollection
const box = document.querySelector("#interactive-box"); // Returns first match
const allTexts = document.querySelectorAll(".text"); // Returns NodeList

console.log(title.textContent);

// ===== 2. MODIFYING ELEMENTS =====
// Text and HTML
title.textContent = "DOM Manipulation Mastery";
// title.innerHTML = "DOM Manipulation <em>Mastery</em>";

// CSS Styles (Inline)
title.style.color = "#0077cc";

// Classes (Preferred way to style)
// box.classList.add("highlight");
// box.classList.remove("highlight");
// box.classList.toggle("highlight");
console.log("Box classes:", box.classList.contains("highlight"));

// Attributes
box.setAttribute("data-state", "active");
console.log(box.getAttribute("data-state"));

// ===== 3. CREATING & APPENDING ELEMENTS =====
const addBtn = document.getElementById("add-item-btn");
const list = document.getElementById("item-list");

addBtn.addEventListener("click", () => {
  // 1. Create element
  const newLi = document.createElement("li");
  
  // 2. Modify it
  newLi.textContent = `New Item ${list.children.length + 1}`;
  
  // 3. Append to DOM
  list.appendChild(newLi);
});

// ===== 4. EVENTS & EVENT LISTENERS =====
const toggleBtn = document.getElementById("toggle-btn");

// Modern way (allows multiple listeners)
toggleBtn.addEventListener("click", function(event) {
  // event object contains details about the event
  console.log("Button clicked at:", event.clientX, event.clientY);
  box.classList.toggle("highlight");
});

// Mouse events on the box
box.addEventListener("mouseenter", () => box.style.borderRadius = "50%");
box.addEventListener("mouseleave", () => box.style.borderRadius = "0");

// ===== 5. EVENT PREVENT DEFAULT & FORM SUBMIT =====
const form = document.getElementById("my-form");
const nameInput = document.getElementById("name-input");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // Stop page reload
  
  const name = nameInput.value.trim();
  if (name) {
    alert(`Form submitted for: ${name}`);
    nameInput.value = ""; // Clear input
  } else {
    alert("Please enter a name.");
  }
});

// ===== 6. EVENT BUBBLING & DELEGATION =====
// Instead of adding an event listener to EVERY <li>,
// we add ONE listener to the parent <ul>
list.addEventListener("click", (e) => {
  // Check if the clicked target is an <li>
  if (e.target.tagName === "LI") {
    e.target.style.textDecoration = "line-through";
  }
});
