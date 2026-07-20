# Credit Card Expenditure Dashboard

This document outlines the setup instructions, architecture, and design decisions for the AngularJS Credit Card Expenditure Dashboard application.

## 1. Setup Instructions

This application is designed to run entirely in the browser without any build steps or backend server. 

**Prerequisites:**
- A modern web browser (e.g., Chrome, Firefox, Edge).
- A local web server to avoid potential CORS issues with local file access (`file:///...`). While not strictly necessary for this specific build, it's a best practice for web development.

**Running the Application:**

1.  **Download the Code:** Extract all files into a single directory, maintaining the `src` folder structure.

2.  **Use a Simple Web Server (Recommended):**
    - If you have Python installed, navigate to the `src` directory in your terminal and run:
      ```bash
      # For Python 3
      python -m http.server 8080
      ```
    - If you have Node.js installed, you can use `http-server`:
      ```bash
      # First, install it globally
      npm install -g http-server
      # Then, from the src directory, run:
      http-server -p 8080
      ```
    - Open your web browser and navigate to `http://localhost:8080`.

3.  **Direct File Access (Alternative):**
    - Navigate to the `src` folder on your local machine.
    - Double-click the `index.html` file to open it directly in your browser.
    - **Note:** Some browsers may have security restrictions when running scripts from local files. The web server method is more reliable.

## 2. Screenshots Mockup Description

Upon loading the application, the user will be presented with a clean, responsive dashboard interface.

1.  **Initial Load:** A loading spinner is displayed centrally, indicating that data is being fetched and processed. This provides immediate user feedback.

2.  **Main Dashboard View:**
    - **Header:** A fixed navigation bar at the top contains the application title ("Expenditure Dashboard") and a dark mode toggle switch.
    - **Dashboard Summary:** A row of six cards at the top provides a high-level overview: "Total Monthly Spend", "Total Credit Limit", "Total Available Credit", "Total Outstanding", "Avg. Utilization", and "Total Transactions". All monetary values are formatted in Euros (€).
    - **My Cards:** A section displaying the user's credit cards. Each card is presented in a visually distinct card component showing the masked card number, bank, credit limit (with a progress bar for utilization), available credit, and outstanding balance.
    - **Spending Analytics:** This section contains a mix of charts and analytical summaries:
        - A **Line Chart** on the left visualizes the "Monthly Spending Trend" over the past year.
        - A **Doughnut Chart** on the right shows the "Category-wise Spending" distribution.
        - Below the charts are cards for "Top Spending Categories", "Top Merchants", and a "Monthly Spend Forecast".
    - **All Transactions:** A comprehensive table at the bottom lists all transactions. It includes filter controls (search by merchant, filter by category/card) and an "Export to CSV" button. The table columns (Date, Merchant, Amount) are sortable. Each transaction row is clickable, triggering a modal popup.

3.  **Transaction Detail Modal:** Clicking on a transaction in the table opens a modal window that displays detailed information about that specific transaction, including merchant, amount, full date, category, card used, and status.

4.  **Dark Mode:** Toggling the switch in the header smoothly transitions the entire UI to a dark theme, with inverted colors for text, backgrounds, and cards, ensuring readability in low-light environments.

## 3. Architecture and Design Decisions

As a Senior UI Engineer with experience in financial applications, the architecture was chosen to prioritize modularity, maintainability, and security best practices, even within a frontend-only context.

### 3.1. AngularJS MVC (Model-View-Controller)

The application follows the classic AngularJS MVC pattern:

-   **Model:** The data for the application, managed by the `dataService`. This includes the list of cards and transactions. In a real application, this Model would be a representation of the data retrieved from a backend API.
-   **View:** The `index.html` file serves as the declarative View. It contains the HTML structure, Bootstrap components, and AngularJS directives (`ng-repeat`, `ng-if`, `ng-click`, etc.). It is responsible for presentation only and contains no business logic.
-   **Controller:** The `dashboardController.js` acts as the Controller. It connects the Model and the View. It fetches data from the `dataService`, processes it into a format suitable for display (the ViewModel), and exposes functions to the View to handle user interactions (e.g., sorting, filtering).

### 3.2. Key Design Decisions

-   **Modular Structure:** The code is split into logical files (`app.js`, `dataService.js`, `dashboardController.js`). This separation of concerns makes the codebase easier to understand, debug, and scale. New features can be added by creating new controllers or services without impacting existing ones.

-   **Service for Data Abstraction (`dataService.js`):** All data access is centralized in the `dataService`. This is the most critical architectural decision. It completely decouples the controllers from the data source. If the application needed to switch from mock data to a live REST API, only the `dataService` would need to be updated. The controllers and views would function without any changes.

-   **'Controller As' Syntax:** The `dashboardController` uses the `controller as vm` syntax. This is a modern AngularJS best practice that improves code readability and avoids potential issues with `$scope` inheritance, making the ViewModel (`vm`) explicit in the template.

-   **Asynchronous Operations with Promises (`$q`):** The `dataService` returns promises to simulate real-world asynchronous API calls. The controller correctly handles these promises, ensuring that data processing and UI updates only occur after the data has been successfully retrieved. This prevents race conditions and makes the application more robust.

-   **Embedded Mock Data:** For this demonstration, mock data is generated within the `dataService`. This makes the application self-contained and instantly runnable without any backend dependencies, which was a key requirement.

### 3.3. PCI-DSS Compliance Mindset

While this is a mock application, it was developed with a PCI-DSS compliance mindset, which is critical for any financial application.

-   **No Sensitive Data in Frontend:** The code and comments repeatedly emphasize that in a production environment, no sensitive Cardholder Data (CHD) like full Primary Account Numbers (PAN), CVV codes, or expiration dates would ever be present in the JavaScript code, variables, or browser storage.
-   **Displaying Masked Data:** The mock card numbers are already masked (`XXXX-XXXX-XXXX-4567`), adhering to PCI-DSS requirements for displaying PANs. Only the last four digits are shown.
-   **Secure API Communication:** The architecture is designed for secure communication. The `dataService` would be the single point of contact with a backend, and all communication would be over HTTPS with proper authentication and authorization mechanisms (e.g., OAuth 2.0, JWT).
-   **Tokenization:** The architecture explanation highlights that a real-world implementation would rely heavily on tokenization, where sensitive data is replaced with a non-sensitive equivalent (a token) before it ever reaches the client-side application.