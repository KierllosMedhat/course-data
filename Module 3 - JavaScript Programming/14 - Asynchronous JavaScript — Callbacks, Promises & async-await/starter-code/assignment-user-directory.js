// Assignment: User Directory (JSONPlaceholder)
// TODO: Implement parallel fetching, data merging, and search filtration with AbortController.

const directoryGrid = document.getElementById("directory-grid");
const loadingEl = document.getElementById("loading");
const searchBox = document.getElementById("search-box");

let allUsers = [];
let allPosts = [];
let searchController = null; // Track current AbortController for live search

// 1. TODO: Implement async function initDirectory()
// - Fetch users (https://jsonplaceholder.typicode.com/users) and posts (https://jsonplaceholder.typicode.com/posts) in parallel using Promise.all()
// - Merge data: For each user, count how many posts have a userId matching the user's id.
// - Save to global allUsers array (store the post count in the user object).
// - Hide loading indicator and render the directory.

async function initDirectory() {
  try {
    // Write your parallel fetch and merge logic here:
    
  } catch (error) {
    console.error("Initialization failed:", error);
    loadingEl.textContent = "Failed to load user directory.";
  }
}

// 2. TODO: Implement renderDirectory(usersToRender)
// - Clear the directoryGrid.
// - Loop through usersToRender and create profile cards dynamically.
// - Each card must display: Name, Email, Company Name (user.company.name), and post count.
// - Append cards to directoryGrid.

function renderDirectory(usersToRender) {
  // Write your DOM rendering logic here:
}

// 3. TODO: Implement abortable filterUsers(query)
// - If searchController is active, abort it.
// - Create a new AbortController.
// - Filter the allUsers array based on the query string.
// - Render the filtered users using renderDirectory.
// - Handle the AbortError gracefully.

function filterUsers(query) {
  // Write your abortable search filter logic here:
}

// Search box input listener
searchBox.addEventListener("input", (e) => {
  filterUsers(e.target.value.trim());
});

// Initialize the directory on load
initDirectory();

