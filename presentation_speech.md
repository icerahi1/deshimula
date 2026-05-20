# DeshiMula Video Presentation Script

This script is structured to satisfy the final project assessment requirements. It covers the **Background**, **Objective**, **Tasks**, **Implementation Tools**, and **Conclusions** of the DeshiMula database project.

* Text in **bold** is what you say out loud.
* Text in brackets `[Action: ...]` tells you what to show on your screen during that part of the speech.

---

## Part 1: Background (Approx. 45 seconds)

`[Action: Start on the Homepage / Landing Page of DeshiMula. Scroll slowly down to show the company list.]`

**"Hello everyone, my name is Rahi Chowdhury. Today, I am presenting DeshiMula, my final database project for the Database Practice course at Vilnius College."**

**"To understand the background of this project, we look at the software and IT sector in Bangladesh. While this sector has grown rapidly, employee protections and HR transparency have lagged behind."**

**"Employees frequently face issues such as delayed payrolls, biased appraisals, and unpaid overtime. Because workers fear termination or blacklisting if they speak out, they lack a safe channel to discuss their employers. This lack of information leads many job seekers to accept offers at toxic workplaces without knowing the reality."**

---

## Part 2: Project Objective (Approx. 45 seconds)

`[Action: Navigate to a specific Company profile page, showing the detailed ratings, location tags, and employee reviews.]`

**"The primary objective of DeshiMula is to solve this information gap by providing a secure, anonymous platform for company reviews and ratings."**

**"From a database perspective, the objective is to build a highly integral, relational data model that securely links reviews, comments, tags, and votes while protecting user anonymity. The project aims to store real employee data, enable quick search queries, and automate administrative tasks using database-level rules."**

---

## Part 3: Tasks and Requirements (Approx. 1.5 minutes)

`[Action: Open your code editor and show the schema.sql file, highlighting table definitions.]`

**"To achieve these objectives, several key technical and academic tasks were completed:"**

**"First, I modeled a relational database schema consisting of 15 distinct entities to cover all business logic, including Users, Companies, Sentiments, and Audit Logs."**

**"Second, I normalized the database to the Third Normal Form (3NF) to prevent anomalies and redundant storage of tags, locations, and user roles."**

`[Action: Scroll down schema.sql to highlight the 'review_after_insert' database trigger.]`

**"Third, I implemented automated database triggers. For instance, when a review is added, a trigger automatically updates the company's average rating and total review counts on the fly."**

`[Action: Go back to the web browser. Show logging in, writing a review, and posting it.]`

**"Fourth, I fulfilled the seeding requirements by importing over 100 records into every single table. This was done using three entry methods: web form submissions, raw SQL seeding, and a Python migration script that parsed real-world company reviews from a CSV file."**

**"Finally, I wrote and validated 30 distinct SQL queries—ranging from basic filtering to multi-table joins and complex subqueries—to generate analytical reports."**

---

## Part 4: Implementation Tools (Approx. 45 seconds)

`[Action: Open package.json in the code editor, highlighting dependencies like 'better-sqlite3' and 'next'.]`

**"Regarding our implementation tools, the core database engine is SQLite. It is lightweight, file-based, and serverless, which makes it highly portable for deployment."**

**"To connect the database to our Next.js application, I used the 'better-sqlite3' Node library, which provides rapid, synchronous query execution."**

**"For the frontend and backend actions, I utilized Next.js 16, React, TypeScript, and Tailwind CSS. I also wrote Python scripts to parse and clean raw CSV data before seeding it into the SQLite database."**

**"To host the application on Vercel, we resolved the serverless read-only filesystem challenge by copying the pre-seeded SQLite database to the writeable '/tmp' directory on startup. We also configured Next.js's 'serverExternalPackages' to ensure native binaries compile correctly during deployment."**

---

## Part 5: Conclusions (Approx. 45 seconds)

`[Action: Log in as Admin and show the Admin Dashboard / Audit Logs page.]`

**"In conclusion, the DeshiMula project demonstrates how a well-structured relational database can power a secure, interactive web application."**

**"By strictly adhering to 3NF normalization, the system avoids data redundancy and keeps search queries fast. The use of indexes and database-level triggers ensures referential integrity and consistency without adding processing overhead to the application server."**

**"For future scope, the platform can be scaled by migrating from SQLite to a serverless hosted database like Turso or PostgreSQL, and integrating machine learning to automatically flag spam in reviews before write operations."**

**"Thank you for your time."**
