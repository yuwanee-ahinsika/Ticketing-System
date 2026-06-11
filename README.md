# 🎫 Tecketing System

A premium, modern support and ticket-management application designed for internal departments. It features dynamic, role-based interfaces, instant read/unread notifications, interactive activity threads, and customized support submission cards.

---

## 🚀 Key Features

### 🎛️ Unified Role-Based Dashboard
The system integrates all views into a single, cohesive dashboard page (`Dashboard.jsx`), controlling access and tab visibility dynamically depending on the authenticated user's authorization:
- **IT HOD & Admins**:
  - **Tickets Queue**: Access a centralized inbox of all submitted tickets with live counters, query search (filters titles, descriptions, users, and platforms), and read-status selectors (**All**, **Unread**, **Read**, **No Replies**).
  - **Submit Ticket**: Report platform issues.
  - **Manage Platforms & Issues**: A dedicated configuration panel to dynamically create, edit, and delete support platforms and their standard issue templates.
  - **Quick Replies & Automatic Status Updates**: Publish support updates which automatically transition ticket statuses from open to in-progress.
- **Standard Employees**:
  - **Submit Ticket**: Select platforms and issue types to submit support tickets. The detailed description field is optional.
  - **My Tickets**: Trace their own submitted tickets and reply back to the IT support staff directly on the ticket details page.

### 🔔 Visual Read/Unread Status Notifications
- **Status Badges**: Unread tickets feature a glowing, pulsing rose red **New** indicator. Read tickets show a neutral gray **Read** badge.
- **Dynamic Title Counter**: The browser tab title updates instantly with the count of unread tickets (e.g. `(3) Tecketing System`) to alert IT staff of new traffic.
- **Pulsing Header Indicators**: Header navigation tabs highlight unread tickets via pulsing red numerical badges.

### 🔌 Custom Submission Forms & Platform Management
- **Predefined Issue Templates**: Quick templates are available for key business platforms (ERP, Customer Portal, WiFi & Network, Hardware, Email & Office) and can be dynamically managed by IT HODs/Admins.
- **"Other" Platform Card**: Styled with a customized help-circle icon, this option enables custom issue reporting. It automatically hides the standard issue templates, guiding the user straight to details submission.
- **Dynamic Platform Sorting**: The "Other" platform is dynamically sorted and always displayed as the last option in the dashboard grid and form selection dropdowns.

### 💬 Active Conversation Threads
- Clean chat logs organize communications between employees and IT support agents.
- Custom styling visually separates the sender (blue bubble, right-aligned) from IT agents (gray bubble, left-aligned) and provides department names dynamically.

---

## 🛠️ Tech Stack

- **Backend**: [Laravel 11](https://laravel.com)
- **Frontend**: [React 18](https://react.dev) with [Tailwind CSS](https://tailwindcss.com)
- **Routing & State Link**: [Inertia.js](https://inertiajs.com)
- **Database**: MySQL

---

## 📦 Installation & Setup

Follow these steps to set up the project locally:

### 1. Prerequisites
- **PHP** >= 8.2 (with XAMPP or native installer)
- **Node.js** & **NPM**
- **Composer**
- **MySQL Server**

### 2. Configure Environment
Copy the sample environment file and adjust your database connection settings:
```bash
cp .env.example .env
```
Inside your `.env` file, specify your MySQL credentials and database name:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=explores
DB_USERNAME=root
DB_PASSWORD=
```

### 3. Install Backend Dependencies & Run Migrations
```bash
composer install
php artisan key:generate
php artisan migrate --seed
```
*Note: Seeding the database will create default platforms, common issue categories, and administrative/user credentials.*

### 4. Install Frontend Dependencies & Compile Assets
```bash
npm install
npm run build
```

### 5. Start the Application
Run the local artisan development server:
```bash
php artisan serve
```
Open your browser and navigate to: **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

---

## 🔑 Default Credentials

Use these seeded accounts to test different roles:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **IT Head (HOD) / Admin** | `admin2@example.com` | `password` | Global Queue, Manage Platforms & Issues, Mark as Read, Post Replies, Submit Tickets |
| **Regular User** | `user@example.com` | `password` | Submit Tickets (with optional description), View Own Tickets, Reply to Own Tickets |

---

## 📂 File Architecture

Key dashboard and routing assets are organized as follows:
- **Backend Controller**: [TicketController.php](file:///c:/xampp/htdocs/Ticketing-System/app/Http/Controllers/TicketController.php) controls DB queries and resolves Inertia rendering.
- **Frontend Views**:
  - [Dashboard.jsx](file:///c:/xampp/htdocs/Ticketing-System/resources/js/Pages/Dashboard.jsx): Unified entry point housing `ITDashboardView` and `UserDashboardView`.
  - [TicketDetails.jsx](file:///c:/xampp/htdocs/Ticketing-System/resources/js/Pages/TicketDetails.jsx): Dedicated detailed page showing full chat conversation thread.
- **Routing**: [web.php](file:///c:/xampp/htdocs/Ticketing-System/routes/web.php) maps support tickets resources and status updates.
