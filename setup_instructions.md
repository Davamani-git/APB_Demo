### Setup Instructions

This is a pure front-end application built with AngularJS and requires no backend, build steps, or special server configuration. It can be run directly from the file system.

**Prerequisites:**
- A modern web browser (e.g., Chrome, Firefox, Edge, Safari).

**Steps to Run the Application:**

1.  **Extract Files:**
    -   Create a root folder for the project (e.g., `credit-card-dashboard`).
    -   Inside the root folder, create a `src` directory.
    -   Place the provided files into their respective locations within the `src` directory:
        ```
        credit-card-dashboard/
        └── src/
            ├── index.html
            ├── css/
            │   └── styles.css
            └── js/
                ├── app.js
                ├── controllers/
                │   └── dashboardController.js
                └── services/
                    └── dataService.js
        ```

2.  **Open in Browser:**
    -   Navigate to the `src` folder on your local machine.
    -   Double-click the `index.html` file, or right-click and choose "Open with" your preferred web browser.

3.  **Done!**
    -   The application will load in your browser. You will see a brief loading spinner, and then the dashboard will be displayed with all the mock data and interactive features.

**Note on Browser Security:**
Some browsers may have strict security policies regarding opening local files (`file:///...`). While this application is designed to work correctly under these conditions, if you encounter any issues (especially with features like CSV export), running it from a simple local web server is a more robust alternative. You can use tools like Python's `http.server`, Node.js's `http-server`, or the VS Code Live Server extension.