const input = document.getElementById('searchInput');
const status = document.getElementById('status');

// We need a variable to store the CURRENT controller outside the function
let currentController = null;

input.addEventListener('input', async (e) => {
    // TODO: 1. If currentController exists, call .abort() on it!
    
    // TODO: 2. Create a new AbortController and assign it to currentController.
    
    try {
        status.textContent = "Status: Fetching...";
        
        // TODO: 3. Pass the signal to the fetch call!
        // URL: `https://jsonplaceholder.typicode.com/users?name_like=${e.target.value}`
        // await fetch(URL, { signal: currentController.signal })
        
        // If we get here, the fetch completed successfully!
        status.textContent = "Status: Done!";
    } catch (err) {
        // If the error name is 'AbortError', it means WE cancelled it.
        if (err.name === 'AbortError') {
            console.log("Fetch aborted because user typed again!");
        } else {
            console.error(err);
        }
    }
});
