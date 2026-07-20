# Credit Card Expenditure Dashboard - Architecture & Design

As a Senior UI Engineer with extensive experience in financial applications, I have designed this AngularJS dashboard with modularity, maintainability, and security principles in mind, even within a mock data environment.

### 1. Project Structure

The project follows a standard, scalable structure for AngularJS applications:

```
src/
├── css/
│   └── styles.css         # Custom styles, including dark mode theme.
├── js/
│   ├── app.js             # Main AngularJS module definition and configuration.
│   ├── controllers/
│   │   └── dashboardController.js # Logic for the main dashboard view.
│   └── services/
│       └── dataService.js   # Handles data retrieval and mock data storage.
└── index.html             # The single entry point of the application (SPA).
```

This separation of concerns is critical. HTML contains the structure, CSS the presentation, and JavaScript the logic. Within JavaScript, `app.js` initializes the application, `dataService.js` isolates data handling, and `dashboardController.js` connects the data to the view.

### 2. Architecture & Design Decisions

- **Model-View-Controller (MVC):** The application strictly adheres to the MVC pattern promoted by AngularJS.
    - **Model:** The data provided by `dataService.js` and the processed data on the controller's `vm` (ViewModel) object serve as the model.
    - **View:** `index.html` is the view, declaratively bound to the ViewModel. It contains no logic, only presentation and bindings (`{{ }}`, `ng-repeat`, etc.).
    - **Controller:** `dashboardController.js` acts as the controller, preparing the data from the service for the view and handling user interactions.

- **Service-Oriented Architecture:** The `dataService` is a prime example of this. By creating a dedicated service for data, we achieve:
    - **Decoupling:** The controller doesn't know *how* the data is fetched (mock, `$http`, etc.). It only knows to ask the service for it.
    - **Reusability:** Other controllers or components could reuse this service.
    - **Single Source of Truth:** All data comes from one place, preventing inconsistencies.
    - **Asynchronous Simulation:** Using `$q` and `$timeout`, the service simulates real-world API latency. This forces the application to be designed asynchronously from the start, making it easy to swap in a real `$http` service later. It also allows for the implementation of a robust loading state.

- **Controller As Syntax:** The code uses `controller as vm` syntax. This is a best practice that avoids common issues with `$scope` inheritance and makes the view bindings more explicit and readable (e.g., `vm.transactions` instead of just `transactions`).

- **Dependency Injection (DI):** AngularJS's DI framework is used throughout (`$scope`, `dataService`, `$q`, `$filter`). This makes components highly testable and modular, as dependencies can be easily mocked during unit testing.

- **PCI-DSS Compliance Mentality:** Although this is a mock application, comments are included to reflect a security-first mindset. For instance, noting that real card numbers (PANs) would never be handled client-side and that all communication must be over HTTPS. The displayed card numbers are masked, which is a standard security practice.

### 3. Feature Implementation Highlights

- **Dynamic Metrics & Charts:** All dashboard numbers and charts are calculated dynamically in the controller after data is fetched. This ensures that if the data source changes, the entire UI updates automatically.

- **Chart.js Integration:** `angular-chart.js` provides directives (`chart-line`, `chart-doughnut`) that declaratively link the `<canvas>` element to data on the controller's scope. This keeps the view clean and the chart configuration logic neatly organized in the controller.

- **Dark Mode:** Implemented efficiently using a single class (`.dark-mode`) on the `<body>` tag. A simple CSS file (`styles.css`) contains all the overrides for Bootstrap components, making it easy to manage and extend the theme.

- **Transaction Detail Modal:** A single Bootstrap modal is used. Its content is dynamically populated by the `showTransactionDetails(transaction)` function, which sets a `vm.selectedTransaction` object. This is more efficient than creating a modal for each transaction.

- **CSV Export:** This is handled entirely on the client side. The function constructs a CSV string from the currently filtered transaction data and uses a temporary `<a>` tag to trigger a browser download. This is a lightweight and effective solution for a front-end application.

- **Spend Forecast:** A simple but effective forecasting method is used (average of the last 3 months' spend). This provides a useful data point without requiring complex libraries or backend processing.

### 4. Setup Instructions

This application is designed to be completely self-contained and run without any build steps or a web server.

1.  **Extract Files:** Create the folder structure as defined above (`src/`, `src/css/`, `src/js/`, etc.).
2.  **Place Files:** Put the content of each file (`index.html`, `styles.css`, `app.js`, etc.) into its corresponding location.
3.  **Open in Browser:** Open the `src/index.html` file directly in a modern web browser (like Chrome, Firefox, or Edge).

That's it. The application will load, display a brief loading spinner while the mock data is processed, and then render the full dashboard.

### 5. Screenshots Mockup Description

1.  **Initial Load:** The screen is blank except for a centered, animated loading spinner with the text "Loading Dashboard Data..." below it. The background is a light gray.

2.  **Main Dashboard (Light Mode):**
    - **Header:** A prominent blue navigation bar at the top with the title "Expenditure Dashboard" and a toggle switch for "Dark Mode" on the right.
    - **Metrics:** Below the header, a row of four cards with colored left borders: "Total Outstanding" (red), "Available Credit" (green), "Credit Utilization" (blue with a progress bar), and "Total Cards" (yellow).
    - **Charts:** A large line chart on the left showing "Monthly Expenditure" over the last year. To its right, a smaller doughnut chart shows "Spend by Category" with a legend below it.
    - **Analysis:** A row of three cards: "Top Spending Categories" with progress bars, "Top Merchants" as a list, and "Spend Forecast" displaying a large currency value.
    - **Transactions Table:** At the bottom, a full-width card containing a table of recent transactions. The table has a search bar and an "Export CSV" button. Each row shows transaction details and has an "eye" icon to view more.

3.  **Main Dashboard (Dark Mode):**
    - The layout is identical to the light mode, but the color scheme is inverted. The background is a dark charcoal gray. Cards, tables, and modals have a slightly lighter dark gray background. Text is white or light gray. The chart colors and colored borders on the metric cards remain vibrant, providing excellent contrast.

4.  **Transaction Detail Modal:**
    - When the "eye" icon is clicked, a modal window appears, overlaying the main content with a semi-transparent dark background. The modal displays a clean, vertical list of all details for the selected transaction, such as ID, full date, merchant, amount, and the card used. It includes a security notice at the bottom and a "Close" button.