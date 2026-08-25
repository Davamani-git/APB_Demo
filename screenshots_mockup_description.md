### Screenshots Mockup Description

This document describes the visual layout and key components of the Santander Banking Dashboard application as it would appear on a desktop screen. The app covers two banking domains — **Accounts** and **Cards** — reached via a top-level banking menu.

**1. Overall Layout & Theme:**
- The application uses a clean, modern interface inspired by Santander's brand system: signature red (`#EC0000`) accents, bold Work Sans typography, and a light theme by default. A dark mode is available via a toggle in the header, fully re-themed to keep the red accent consistent.
- The layout is fully responsive, built on the Bootstrap 5 grid system.
- All monetary values are displayed in Euros (e.g. "€95.700"), formatted with Spanish (`es-ES`) locale grouping.
- Credit card widgets and bank account widgets are visually distinguished: cards use a red gradient (Santander red → dark red), accounts use a dark charcoal/black gradient (evoking a premium/Select account line).

**2. Header:**
- A fixed navigation bar at the top of the screen.
- **Left Side:** "Santander" wordmark preceded by a landmark/bank icon (`<i class="fa-solid fa-building-columns"></i>`) — no proprietary logo asset is used.
- **Center:** The **Banking Menu** — two pill-shaped nav items, "Accounts" (bank icon) and "Cards" (credit-card icon). The active section is filled solid red; the inactive one is muted gray. Clicking a pill switches the entire page content below without a full reload.
- **Right Side:** A toggle button with a moon icon (`<i class="fa-solid fa-moon"></i>`) for switching to dark mode. In dark mode, this icon changes to a sun (`<i class="fa-solid fa-sun"></i>`).

**3. Accounts Section (default landing view):**
- **Summary Metrics:** A row of six responsive cards — Total Balance, Total Accounts, Credits (This Month), Debits (This Month), Net Flow, and Transactions — each with a colored circular icon and a bold Euro-formatted value.
- **Bank Account Widgets:** A row of dark, card-styled widgets (one per account: Santander Cuenta 1|2|3, Current Account, Select Account), each showing the bank name, masked account number, account type, branch (Madrid, Barcelona, Valencia), balance, and masked IBAN.
- **Account Transactions:** A large card titled "Account Transactions" with an "Export to CSV" button and a "Toggle Filters" button. The collapsible filter panel offers a description search box, a category dropdown (Salary Credit, ATM Withdrawal, Fund Transfer, Bill Payment, Bizum Payment, POS Purchase, etc.), an account dropdown, and a date range. The table lists Date, Description, Category, Amount (green "+" for credits, red "−" for debits), Account, and a colored Credit/Debit badge. Clicking a row opens the Account Transaction Detail Modal.

**4. Cards Section:**
- **Summary Metrics:** A row of six cards — Total Limit, Total Outstanding, Available Credit, Overall Utilization (with a red progress bar), Monthly Spend, and Transactions — all Euro-formatted.
- **Credit Cards Section:** A row displaying three Santander card products (Santander 123 Credit Card, Santander World Elite Mastercard, Santander Zero Credit Card) styled as physical cards with a red gradient background, white text, and the correct network mark (Visa or Mastercard) per product. Each shows the masked card number, card name, due date, current outstanding, and available credit.
- **Analytics & Charts:**
    - **Category-wise Spending:** A doughnut chart (Santander red/black/gray palette) showing spend distribution across categories like Shopping, Food & Dining, Travel, etc.
    - **Monthly Spending Trend:** A line chart plotting total expenditure over the last 12 months in Euros.
    - **Top Spending Categories** and **Top Merchants:** Ranked lists (e.g. Zalando, Deliveroo, Carrefour, MediaMarkt) with Euro-amount badges.
    - **Monthly Spend Forecast:** A card with a "magic wand" icon showing a projected spend figure for the current month.
- **Transactions:** A large card titled "Transactions" with the same Export-to-CSV / Toggle-Filters / sortable-table / row-click-to-modal pattern as the Accounts section, filtered by merchant, category, card, and date range.

**5. Transaction Detail Modals:**
- Two equivalent modals — one for card transactions, one for account transactions — opened by clicking a table row. Each presents a clean breakdown: transaction ID, full date, merchant/description, Euro amount, category, card or account used (with masked number/IBAN), and status/type. The account version additionally shows the post-transaction balance.
