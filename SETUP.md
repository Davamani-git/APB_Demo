# Credit Card Expenditure Dashboard - Setup Instructions

This is a standalone AngularJS application that runs entirely in the browser. No build process, server, or special dependencies are required to run it.

## Requirements

- A modern web browser (e.g., Chrome, Firefox, Edge, Safari).
- A local copy of the project files.

## How to Run the Application

1.  **Download the Files**: Ensure you have all the project files (`index.html`, `css/styles.css`, `js/app.js`, `js/controllers/dashboardController.js`, `js/services/dataService.js`) in the correct directory structure.

2.  **Open `index.html`**: Navigate to the project's root directory on your local machine and open the `index.html` file directly in your web browser.

    -   You can do this by double-clicking the file.
    -   Or, right-click the file and choose "Open with" and select your preferred browser.

3.  **That's it!** The application will load. It fetches all necessary libraries (Bootstrap, Font Awesome, AngularJS, Chart.js) from a CDN (Content Delivery Network), so an internet connection is required on the first load. The mock data is embedded within the JavaScript files, so no backend connection is needed.

## Project Structure

The project follows a standard, modular structure for AngularJS applications:

```
/
|-- index.html              # Main HTML file (The View)
|-- css/
|   |-- styles.css          # Custom stylesheets
|-- js/
|   |-- app.js              # AngularJS module definition, filters, config
|   |-- services/
|   |   |-- dataService.js  # Service for providing mock data (The Model)
|   |-- controllers/
|       |-- dashboardController.js # Main controller for the dashboard (The Controller)
|-- SETUP.md                # These setup instructions
|-- MOCKUPS.md              # Description of the UI components
|-- ARCHITECTURE.md         # Explanation of design decisions
```
