# DeshiMula — User Manual & Installation Guide

### 🌐 Live Production Deployment: [https://deshimula-cyan.vercel.app](https://deshimula-cyan.vercel.app)

Welcome to **DeshiMula**, a platform designed for employees in Bangladesh to share anonymous reviews and ratings about companies. This manual guides you through setting up, configuring, launching, and using the application.

---

## 1. Introduction

DeshiMula is built to provide transparency in the corporate and IT sectors of Bangladesh. Users can read reviews about workplace culture, salary delays, promotions, work-life balance, and management practices. They can also register, submit their reviews anonymously, comment on other reviews, upvote/downvote content, and report inappropriate submissions.

---

## 2. Environment & System Requirements

Before installing the project, make sure your computer meets these minimum specifications.


### 2.2 Software Prerequisites
* **Operating System:** macOS, Windows 10/11, or Linux (Ubuntu/Debian)
* **Node.js:** version `20.0.0` or higher (we recommend using the latest LTS version)
* **Web Browser:** Any modern browser (Google Chrome, Mozilla Firefox, Safari, Microsoft Edge, or Brave)

---

## 3. Installation Steps

Setting up DeshiMula on a college or local computer takes just a few steps:

### Step 1: Open Terminal or Command Prompt
* **macOS/Linux:** Open the **Terminal** app.
* **Windows:** Open **Command Prompt** or **PowerShell**.

### Step 2: Navigate to the Project Folder
Use the `cd` command to enter the directory where you extracted the project source files.
```bash
cd /path/to/deshiMula
```

### Step 3: Install Node Packages
Run the install command to fetch all necessary dependencies (Next.js, React, better-sqlite3, etc.):
```bash
npm install
```
*Note: This process may take 1 to 2 minutes depending on your internet connection speed.*

### Step 4: Initialize and Seed the Database
Run our database initialization command to build the SQLite tables and automatically seed them with over 100 realistic records per table (loaded from real company reviews):
```bash
npm run db:init
```
*You will see terminal output indicating that the schema was created and all 15 tables were successfully seeded.*

---

## 4. Configuration

The application works out-of-the-box for local testing. No complicated setup is needed!

* **Database File:** Once initialized, the database is stored in a single, portable file at `data/deshimula.db`. If you need to back up your database, you can copy this file.
* **Environment Variables:** For local development, Next.js handles environment configurations automatically. If you deploy the application to a production server, you can set the `AUTH_SECRET` environment variable for secure user sessions.

---

## 5. How to Launch the Application

Once installation is finished, you can launch the local web server:

1. In your terminal, run the development server command:
   ```bash
   npm run dev
   ```
2. Once the server starts, you will see output in the terminal:
   ```text
   ▲ Next.js 15.2.0
   - Local:        http://localhost:3000
   ```
3. Open your web browser and navigate to: **[http://localhost:3000](http://localhost:3000)**

---

## 6. How to Use the Application (Step-by-Step)

Here are the 5 primary user workflows for exploring DeshiMula.

### Step 1: Browse Companies and Reviews
* When you open the home page, you will see a list of companies with their aggregate ratings (out of 5 stars) and review counts.
* Click on any company to view its details, location, industry, and its full list of employee reviews.
* Click on a review card to read the complete review description and user comments.

### Step 2: Create a User Account & Log In
* Click **Register** in the top navigation bar.
* Fill in your Name, Email (e.g., `test@example.com`), and Password (at least 6 characters).
* Click **Create Account**. The system will log you in automatically.
* If you already have an account, click **Login** in the navigation bar and enter your credentials.
  * *Tip: You can log in as a test administrator using email `admin@deshimula.com` and password `admin123`.*
  * *Tip: You can log in as a test regular user using email `user@deshimula.com` and password `password123`.*

### Step 3: Write and Submit a Review
* Log into your account and click **Submit Review** in the top navigation.
* Select a company from the dropdown list.
* Enter a catchy review Title (e.g., "Great work environment, but salary delays occur").
* Choose the Sentiment that best reflects your experience: **Positive**, **Neutral**, or **Negative**.
* Type your detailed review content in the text box.
* Enter relevant tags separated by commas (e.g., `salary, culture, management`).
* Click **Submit Review**. The page will reload and show your review, and the company's average rating will update instantly!

### Step 4: Upvote, Downvote, and Comment
* Open any review.
* Click the **Upvote (▲)** or **Downvote (▼)** button below the review text to rate the feedback.
* Type a comment in the text box at the bottom of the review page and click **Add Comment** to engage in discussions with other users.

### Step 5: Admin Moderation (For Admins)
* Log in using the admin account (`admin@deshimula.com` / `admin123`).
* Navigate to the **Admin Dashboard** (available in the navigation bar when logged in as an admin).
* You will see all reviews submitted. You can delete any review if it violates terms or contains inappropriate content.
* If a regular user flags/reports a review, the report reason and review title will appear on the admin dashboard.

---

## 7. How to Uninstall the Application

If you need to completely remove the application from the computer:

1. Stop the local development server in the terminal by pressing **Ctrl + C**.
2. Delete the `deshiMula` folder containing the files.
3. The database file `data/deshimula.db` is inside the folder, so deleting the folder removes all code, configuration, and data at once. No background registries or hidden files are left on the system.

---

## 8. Troubleshooting Common Issues

* **Error: Node.js version mismatch**
  * *Problem:* You get an error starting with `Unsupported engine` or script crashes during build.
  * *Solution:* Verify your Node version by running `node -v`. If it is below `20.0.0`, please download and install the latest LTS version from the official [nodejs.org](https://nodejs.org) website.
* **Error: UNIQUE constraint failed: users.email**
  * *Problem:* The database seeding failed.
  * *Solution:* Run `npm run db:init` again. It will automatically reset the database file and start fresh, which resolves any duplicate seed entries.
* **Error: Port 3000 is already in use**
  * *Problem:* Another application is running on port 3000.
  * *Solution:* Close the other application, or run Next.js on a different port using:
    ```bash
    npx next dev -p 3001
    ```
