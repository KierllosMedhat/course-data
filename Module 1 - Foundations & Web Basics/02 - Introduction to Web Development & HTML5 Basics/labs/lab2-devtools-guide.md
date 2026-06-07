# Lab 2: Explore Browser DevTools

In this lab, you will learn how to inspect and manipulate the Document Object Model (DOM) directly in your browser. Note: These changes are temporary and will disappear when you refresh the page.

## 🛠️ Step-by-step Tasks

### TODO 1: Open DevTools
1. Open your completed `lab1-profile.html` in Chrome or Edge using Live Server.
2. Open DevTools:
   - Press `F12` OR `Ctrl+Shift+I` (Windows) / `Cmd+Opt+I` (Mac).
   - Alternatively, right-click anywhere on the page and select **Inspect**.

### TODO 2: Inspect and Edit Text
1. Go to the **Elements** tab in DevTools.
2. Locate your `<h1>` element with your name.
3. Double-click the text inside the `<h1>` element in DevTools.
4. Change it to something else (e.g., "Web Developer Rockstar") and press `Enter`.
5. Check if the webpage instantly displays the new text.

### TODO 3: Edit HTML Attributes
1. In the **Elements** tab, locate the `<body>` tag.
2. Right-click on the `<body>` tag and choose **Edit as HTML** or **Add Attribute**.
3. Add a temporary style attribute to change the background color:
   - Add: `style="background-color: lightyellow;"`
4. Verify if the page background turns yellow.

### TODO 4: Use the JavaScript Console
1. Switch to the **Console** tab at the top of the DevTools panel.
2. Type the following JavaScript code and press `Enter`:
   ```javascript
   document.title = "I changed the title!"
   ```
3. Look at your browser tab. Did the text of the tab change?

### TODO 5: Refresh the Page
1. Reload/refresh your browser page (press `F5` or the refresh button).
2. Observe what happens to your temporary changes. 
3. *Why did they disappear? (Discuss with a peer or note down your answer)*
