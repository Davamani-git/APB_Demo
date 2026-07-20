### Screenshots Mockup Description

This document describes the visual layout and key components of the Credit Card Expenditure Dashboard application as it would appear on a desktop screen.

**1. Overall Layout & Theme:**
- The application uses a clean, modern interface with a light theme by default. A dark mode is available via a toggle in the header.
- The layout is fully responsive, built on the Bootstrap 5 grid system.
- The primary font is a standard sans-serif for readability, with a monospace font used for the credit card numbers to give a classic digital look.

**2. Header:**
- A fixed navigation bar at the top of the screen.
- **Left Side:** The application title, "Credit Card Expenditure Dashboard," preceded by a credit card icon (`<i class="fa-solid fa-credit-card"></i>`).
- **Right Side:** A toggle button with a moon icon (`<i class="fa-solid fa-moon"></i>`) for switching to dark mode. In dark mode, this icon changes to a sun (`<i class="fa-solid fa-sun"></i>`).

**3. Summary Metrics Section:**
- A row of six responsive cards located just below the header.
- Each card has a subtle shadow and a hover effect. It contains:
    - An icon in a colored circle on the left (e.g., a wallet for Total Limit).
    - A title in muted text (e.g., "Total Outstanding").
    - The corresponding value in a large, bold font, formatted as INR (e.g., "₹10,00,000").
- The "Overall Utilization" card additionally features a horizontal progress bar visually representing the percentage.

**4. Credit Cards Section:**
- A row displaying three distinct credit card widgets.
- Each widget is designed to look like a physical credit card, with a dark blue/black gradient background and white text.
- It shows the Bank Name, a masked Card Number, Card Name, and Due Date.
- The bottom part of the card widget displays the current Outstanding and Available credit for that specific card.

**5. Analytics & Charts Section:**
- This section is split into two rows to present data visualizations effectively.
- **First Row:**
    - **Category-wise Spending:** A doughnut chart on the left (approx. 1/3 width) showing the spending distribution across different categories like 'Shopping', 'Food & Dining', etc. A legend is displayed to the right of the chart.
    - **Monthly Spending Trend:** A line chart on the right (approx. 2/3 width) plotting the total expenditure over the last 12 months, showing seasonal trends.
- **Second Row:**
    - **Top Spending Categories:** A card containing a simple list of the top 5 categories by spend, with the total amount for each displayed in a badge.
    - **Top Merchants:** A similar card listing the top 5 merchants by spend.
    - **Monthly Spend Forecast:** A prominent card featuring a "magic wand" icon and displaying a large, bold forecasted spending amount for the current month.

**6. Transactions Section:**
- A large card that dominates the lower half of the page, titled "Transactions."
- **Header Area:** Contains an "Export to CSV" button and a "Toggle Filters" button.
- **Filter Panel:** A collapsible panel appears when the toggle is clicked, offering inputs to filter by Merchant, Category, Card, and a Date Range.
- **Table:** A responsive, striped table lists the transactions. 
    - **Headers:** Date, Merchant, Category, Amount, Card, Status. Each header has a sort icon, indicating it's clickable for sorting.
    - **Rows:** Each row represents a transaction. Clicking a row opens the Transaction Detail Modal. Amounts are right-aligned and formatted as INR. The 'Status' is shown as a colored badge (e.g., green for 'Completed').

**7. Transaction Detail Modal:**
- When a transaction row is clicked, a modal window overlays the screen.
- It presents a clean, detailed breakdown of the selected transaction, including Transaction ID, full date, merchant, amount, category, card used (with masked number), and status.