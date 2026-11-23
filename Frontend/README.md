# The Potted Leaf: React frontend

React (Vite) frontend for your `website` design, connected to the Spring Boot `PlantStore` backend.

## Run
1. Copy ALL `.java` files in `backend-patch/` into `src/main/java/com/pottedLeaf/plantstore/controller/` of the backend (replace PlantController and RestExceptionHandler). Add the two lines from `application.properties.add.txt` to the backend's application.properties. Restart it (port 8080, MySQL).
2. In this folder: `npm install`, then `npm run dev`
3. Open http://localhost:3000 (port 3000 is needed for the backend's CORS setting)

## Pages
| Route | What it does | Backend |
|---|---|---|
| / | Home, category tiles, popular plants | GET /api/admin/plants |
| /plants /seeds /fertilizers /shop | Product lists with search, price filter, sort | GET /api/admin/plants |
| /product/:id | Details, quantity, related products | GET /api/admin/plants |
| /wishlist | Saved products (stored in the browser) | none |
| /login /register | Account | /api/users/login, /register |
| /cart | Change quantity, remove | /api/cart/... |
| /payment | Shipping + payment, places order | POST /api/orders/place/{userId}/{method} |
| /orders | Order history with items | /api/orders/user/{id}, /items/{orderId} |
| /profile | Your details | GET /api/users/{id} |
| /admin | Dashboard: revenue, orders by status, 7-day revenue, low stock, recent orders | GET /api/admin/orders, /users |
| /admin/products | Add, edit, delete products, upload images, import samples | /api/admin/plants, POST /api/admin/upload |
| /admin/orders | All orders, filter, search, change status, see items and address | GET /api/admin/orders, PUT /api/admin/orders/{id}/status/{status} |
| /admin/users | Customers with order count and total spent | GET /api/admin/users |
| /admin/feedback | Read, mark read, delete feedback messages | /api/feedback |
| /forgot-password | Reset password with username + registered email | POST /api/users/reset-password |
| /contact | Static contact details | none |
| /feedback | Send feedback | POST /api/feedback |
| /about | Static page | none |

## Admin
Log in with the username `admin` (change `ADMIN_USERNAME` in src/api.js). Register that user first.
This only hides the page in the UI. It is not security: add roles and Spring Security in the backend before going live.

## Products
The store shows products from the database. While it is empty (or the backend is off) it shows the sample products in src/data.js so the site still works. In /admin, "Import sample products" copies them into the database. Sample prices are placeholders.

## Still needs backend work
- Orders: a customer can cancel their own order from My Orders while it is CREATED or PAID. Once it is SHIPPED, DELIVERED or CANCELLED, no Cancel button shows. Cancelling does not restock or refund automatically.
- Forgot password uses username + email as proof. A real site should email a one-time link or code.
- Profile editing and "all orders" for admin: no endpoints.
- Passwords are stored and compared as plain text in UserService. Hash them (BCrypt) before going live.
- Card and UPI numbers are not sent anywhere. Use a payment gateway (e.g. Razorpay).
