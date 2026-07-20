# Screenshot Mockup Description

This document describes the visual layout and components of the Credit Card Expenditure Dashboard as if they were screenshots.

### 1. Main Dashboard View (Initial Load)

-   **Header**: A fixed navigation bar at the top with the title "Expenditure Dashboard" and a credit card icon. On the far right, there's a toggle switch for Dark/Light mode.
-   **Loading State**: Upon opening, a semi-transparent black overlay covers the entire screen with a centered loading spinner and the text "Loading Dashboard..." This disappears once the data is loaded.
-   **Dashboard Summary**: A horizontal row of six responsive cards, each displaying a key metric: 'Total Monthly Spend', 'Total Credit Limit', 'Total Available Credit', 'Total Outstanding', 'Avg. Utilization', and 'Transactions (Month)'. Amounts are formatted in INR (₹).
-   **Spending Analytics**: Below the summary, a section titled "Spending Analytics" contains two rows of charts and info cards:
    -   **Row 1**: A doughnut chart on the left (approx. 1/3 width) showing 'Category-wise Spending'. A line chart on the right (approx. 2/3 width) shows the 'Monthly Spending Trend' for the last 12 months.
    -   **Row 2**: Three cards side-by-side. The first shows 'Top 5 Spending Categories' as a list. The second shows 'Top 5 Merchants'. The third, 'Financial Snapshot', contains a 'Monthly Spend Forecast' progress bar and a list of the 5 most 'Recent Transactions'.
-   **My Cards**: A section displaying three credit cards, each rendered as a stylish, dark-themed card with the bank name, masked card number, and details like Credit Limit, Available Credit, and Outstanding amount. A progress bar at the bottom of each card visually represents its credit utilization.
-   **Transactions Table**: The largest component at the bottom. It's a card containing a full-featured transaction management system.
    -   **Header**: A title "Transactions" and a green "Export to CSV" button.
    -   **Filters**: A row of input fields and dropdowns to filter transactions by Merchant, Category, Card, Start Date, and End Date. A "Clear" button resets the filters.
    -   **Table**: A responsive, striped table lists all transactions with sortable columns for Date, Merchant, Category, and Amount. Each row also shows the card used, payment status (as a colored badge), and a "View" button.

### 2. Transaction Detail Modal

-   **Appearance**: When a user clicks the "View" button on a transaction row, a modal window appears, centered on the screen, dimming the background.
-   **Content**: The modal is titled "Transaction Details" and displays a clean, key-value list of all information for the selected transaction: Transaction ID, Full Date, Merchant, Amount (in bold), Category, Card Used (with masked number), Status, and any Remarks.
-   **Action**: A "Close" button at the bottom dismisses the modal.

### 3. Dark Mode

-   **Activation**: Clicking the moon/sun icon in the header toggles Dark Mode.
-   **Appearance**: The entire UI smoothly transitions. The background becomes dark gray, text becomes light gray, and all cards and tables adapt to the dark theme, providing a comfortable viewing experience in low-light conditions. The charts also adapt, with legend text turning white.
