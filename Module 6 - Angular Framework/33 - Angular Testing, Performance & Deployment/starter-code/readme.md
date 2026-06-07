# ShopAngular Deployment Instructions

This guide covers how to resolve the SPA (Single Page Application) routing trap when deploying to static host providers like Netlify.

## Step-by-Step Configuration

### 1. The SPA Redirect Caveat
When running an Angular SPA, all navigation is handled by the client-side router. However, if a user directly hits an sub-route (e.g., `https://site.com/products/101`) or refreshes the page, the static file server tries to look for a physical folder/file matching that URL.
Since only `index.html` exists, the server returns a **404 Not Found**.

To prevent this:
- **Netlify** looks for a `_redirects` file at the root of the published browser folder.
- The content of `_redirects` must be:
  ```text
  /*    /index.html   200
  ```

### 2. Configure Angular CLI to Bundle the Redirect Rule
You must tell the Angular builder to copy the `_redirects` file from your source folder into the final compiled `dist/browser` directory during the build process.

1. Place the `_redirects` file in your `src/` folder (next to `index.html`, `main.ts`, etc.).
2. Open `angular.json` in your project root.
3. Locate the `projects` -> `[your-app-name]` -> `architect` -> `build` -> `options` -> `assets` array.
4. Add your `_redirects` file path:
   ```json
   "assets": [
     "src/favicon.ico",
     "src/assets",
     "src/_redirects"
   ]
   ```

### 3. Build for Production
Run the production build script in your terminal:
```bash
ng build
```
This compilation creates optimized bundles inside:
`dist/[your-app-name]/browser/`

### 4. Deploy to Netlify
1. Log in to your Netlify dashboard.
2. Drag and drop the compiled **`browser/`** folder (from the path above) directly into the deployment upload box.
3. Once deployed, test refreshing deep URLs or navigating directly to them to verify it works without 404 errors!
