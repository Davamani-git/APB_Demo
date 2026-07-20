# Architecture and Design Decisions

This document outlines the architectural choices and design principles behind the AngularJS Credit Card Expenditure Dashboard.

### 1. Core Architecture: AngularJS MVC

The application is built following the Model-View-Controller (MVC) pattern, as facilitated by AngularJS:

-   **Model**: Represented by the `dataService.js` service. This service is the single source of truth for all application data (cards, transactions). It encapsulates the logic for fetching data. By simulating asynchronous calls with `$q` and `$timeout`, we design the application to be ready for a real backend API without major refactoring. This separation makes the data logic reusable and independently testable.

-   **View**: The `index.html` file serves as the declarative view. It contains no imperative logic. Its sole responsibility is to present the data exposed by the controller. Data binding (`{{ }}` and `ng-repeat`) and directives (`ng-click`, `ng-show`) connect the view to the controller's state, allowing Angular to handle DOM manipulation automatically.

-   **Controller**: The `dashboardController.js` acts as the controller. It connects the Model (dataService) and the View (index.html). It fetches data, processes it into a format suitable for display (e.g., calculating summaries, preparing chart data), and exposes this data and any interactive functions (e.g., `exportToCsv`, `sortBy`) to the view via the `vm` (ViewModel) object.

### 2. Design Decisions & Best Practices

-   **`controller as` Syntax**: We use the `controller as vm` syntax instead of directly manipulating the `$scope` object. This improves readability in the HTML (`vm.property` is clearer than just `property`) and avoids common issues with scope inheritance and shadowing in more complex applications.

-   **Modularity**: The application is broken into distinct files based on functionality (`app.js`, `dataService.js`, `dashboardController.js`). This aligns with the Single Responsibility Principle, making the code easier to navigate, maintain, and debug.

-   **Dependency Injection (DI)**: AngularJS's built-in DI is used extensively. The controller explicitly declares its dependencies (`dataService`, `$filter`, `$q`). This makes the component loosely coupled and highly testable, as dependencies can be easily mocked during unit testing.

-   **Service-Based Data Management**: All data access is funneled through the `dataService`. The controller is not concerned with *how* the data is obtained (mock object, local storage, or HTTP call), only that it receives it. This is a robust pattern that simplifies future migration to a live backend.

-   **Custom Filters**: For reusable formatting logic, a custom filter (`inrCurrency`) is created. This keeps the controller logic clean and allows the same formatting to be applied declaratively in the HTML wherever needed.

-   **Responsive Design**: Bootstrap 5's grid system (`row`, `col-lg-*`, `col-md-*`) is used to ensure the layout is responsive and provides an optimal user experience on devices of all sizes, from mobile phones to desktops.

### 3. PCI-DSS Compliance Considerations

As a Senior UI Engineer with expertise in financial applications, security is a foremost concern, even in a mock application.

-   **No Sensitive Data on Client**: The architecture is predicated on the principle that the frontend is a "dumb" presentation layer. In a real-world scenario, sensitive information such as full Primary Account Numbers (PAN), CVV codes, or full expiration dates would **never** be sent to or stored on the client. The backend would only provide masked data (`XXXX-XXXX-XXXX-1234`) and tokens for any operations.

-   **Secure Communication**: Although not implemented here, a production version of this application would be served exclusively over **HTTPS (using TLS 1.2 or higher)** to encrypt all data in transit between the client and server, preventing man-in-the-middle attacks.

-   **Audit Trail**: The `dataService` and controller logic are structured to be auditable. In a real system, functions like `exportToCsv` or any data modification would trigger logging events on the backend, creating an audit trail of user actions, which is a key requirement for compliance.

-   **Component-Based Security**: By isolating data access to a service, we create a single chokepoint for data. Security measures, logging, and validation can be enforced within this service, ensuring consistency across the application.
