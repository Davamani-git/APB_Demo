### Architecture and Design Decisions

As the Senior UI Engineer for this project, I made specific architectural and design choices to ensure the application is modular, maintainable, secure, and provides a high-quality user experience, aligning with standards expected in financial institutions.

**1. Technology Stack Selection:**
-   **AngularJS 1.8.x:** Chosen as per the explicit requirement. This version is the final Long-Term Support (LTS) release, ensuring maximum stability for a legacy framework. My implementation uses the 'controller as' syntax (`DashboardController as vm`) and avoids direct `$scope` manipulation where possible, which is a step towards modern component-based architecture and makes the code cleaner and more testable.
-   **Bootstrap 5:** Selected for its robust, mobile-first responsive grid system and pre-styled components. This accelerates UI development and guarantees a consistent look and feel across all devices.
-   **Chart.js 2.9.4 & angular-chart.js 1.1.1:** This combination was specified and is a reliable choice for data visualization within an AngularJS context. It provides a declarative way to create charts (`<canvas chart-doughnut>`), separating chart logic from the controller.

**2. Application Architecture (MVVM-inspired MVC):**
-   **Model-View-Controller (MVC):** The application strictly follows the separation of concerns principle inherent in AngularJS's MVC pattern.
    -   **Model:** Represented by the data structures within `dataService.js`. This service acts as the single source of truth for all application data (cards, transactions). In a real-world scenario, this service would be the sole point of interaction with a backend API, encapsulating all HTTP logic.
    -   **View:** The `index.html` file serves as the declarative template. It contains no business logic and is responsible only for presenting the data provided by the controller.
    -   **Controller (`dashboardController.js`):** This acts as the orchestrator or ViewModel (in MVVM terms). It fetches data from the `dataService`, processes it into a format suitable for the view, and exposes data and functions to the view via the `vm` (ViewModel) object. It handles user interactions (clicks, form inputs) and updates the view accordingly.

-   **Service-Oriented Design:**
    -   The `dataService.js` is a critical design choice. All business logic (filtering, sorting, aggregation, calculations for metrics and charts) is encapsulated within this service. This makes the controller lean and focused on view-related logic. It also promotes reusability and simplifies unit testing, as the data logic can be tested in isolation.

**3. PCI-DSS Compliance and Security Mindset:**
-   **Data Masking:** As per PCI DSS Requirement 3.3, credit card numbers in the mock data are masked (`XXXX-XXXX-XXXX-4567`). This is a fundamental practice to prevent accidental exposure of sensitive Primary Account Numbers (PAN) on screen.
-   **No Client-Side Storage of Sensitive Data:** The application does not use `localStorage` or `sessionStorage` to persist sensitive information. While a dark mode preference could be stored, no transactional or card data would ever be placed there.
-   **Secure API Communication (Simulated):** Comments within `dataService.js` explicitly state that in a production environment, all communication with a backend must occur over HTTPS to protect data in transit (PCI DSS Req 4.1).
-   **Separation of Concerns:** The architecture itself is a security feature. By isolating data access to a service, we create a clear boundary that can be secured and audited. The view never directly accesses or manipulates raw data.

**4. User Experience (UX) and Feature Implementation:**
-   **Loading State:** An initial loading spinner prevents the user from seeing a jarring flash of un-styled or incomplete content. This improves perceived performance and provides feedback that the application is working.
-   **Responsiveness:** A mobile-first approach using Bootstrap ensures the dashboard is fully functional and readable on devices ranging from small phones to large desktops.
-   **Interactivity:** Features like real-time filtering, column sorting, and modal popups create a dynamic and engaging experience, allowing users to explore their data intuitively.
-   **Advanced Features:**
    -   **Dark Mode:** Implemented by toggling a class on the `<body>` tag. This is a modern accessibility and user-preference feature that demonstrates attention to detail.
    -   **CSV Export:** A practical utility for users who need to perform offline analysis. The logic is handled entirely on the client side for this demonstration.
    -   **Forecasting & Analysis:** The inclusion of a spend forecast, top categories, and top merchants elevates the application from a simple data display to a true analytical tool, providing actionable insights to the user.