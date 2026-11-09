MEDI-CARE — MEDICAL STORE MANAGEMENT ERP (HTML EDITION)
========================================================

WHAT THIS EDITION IS
--------------------
This is a browser-based, static HTML/CSS/JavaScript demo of Medi-Care. It is
provided as a straightforward alternative to the earlier server-based build.
There is no Java server, Python server, database installation, build command,
or application packaging step required to open this edition.

TECHNOLOGY
----------
- HTML5: application pages, tables, forms, dialogs and receipt structure.
- CSS3: red-and-white design system, responsive layout and print styling.
- JavaScript: navigation, demo login, inventory CRUD, stock updates, purchase
  orders, point of sale, tax calculations, receipt generation, attendance,
  reporting, CSV export and browser data persistence.
- Bootstrap 5.3 CSS: loaded from jsDelivr CDN for familiar Bootstrap form and
  utility styling. The app also contains its own layout and visual styles, so
  its main features do not depend on Bootstrap's JavaScript bundle.

IMPORTANT ABOUT THE WORD "JAVA"
-------------------------------
A normal HTML page cannot execute Java server code. This HTML edition uses
JavaScript in the browser. If a Java backend (for example, Spring Boot) is a
strict requirement, it must run as a separate server and HTML will call its
APIs. This edition intentionally avoids that server requirement so the page
opens directly in a browser.

HOW TO OPEN (WINDOWS / MAC / LINUX)
----------------------------------
1. Extract the medi-care-html.zip file into a folder.
2. Open the folder.
3. Double-click index.html, or right-click it and choose Open with Chrome,
   Edge, Firefox or Safari.
4. On the login screen, use the demo account below.

DEMO LOGIN
----------
Username: admin
Password: MediCare@2026!

Other seeded accounts:
  sara  / Sara@12345  (Pharmacist)
  usman / Usman@12345 (Cashier)

FEATURE GUIDE
-------------
1. Dashboard
   - Today's sales, cumulative sales revenue, estimated product margin and
     total units in stock.
   - Seven-day sales bar chart, low/out-of-stock list and recent sales.

2. Inventory
   - Add, edit, search, filter and delete medicine records.
   - Tracks category, company, batch, expiry, purchase cost, sale price,
     current stock and reorder threshold.
   - Low-stock and out-of-stock status is calculated automatically.

3. Purchase orders
   - Create a supplier purchase order with medicine, quantity, unit cost,
     order date and expected delivery date.
   - Change an order between Ordered and In transit.
   - Mark a shipment Received; this adds the ordered quantity to inventory.
   - The demo purchase form creates one medicine line per order.

4. Billing / POS
   - Search in-stock medicines and add them to the current bill.
   - Increase/decrease quantities, with stock validation.
   - Calculates a 5% demo tax, subtotal and total.
   - Records Cash, Card or Online as the payment method.
   - Checkout reduces inventory and creates an itemized receipt.
   - Receipt printing uses the browser's print dialog; select a printer or
     Save as PDF.

5. Reports
   - Transaction history, receipt reprint, revenue, cost of goods sold,
     estimated product margin and transaction count.
   - Export sales as CSV.

6. Attendance
   - Successful sign-in opens an attendance session.
   - Sign-out records the logout timestamp and calculated shift duration.
   - Filter attendance rows by date and see total recorded hours.

7. Staff & users
   - Admin can add staff accounts and activate/deactivate non-root accounts.
   - Demo roles are Admin, Pharmacist and Cashier.

8. Activity log
   - Records user sign-in/out, medicine changes, purchase order actions,
     account changes and completed sales.
   - Export activity history as CSV.

EXPANDED MEDICINE CATALOGUE
---------------------------
- The updated edition adds 216 sample medicine SKUs to the original inventory.
- Existing browser data is preserved; the new sample records are appended once by ID when the updated app is opened.
- Sample prices, batch codes, expiry dates, quantities and company assignments are illustrative data. Verify against actual supplier invoices and labelled packs before real use.
- Stock values can be edited from Inventory > Edit > Current stock > Save changes. The updated edition validates the quantity and refreshes the Inventory, Dashboard and POS views.

DATA STORAGE
------------
The app saves demo data to the browser's localStorage using the key
"mediCareErpHtml_v1". Data remains in the same browser profile on the same
computer. Clearing browser site data, using private browsing, or opening the
file in a different browser may remove or separate the saved information.

To reset the demo data, open the browser developer console on index.html and
run:
  localStorage.removeItem('mediCareErpHtml_v1');
Then refresh the page.

PROJECT FILES
-------------
medi-care-html/
  index.html    Main application document and page layouts.
  styles.css    Red-and-white theme, responsive layout and print CSS.
  app.js        Demo data, state persistence and application functions.
  README.txt    This guide.

FUNCTION-BY-FUNCTION MAP (app.js)
---------------------------------
seedData()         Creates demo users, medicines and purchase orders.
save()             Persists the current demo state to localStorage.
logActivity()      Adds an auditable user action to the activity list.
stockState()       Derives healthy, low or out-of-stock state.
nav()              Switches between application pages.
renderDashboard()  Updates KPIs, sales chart, stock alerts and recent sales.
renderInventory()  Draws medicine table and applies search/stock filters.
renderPurchases()  Calculates order metrics and draws supplier orders.
renderPos()        Draws available stock items for checkout.
addToCart()        Adds a medicine to the bill with stock validation.
changeCartQty()    Changes/removes a bill line and validates stock.
cartTotals()       Calculates subtotal, tax and payable total.
checkout()         Validates stock, creates sale, reduces inventory and prints.
printReceipt()     Builds an itemized receipt and opens browser printing.
renderReports()    Calculates revenue, COGS, margin and sales history.
renderAttendance() Calculates recorded hours and displays staff sessions.
renderUsers()      Displays team accounts and their activation status.
renderActivity()   Displays the latest recorded actions.
medicineForm()     Opens the add/edit medicine form.
purchaseForm()     Opens the supplier purchase order form.
userForm()         Opens the new staff account form.
login()            Checks demo credentials and starts attendance tracking.
logout()           Closes attendance session and returns to sign-in.
exportCsv()        Downloads a CSV file from selected records.

DEMO LIMITATIONS / PRODUCTION CHECKLIST
---------------------------------------
- This is a front-end demonstration, not a secured multi-user production ERP.
  Browser-side usernames and passwords are not secure authentication. Anyone
  with access to browser storage/devtools can inspect or alter the demo data.
- There is no central database, server-side authorization, encryption at rest,
  backup service, remote synchronization or multi-device access.
- Cash/Card/Online are recorded as payment labels only. No bank, wallet or card
  gateway is contacted and no real payment is processed.
- Tax is a sample fixed 5% setting. Configure correct local tax rules before
  business use.
- Estimated product margin is subtotal less the stored purchase cost of sold
  units. It is not accounting net profit and excludes operating expenses,
  discounts, returns, tax liabilities and other adjustments.
- Do not store patient records, prescriptions, sensitive personal data or
  real card/payment credentials in this demo.

For production deployment, connect these pages to a Java backend (e.g. Spring
Boot), use a database such as PostgreSQL/MySQL, enforce authentication and
role permissions on the server, add audit controls and backups, and integrate
an authorized payment provider where required.
