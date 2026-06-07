# Lecture 34 - Database Concepts & Relational Design

Welcome to the Database Module! You have successfully mastered frontend development with Angular, creating dynamic, responsive, and stateful single-page applications. However, until now, all the data in your Angular apps has been transient—lost on every page refresh or browser close. To build truly persistent and robust applications, you need a backend and, fundamentally, a database. Before we jump into writing C# and .NET APIs, we must build a solid theoretical and practical foundation in databases.

This comprehensive guide will walk you through the essential concepts of databases, relational design, and data modeling.

---

## 1. Prerequisites

Before starting this module, ensure you are comfortable with the following concepts:
- **Basic Data Structures**: Arrays, Objects, JSON. You should understand how data is organized in memory.
- **Client-Server Architecture**: Understanding that your Angular app (Client) will eventually communicate with a server, which in turn communicates with a database.
- **State Management Concepts**: Recognizing the difference between transient state (UI state in Angular) and persistent state (data stored in a database).
- **Business Logic Understanding**: You should be able to look at a real-world scenario (like an e-commerce store) and identify the key entities involved (Users, Products, Orders).

## 2. Objectives

By the end of this deep dive, you will be able to:
1. **Define** what a database is and articulate why it is crucial for modern applications.
2. **Compare and Contrast** Relational Database Management Systems (RDBMS) and NoSQL databases, understanding the trade-offs and use cases for each.
3. **Design** Entity-Relationship Diagrams (ERDs) to visualize database schemas and relationships.
4. **Implement** Primary Keys and Foreign Keys to establish robust data integrity and relational links.
5. **Apply** Database Normalization rules (1NF, 2NF, 3NF) to eliminate data redundancy and anomalies.
6. **Evaluate** a given unnormalized dataset and refactor it into a fully normalized schema.

## 3. Agenda

1. **Introduction to Databases**: The what and why of data persistence.
2. **RDBMS vs. NoSQL**: The great divide in data storage philosophies.
3. **Entity-Relationship Diagrams (ERD)**: Visualizing data.
4. **Keys in Databases**: Primary Keys, Foreign Keys, and Constraints.
5. **Database Normalization**: 1NF, 2NF, 3NF in detail.
6. **Deep Dive & Practical Examples**: Applying theory to practice.
7. **Think Like a Dev**: Architectural decision making.
8. **Before/After**: The impact of good database design.
9. **Common Mistakes**: Pitfalls to avoid.
10. **Labs**: Hands-on exercises.
11. **Interview Prep**: Questions you will face.
12. **Cheat Sheet**: Quick reference guide.
13. **Key Takeaways**: Summary of the lecture.

---

## 4. Deep Dive

### 4.1. What is a Database?

At its core, a **Database** is an organized collection of structured information, or data, typically stored electronically in a computer system. A database is usually controlled by a Database Management System (DBMS). Together, the data and the DBMS, along with the applications that are associated with them, are referred to as a database system, often shortened to just database.

While you could technically store data in a text file or an Excel spreadsheet, databases offer significant advantages:
- **Data Integrity**: Ensuring data is accurate and consistent over its entire lifecycle.
- **Concurrency**: Allowing multiple users or applications to access and modify data simultaneously without conflicts.
- **Security**: Providing fine-grained access control to sensitive data.
- **Querying**: Offering powerful languages (like SQL) to retrieve specific data efficiently.
- **Scalability**: Capable of handling massive amounts of data and high traffic volumes.

As an Angular developer, you've worked with JSON objects. Imagine a database as a highly optimized, persistent, and secure engine for storing massive arrays of interconnected JSON objects (in NoSQL) or highly structured tables (in Relational Databases).

### 4.2. RDBMS vs. NoSQL

The database world is broadly divided into two camps: Relational (SQL) and Non-Relational (NoSQL).

#### Relational Database Management Systems (RDBMS)
RDBMS store data in structured formats using rows and columns, similar to a spreadsheet. They are based on the relational model introduced by E.F. Codd in 1970.
- **Structure**: Tables with fixed columns (schema).
- **Language**: Structured Query Language (SQL).
- **Relationships**: Data is connected via foreign keys.
- **ACID Properties**: Atomicity, Consistency, Isolation, Durability are strictly enforced, guaranteeing data reliability.
- **Examples**: PostgreSQL, MySQL, SQL Server (which we will use with C#), Oracle.
- **Best For**: Applications with complex relationships, financial systems, ERPs, and scenarios where data integrity is paramount.

#### NoSQL Databases
NoSQL databases provide a mechanism for storage and retrieval of data that is modeled in means other than the tabular relations used in relational databases.
- **Structure**: Document-oriented (JSON-like), Key-Value pairs, Wide-column stores, or Graph formats. Flexible schema.
- **Language**: Varies by database (e.g., MQL for MongoDB).
- **Relationships**: Can handle relationships but typically favors denormalization (nesting data).
- **BASE Properties**: Basically Available, Soft state, Eventual consistency (often prioritizing availability/partition tolerance over strict consistency).
- **Examples**: MongoDB, Redis, Cassandra, Neo4j.
- **Best For**: Rapid prototyping, unstructured data, massive horizontal scaling, real-time analytics.

**The Verdict for this Course**: Since we are building an enterprise-grade backend with C# and .NET, we will focus heavily on RDBMS (specifically SQL Server). The strict typing and structured nature of C# align perfectly with the structured nature of relational databases.

### 4.3. Entity-Relationship Diagrams (ERD)

Before writing a single line of SQL or C# code, you must design your database. An **Entity-Relationship Diagram (ERD)** is a visual representation of the entities within your system and how they relate to one another.

- **Entity**: An object or concept about which you want to store information. Think of these as your classes in C# or interfaces in TypeScript. Examples: `User`, `Product`, `Order`.
- **Attribute**: A property or characteristic of an entity. Examples for `User`: `FirstName`, `LastName`, `Email`.
- **Relationship**: How entities interact. Examples: A `User` *places* an `Order`. An `Order` *contains* `Products`.

#### Types of Relationships:
1. **One-to-One (1:1)**: A `User` has one `Profile`. A `Profile` belongs to one `User`.
2. **One-to-Many (1:N)**: A `Department` has many `Employees`. An `Employee` belongs to one `Department`. This is the most common relationship.
3. **Many-to-Many (M:N)**: A `Student` enrolls in many `Courses`. A `Course` has many `Students`. In RDBMS, M:N relationships require a "Join Table" (e.g., `StudentCourses`) to break them down into two 1:N relationships.

### 4.4. Keys in Databases

Keys are the glue that holds relational databases together. They ensure data uniqueness and establish relationships.

#### Primary Key (PK)
A Primary Key is a column (or set of columns) that uniquely identifies each row in a table.
- **Rules**: Must be unique, cannot be NULL, and should ideally be immutable (unchanging).
- **Examples**: `UserID`, `OrderNumber`, an Auto-Incrementing Integer, or a UUID/GUID.
- **Surrogate vs. Natural Keys**: A surrogate key is an artificial ID (like an auto-incrementing integer) created solely to act as a PK. A natural key is a naturally occurring unique attribute (like a Social Security Number or Email). Surrogate keys are generally preferred in modern development.

#### Foreign Key (FK)
A Foreign Key is a column (or set of columns) in one table that refers to the Primary Key in another table. It is used to link two tables together.
- **Purpose**: Enforces referential integrity. If an `Order` has a `UserID` of 5, a `User` with ID 5 MUST exist in the `Users` table.
- **Example**: In an `Orders` table, `CustomerID` is a Foreign Key referencing the `CustomerID` Primary Key in the `Customers` table.

### 4.5. Database Normalization

Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity. It involves dividing large tables into smaller, less redundant tables and defining relationships between them.

Why normalize?
- **Update Anomalies**: If a user's address is stored in multiple places, updating it requires updating multiple rows. If one fails, data is inconsistent.
- **Insertion Anomalies**: Cannot add a new department if there are no employees in it yet (if department data is tied to the employee record).
- **Deletion Anomalies**: Deleting the last employee in a department might inadvertently delete the department's information.

Let's walk through the Normal Forms (NF).

#### First Normal Form (1NF)
**Rule**: Ensure atomicity. Each cell should contain a single, indivisible value, and each record needs to be unique.
- **Violation**: A `Student` table has a `Courses` column containing "Math, Science, History".
- **Fix**: Create separate rows for each course, or better, separate tables. Eliminate repeating groups.

#### Second Normal Form (2NF)
**Rule**: Must be in 1NF, and all non-key attributes must be fully functionally dependent on the entire primary key. (This mostly applies to tables with composite primary keys).
- **Concept**: No partial dependency.
- **Violation**: An `OrderDetails` table has a composite PK (`OrderID`, `ProductID`). It also has a column `ProductName`. The `ProductName` depends only on `ProductID`, not the `OrderID`.
- **Fix**: Move `ProductName` to a separate `Products` table.

#### Third Normal Form (3NF)
**Rule**: Must be in 2NF, and there should be no transitive dependencies. Non-key attributes must not depend on other non-key attributes.
- **Concept**: "The key, the whole key, and nothing but the key, so help me Codd."
- **Violation**: A `Users` table has `ZipCode`, `City`, and `State`. `City` and `State` are dependent on `ZipCode`, not directly on the `UserID`.
- **Fix**: Create a `ZipCodes` table mapping Zip to City and State, and leave only `ZipCode` as a FK in the `Users` table.

---

## 5. Think Like a Dev

When transitioning from the frontend to the backend, your mindset must shift from "How does this look and interact?" to "How is this structured, secured, and scaled?"

**Scenario**: You are tasked with building a blogging platform.
- **Junior Dev Thought Process**: "I'll just create a big JSON object with the blog post, author details, and all the comments nested inside it, and save it to a NoSQL database. It's fast and easy!"
- **Senior Dev Thought Process**: "While NoSQL is tempting for rapid development, a blog has highly relational data. An author has many posts. A post has many comments. Comments belong to users. If an author updates their bio, I don't want to update thousands of nested documents. I need an RDBMS. I'll design a normalized schema: `Users`, `Posts`, `Comments`, and `Tags` tables. I'll use Foreign Keys to ensure referential integrity, so we never have 'orphan' comments belonging to a deleted post."

As a fullstack developer, you are the bridge. You know Angular expects structured JSON, and now you are learning how to design the SQL tables that will eventually generate that JSON via C# endpoints. Always design your database for data integrity first, and optimize for performance second.

---

## 6. Before/After

Let's look at the impact of normalization.

### Before: Unnormalized "Spreadsheet" Approach

| OrderID | CustomerName | CustomerEmail | ProductID | ProductName | Category | Price | Qty |
|---------|--------------|---------------|-----------|-------------|----------|-------|-----|
| 101 | Alice Smith | alice@a.com | P1 | Laptop | Tech | 1000 | 1 |
| 101 | Alice Smith | alice@a.com | P2 | Mouse | Tech | 50 | 2 |
| 102 | Bob Jones | bob@b.com | P1 | Laptop | Tech | 1000 | 1 |

**Problems:**
- **Redundancy**: Alice's name and email are repeated. The Laptop's category and price are repeated.
- **Update Anomaly**: If the price of the Laptop changes, we have to update multiple rows.
- **Insertion Anomaly**: We can't add a new Product to the system unless an Order is placed for it.

### After: Fully Normalized (3NF)

**Table: Customers**
| CustomerID (PK) | Name | Email |
|-----------------|-------------|-------------|
| C1 | Alice Smith | alice@a.com |
| C2 | Bob Jones | bob@b.com |

**Table: Products**
| ProductID (PK) | ProductName | Category | Price |
|----------------|-------------|----------|-------|
| P1 | Laptop | Tech | 1000 |
| P2 | Mouse | Tech | 50 |

**Table: Orders**
| OrderID (PK) | CustomerID (FK) | OrderDate |
|--------------|-----------------|------------|
| 101 | C1 | 2023-10-01 |
| 102 | C2 | 2023-10-02 |

**Table: OrderDetails (Join Table)**
| OrderID (FK) | ProductID (FK) | Qty |
|--------------|----------------|-----|
| 101 | P1 | 1 |
| 101 | P2 | 2 |
| 102 | P1 | 1 |

**Improvements:**
- Zero redundancy for customer and product data.
- Updating a product price happens in exactly one place.
- Products can exist independently of orders.

---

## 7. Common Mistakes

1. **Ignoring Indexes**: Failing to add indexes on frequently queried columns (like Foreign Keys or Email addresses) leading to massive performance bottlenecks as the application scales.
2. **Over-Normalization**: Taking normalization to extreme levels (4NF, 5NF) when it's not needed, resulting in overly complex schemas that require massive, performance-killing SQL JOINs just to read simple data.
3. **Using Business Data as Primary Keys**: Using an email address as a Primary Key. If the user changes their email, you have to cascade that update across the entire database, which is expensive and risky. Always use surrogate keys (IDs).
4. **Lack of Naming Conventions**: Mixing `CamelCase`, `snake_case`, and `PascalCase` in table and column names. Pick one (typically `PascalCase` or `snake_case` in SQL) and stick to it strictly.
5. **Deleting Data Instead of Soft Deleting**: Running `DELETE FROM Users WHERE ID = 5`. This destroys historical data and breaks foreign key constraints. Instead, use a `IsDeleted` boolean column (Soft Delete).

---

## 8. Labs

### Lab 8.1: ERD Design for a University System
**Objective**: Practice conceptual data modeling.
**Task**: Use a tool like draw.io, Lucidchart, or even pen and paper to draw an ERD for a University.
**Requirements**:
- Entities needed: `Student`, `Professor`, `Course`, `Department`, `Classroom`.
- Define at least 3 attributes for each entity.
- Draw lines indicating the relationships (1:1, 1:N, M:N).
- Explicitly label Primary Keys and Foreign Keys.

**Expected Outcome**: You should realize that `Student` and `Course` have a Many-to-Many relationship, necessitating an `Enrollment` join table.

### Lab 8.2: Normalization Exercise
**Objective**: Convert an unnormalized dataset to 3NF.
**Task**: You are given the following report from a legacy system. Normalize it.

**Legacy Data:**
`ProjectName, ProjectManager, ManagerPhone, EmployeeID, EmployeeName, Role, HourlyRate, HoursWorked`

**Step-by-Step Guidance:**
1. **1NF**: Ensure no repeating groups. Create a unique identifier for the record.
2. **2NF**: Remove partial dependencies. `EmployeeName` depends on `EmployeeID`, not the combination of `Project` and `Employee`. Create an `Employees` table.
3. **3NF**: Remove transitive dependencies. `ManagerPhone` depends on `ProjectManager`. Create a `Managers` table (or combine with Employees if a Manager is just a type of Employee).

---

## 9. Interview Prep

Database design is a massive part of backend technical interviews. Be prepared to design schemas on a whiteboard.

**Q: Explain the difference between an Inner Join and a Left Outer Join.**
**A:** An Inner Join returns only the rows where there is a match in BOTH tables. A Left Outer Join returns ALL rows from the left table, and the matched rows from the right table; if there is no match on the right, it returns NULL values for the right table's columns.

**Q: What is database normalization and why is it important?**
**A:** Normalization is the process of structuring a relational database to reduce data redundancy and improve data integrity. It prevents update, insertion, and deletion anomalies, ensuring the database remains a reliable single source of truth.

**Q: When would you intentionally denormalize a database?**
**A:** Denormalization is introducing redundancy intentionally for performance reasons. In highly read-heavy applications, running complex JOINs across many normalized tables can be slow. Denormalizing allows you to read pre-joined data faster, trading write-speed and storage space for read-speed.

**Q: Explain ACID properties.**
**A:**
- **Atomicity**: A transaction is all or nothing. If one part fails, the whole transaction fails.
- **Consistency**: Data must be valid according to all defined rules (constraints, cascades) before and after a transaction.
- **Isolation**: Concurrent transactions do not affect each other.
- **Durability**: Once a transaction is committed, it remains committed even in the event of a system failure.

---

## 10. Cheat Sheet

### Key Terminology
| Term | Definition |
|---|---|
| **DBMS** | Database Management System software. |
| **RDBMS** | Relational DBMS (SQL Server, PostgreSQL). |
| **Entity** | A real-world object (Table). |
| **Attribute** | A property of an entity (Column). |
| **Tuple/Record** | A single instance of an entity (Row). |
| **Primary Key (PK)** | Unique identifier for a record. |
| **Foreign Key (FK)** | Reference to a PK in another table. |
| **1:1** | One-to-One relationship. |
| **1:N** | One-to-Many relationship. |
| **M:N** | Many-to-Many relationship (requires Join Table). |

### Normal Forms Summary
- **1NF**: Atomic values, no repeating groups.
- **2NF**: 1NF + no partial dependencies (everything depends on the whole key).
- **3NF**: 2NF + no transitive dependencies (non-keys don't depend on other non-keys).

### Extracurricular Case Study 1: Evolving the Schema
In software engineering, schemas are rarely static. When adding feature set 1, we must evaluate the impact on our existing Entity-Relationship Diagram (ERD). A common requirement might be to support multi-tenancy or complex access control for data segment 1. Ensure that when you introduce new tables, you adhere to the Third Normal Form (3NF) by isolating transitive dependencies. For instance, if `Segment1ID` determines `Segment1Details`, then `Segment1Details` should not be embedded directly into the main `Orders` table. Furthermore, integrating this with the frontend implies that your Angular services must handle new JSON structures. On the backend, your C# Web API will need updated Data Transfer Objects (DTOs) and Entity Framework configurations. Always profile the generated SQL queries to guarantee that performance doesn't degrade as the number of rows scales up into the millions.

### Extracurricular Case Study 2: Evolving the Schema
In software engineering, schemas are rarely static. When adding feature set 2, we must evaluate the impact on our existing Entity-Relationship Diagram (ERD). A common requirement might be to support multi-tenancy or complex access control for data segment 2. Ensure that when you introduce new tables, you adhere to the Third Normal Form (3NF) by isolating transitive dependencies. For instance, if `Segment2ID` determines `Segment2Details`, then `Segment2Details` should not be embedded directly into the main `Orders` table. Furthermore, integrating this with the frontend implies that your Angular services must handle new JSON structures. On the backend, your C# Web API will need updated Data Transfer Objects (DTOs) and Entity Framework configurations. Always profile the generated SQL queries to guarantee that performance doesn't degrade as the number of rows scales up into the millions.

### Extracurricular Case Study 3: Evolving the Schema
In software engineering, schemas are rarely static. When adding feature set 3, we must evaluate the impact on our existing Entity-Relationship Diagram (ERD). A common requirement might be to support multi-tenancy or complex access control for data segment 3. Ensure that when you introduce new tables, you adhere to the Third Normal Form (3NF) by isolating transitive dependencies. For instance, if `Segment3ID` determines `Segment3Details`, then `Segment3Details` should not be embedded directly into the main `Orders` table. Furthermore, integrating this with the frontend implies that your Angular services must handle new JSON structures. On the backend, your C# Web API will need updated Data Transfer Objects (DTOs) and Entity Framework configurations. Always profile the generated SQL queries to guarantee that performance doesn't degrade as the number of rows scales up into the millions.

### Extracurricular Case Study 4: Evolving the Schema
In software engineering, schemas are rarely static. When adding feature set 4, we must evaluate the impact on our existing Entity-Relationship Diagram (ERD). A common requirement might be to support multi-tenancy or complex access control for data segment 4. Ensure that when you introduce new tables, you adhere to the Third Normal Form (3NF) by isolating transitive dependencies. For instance, if `Segment4ID` determines `Segment4Details`, then `Segment4Details` should not be embedded directly into the main `Orders` table. Furthermore, integrating this with the frontend implies that your Angular services must handle new JSON structures. On the backend, your C# Web API will need updated Data Transfer Objects (DTOs) and Entity Framework configurations. Always profile the generated SQL queries to guarantee that performance doesn't degrade as the number of rows scales up into the millions.

### Extracurricular Case Study 5: Evolving the Schema
In software engineering, schemas are rarely static. When adding feature set 5, we must evaluate the impact on our existing Entity-Relationship Diagram (ERD). A common requirement might be to support multi-tenancy or complex access control for data segment 5. Ensure that when you introduce new tables, you adhere to the Third Normal Form (3NF) by isolating transitive dependencies. For instance, if `Segment5ID` determines `Segment5Details`, then `Segment5Details` should not be embedded directly into the main `Orders` table. Furthermore, integrating this with the frontend implies that your Angular services must handle new JSON structures. On the backend, your C# Web API will need updated Data Transfer Objects (DTOs) and Entity Framework configurations. Always profile the generated SQL queries to guarantee that performance doesn't degrade as the number of rows scales up into the millions.

### Extracurricular Case Study 6: Evolving the Schema
In software engineering, schemas are rarely static. When adding feature set 6, we must evaluate the impact on our existing Entity-Relationship Diagram (ERD). A common requirement might be to support multi-tenancy or complex access control for data segment 6. Ensure that when you introduce new tables, you adhere to the Third Normal Form (3NF) by isolating transitive dependencies. For instance, if `Segment6ID` determines `Segment6Details`, then `Segment6Details` should not be embedded directly into the main `Orders` table. Furthermore, integrating this with the frontend implies that your Angular services must handle new JSON structures. On the backend, your C# Web API will need updated Data Transfer Objects (DTOs) and Entity Framework configurations. Always profile the generated SQL queries to guarantee that performance doesn't degrade as the number of rows scales up into the millions.

### Extracurricular Case Study 7: Evolving the Schema
In software engineering, schemas are rarely static. When adding feature set 7, we must evaluate the impact on our existing Entity-Relationship Diagram (ERD). A common requirement might be to support multi-tenancy or complex access control for data segment 7. Ensure that when you introduce new tables, you adhere to the Third Normal Form (3NF) by isolating transitive dependencies. For instance, if `Segment7ID` determines `Segment7Details`, then `Segment7Details` should not be embedded directly into the main `Orders` table. Furthermore, integrating this with the frontend implies that your Angular services must handle new JSON structures. On the backend, your C# Web API will need updated Data Transfer Objects (DTOs) and Entity Framework configurations. Always profile the generated SQL queries to guarantee that performance doesn't degrade as the number of rows scales up into the millions.

### Extracurricular Case Study 8: Evolving the Schema
In software engineering, schemas are rarely static. When adding feature set 8, we must evaluate the impact on our existing Entity-Relationship Diagram (ERD). A common requirement might be to support multi-tenancy or complex access control for data segment 8. Ensure that when you introduce new tables, you adhere to the Third Normal Form (3NF) by isolating transitive dependencies. For instance, if `Segment8ID` determines `Segment8Details`, then `Segment8Details` should not be embedded directly into the main `Orders` table. Furthermore, integrating this with the frontend implies that your Angular services must handle new JSON structures. On the backend, your C# Web API will need updated Data Transfer Objects (DTOs) and Entity Framework configurations. Always profile the generated SQL queries to guarantee that performance doesn't degrade as the number of rows scales up into the millions.

### Extracurricular Case Study 9: Evolving the Schema
In software engineering, schemas are rarely static. When adding feature set 9, we must evaluate the impact on our existing Entity-Relationship Diagram (ERD). A common requirement might be to support multi-tenancy or complex access control for data segment 9. Ensure that when you introduce new tables, you adhere to the Third Normal Form (3NF) by isolating transitive dependencies. For instance, if `Segment9ID` determines `Segment9Details`, then `Segment9Details` should not be embedded directly into the main `Orders` table. Furthermore, integrating this with the frontend implies that your Angular services must handle new JSON structures. On the backend, your C# Web API will need updated Data Transfer Objects (DTOs) and Entity Framework configurations. Always profile the generated SQL queries to guarantee that performance doesn't degrade as the number of rows scales up into the millions.

### Extracurricular Case Study 10: Evolving the Schema
In software engineering, schemas are rarely static. When adding feature set 10, we must evaluate the impact on our existing Entity-Relationship Diagram (ERD). A common requirement might be to support multi-tenancy or complex access control for data segment 10. Ensure that when you introduce new tables, you adhere to the Third Normal Form (3NF) by isolating transitive dependencies. For instance, if `Segment10ID` determines `Segment10Details`, then `Segment10Details` should not be embedded directly into the main `Orders` table. Furthermore, integrating this with the frontend implies that your Angular services must handle new JSON structures. On the backend, your C# Web API will need updated Data Transfer Objects (DTOs) and Entity Framework configurations. Always profile the generated SQL queries to guarantee that performance doesn't degrade as the number of rows scales up into the millions.

### Extracurricular Case Study 11: Evolving the Schema
In software engineering, schemas are rarely static. When adding feature set 11, we must evaluate the impact on our existing Entity-Relationship Diagram (ERD). A common requirement might be to support multi-tenancy or complex access control for data segment 11. Ensure that when you introduce new tables, you adhere to the Third Normal Form (3NF) by isolating transitive dependencies. For instance, if `Segment11ID` determines `Segment11Details`, then `Segment11Details` should not be embedded directly into the main `Orders` table. Furthermore, integrating this with the frontend implies that your Angular services must handle new JSON structures. On the backend, your C# Web API will need updated Data Transfer Objects (DTOs) and Entity Framework configurations. Always profile the generated SQL queries to guarantee that performance doesn't degrade as the number of rows scales up into the millions.

### Extracurricular Case Study 12: Evolving the Schema
In software engineering, schemas are rarely static. When adding feature set 12, we must evaluate the impact on our existing Entity-Relationship Diagram (ERD). A common requirement might be to support multi-tenancy or complex access control for data segment 12. Ensure that when you introduce new tables, you adhere to the Third Normal Form (3NF) by isolating transitive dependencies. For instance, if `Segment12ID` determines `Segment12Details`, then `Segment12Details` should not be embedded directly into the main `Orders` table. Furthermore, integrating this with the frontend implies that your Angular services must handle new JSON structures. On the backend, your C# Web API will need updated Data Transfer Objects (DTOs) and Entity Framework configurations. Always profile the generated SQL queries to guarantee that performance doesn't degrade as the number of rows scales up into the millions.

### Extracurricular Case Study 13: Evolving the Schema
In software engineering, schemas are rarely static. When adding feature set 13, we must evaluate the impact on our existing Entity-Relationship Diagram (ERD). A common requirement might be to support multi-tenancy or complex access control for data segment 13. Ensure that when you introduce new tables, you adhere to the Third Normal Form (3NF) by isolating transitive dependencies. For instance, if `Segment13ID` determines `Segment13Details`, then `Segment13Details` should not be embedded directly into the main `Orders` table. Furthermore, integrating this with the frontend implies that your Angular services must handle new JSON structures. On the backend, your C# Web API will need updated Data Transfer Objects (DTOs) and Entity Framework configurations. Always profile the generated SQL queries to guarantee that performance doesn't degrade as the number of rows scales up into the millions.

---

## 11. Key Takeaways

1. **Data is the Core**: While frontend frameworks like Angular change frequently, database schemas are long-lived and foundational to an application's success.
2. **Relational vs. NoSQL**: Choose RDBMS for structured, relational data where integrity is critical. Choose NoSQL for flexible schemas and rapid horizontal scaling.
3. **Design Before Coding**: Never skip the ERD phase. Visualizing relationships saves countless hours of refactoring backend code.
4. **Normalize for Integrity**: Aim for 3rd Normal Form (3NF) as a baseline to prevent anomalies and ensure a single source of truth.
5. **Keys are Crucial**: Surrogate Primary Keys and strictly enforced Foreign Keys are the safety net of your application's data.

Welcome to the backend mindset. In the next lecture, we will install SQL Server and start writing SQL queries to interact with the schemas we just learned how to design!

**Next Lecture:** [Lecture 35 — MSSQL Server Setup & Basic T-SQL](../35%20-%20MSSQL%20Server%20Setup%20%26%20Basic%20T-SQL/35%20-%20MSSQL%20Server%20Setup%20%26%20Basic%20T-SQL.md)

### 📚 Extensive Tutorials & Resources
- **SQLBolt:** [Introduction to Relational Databases](https://sqlbolt.com/lesson/introduction)
- **freeCodeCamp:** [Database Normalization – Normal Forms (1NF, 2NF, 3NF) Explained](https://www.freecodecamp.org/news/database-normalization-1nf-2nd-nf-3rd-nf/)
- **freeCodeCamp:** [Database Design Course for Beginners](https://www.freecodecamp.org/news/complete-database-design-course-for-beginners/)
- **GeeksforGeeks:** [What is Data Normalization and Why Is It Important?](https://www.geeksforgeeks.org/what-is-data-normalization-and-why-is-it-important-in-dbms/)
- **Microsoft Learn:** [Database Normalization Description and Basics](https://learn.microsoft.com/en-us/office/troubleshoot/access/database-normalization-basics)
- **Lucidchart:** [Database Structure and Design Tutorial](https://www.lucidchart.com/pages/database-diagram/database-design)
- **W3Schools:** [SQL RDBMS Concepts](https://www.w3schools.com/sql/sql_rdbms.asp)

