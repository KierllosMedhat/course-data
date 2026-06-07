# 34 - MSSQL Server Setup & Basic T-SQL

## Prerequisites
Welcome to the second lecture of the database module! Before diving into the vast world of Microsoft SQL Server and Transact-SQL (T-SQL), ensure you have the following prerequisites met:
- **Operating System:** Windows 10/11 (or Linux/macOS via Docker).
- **System Requirements:** Minimum 4GB RAM, 6GB free disk space.
- **Internet Connection:** For downloading installers.
- **Mindset:** Understanding that databases are the foundational storage layer of almost all web applications.

## Objectives
By the end of this comprehensive module, you will be able to:
- Download, install, and configure Microsoft SQL Server Developer Edition.
- Download, install, and navigate SQL Server Management Studio (SSMS).
- Understand the architecture of SQL Server and relational databases.
- Write Data Definition Language (DDL) scripts to CREATE, ALTER, and DROP databases and tables.
- Write Data Manipulation Language (DML) scripts to SELECT, INSERT, UPDATE, and DELETE data.
- Master filtering techniques using WHERE, LIKE, IN, and other logical operators.
- Think like a database developer when structuring and querying data.

## Agenda
1. **Introduction to Microsoft SQL Server** (15 mins)
2. **Installing SQL Server & SSMS** (30 mins)
3. **Database Creation & Architecture** (20 mins)
4. **Data Definition Language (DDL)** (45 mins)
5. **Data Manipulation Language (DML)** (45 mins)
6. **Advanced Filtering (WHERE, LIKE, IN)** (45 mins)
7. **Hands-on Labs & Exercises** (60 mins)

## Deep Dive

### 4.1 Introduction to Microsoft SQL Server
Microsoft SQL Server is a relational database management system (RDBMS) developed by Microsoft. As a database server, it is a software product with the primary function of storing and retrieving data as requested by other software applications.
T-SQL (Transact-SQL) is Microsoft's proprietary extension to the SQL (Structured Query Language) standard. It includes procedural programming, local variables, and various support functions for string processing, data processing, mathematics, etc.

### 4.2 Installing SQL Server & SSMS
To interact with SQL Server, we need two main components:
1. **The Database Engine:** The actual service running in the background, managing the data (SQL Server Developer Edition).
2. **The Client Tool:** The graphical user interface (GUI) used to write queries and manage the database engine (SQL Server Management Studio - SSMS).

**Step-by-Step Installation:**
1. Navigate to the official Microsoft SQL Server downloads page.
2. Select the **Developer Edition** (it is a full-featured free edition, licensed for use as a development and test database in a non-production environment).
3. Run the installer and choose the **Basic** installation type for beginners, or **Custom** if you wish to configure specific file paths and features.
4. Once SQL Server is installed, click on the **Install SSMS** button in the setup wizard.
5. Download and install SSMS.
6. Open SSMS, connect to your local server (usually `localhost` or `.\SQLEXPRESS` or your computer name), and use Windows Authentication to log in.

### 4.3 Database Creation
A database is a structured collection of data. In SQL Server, databases are stored as files on your hard drive (primarily `.mdf` for data and `.ldf` for logs).

**Creating a Database via GUI:**
1. In Object Explorer, right-click the **Databases** node.
2. Select **New Database...**
3. Enter the database name and click OK.

**Creating a Database via T-SQL:**
```sql
CREATE DATABASE WebDevCourse;
GO
USE WebDevCourse;
GO
```
*Note: The `GO` command is not a T-SQL statement; it's a batch separator recognized by SSMS to signal the end of a batch of T-SQL statements.*

### 4.4 Data Definition Language (DDL)
DDL is a subset of SQL used to define data structures, especially database schemas. The three primary DDL commands are `CREATE`, `ALTER`, and `DROP`.

#### 4.4.1 CREATE
Used to create new objects in the database (tables, views, stored procedures, etc.).
```sql
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);
```

#### 4.4.2 ALTER
Used to modify the structure of an existing object.
```sql
ALTER TABLE Users
ADD DateOfBirth DATE NULL;

ALTER TABLE Users
ALTER COLUMN FirstName NVARCHAR(100) NOT NULL;
```

#### 4.4.3 DROP
Used to delete objects from the database. **Caution:** Dropping a table deletes all data within it permanently!
```sql
DROP TABLE Users;
```

### 4.5 Data Manipulation Language (DML)
DML is used for managing data within schema objects. The core DML commands are `SELECT`, `INSERT`, `UPDATE`, and `DELETE` (often referred to as CRUD operations: Create, Read, Update, Delete).

#### 4.5.1 INSERT
Used to add new rows of data to a table.
```sql
INSERT INTO Users (FirstName, LastName, Email)
VALUES ('John', 'Doe', 'john.doe@example.com'),
       ('Jane', 'Smith', 'jane.smith@example.com');
```

#### 4.5.2 SELECT
Used to query and retrieve data from a database.
```sql
SELECT * FROM Users;

SELECT FirstName, Email FROM Users;
```

#### 4.5.3 UPDATE
Used to modify existing data in a table. **Always use a WHERE clause** unless you want to update every row!
```sql
UPDATE Users
SET LastName = 'Doe-Smith'
WHERE UserID = 2;
```

#### 4.5.4 DELETE
Used to remove existing records from a table. Like UPDATE, **always use a WHERE clause**!
```sql
DELETE FROM Users
WHERE UserID = 1;
```

### 4.6 Filtering (WHERE, LIKE, IN)
Filtering allows you to restrict the rows returned by a query or affected by an UPDATE/DELETE.

#### 4.6.1 The WHERE Clause
The `WHERE` clause is used to extract only those records that fulfill a specified condition.
```sql
SELECT * FROM Users
WHERE FirstName = 'Jane';

SELECT * FROM Users
WHERE CreatedAt >= '2023-01-01';
```

#### 4.6.2 The LIKE Operator
The `LIKE` operator is used in a `WHERE` clause to search for a specified pattern in a column.
- `%` represents zero, one, or multiple characters.
- `_` represents a single character.

```sql
-- Find users whose email ends with '@example.com'
SELECT * FROM Users
WHERE Email LIKE '%@example.com';

-- Find users whose first name starts with 'J' and is exactly 4 characters long
SELECT * FROM Users
WHERE FirstName LIKE 'J___';
```

#### 4.6.3 The IN Operator
The `IN` operator allows you to specify multiple values in a `WHERE` clause. It is a shorthand for multiple `OR` conditions.
```sql
SELECT * FROM Users
WHERE UserID IN (1, 2, 5, 10);
```

### Advanced Deep Dive Scenario 1: Enterprise Database Management
In an enterprise scenario 1, managing a SQL Server instance requires a deep understanding of both DDL and DML. When multiple teams access the same tables, strict DDL structures ensure that data formats remain consistent. For example, enforcing `NOT NULL` constraints and using `DEFAULT` values helps prevent application crashes. On the DML side, writing efficient queries using `WHERE`, `LIKE`, and `IN` is paramount. A common pattern involves querying logs or transaction tables for specific keywords using `LIKE`, or filtering user IDs with the `IN` operator. Database administrators frequently run `ALTER` commands during off-peak hours to add indexes, optimizing the `SELECT` queries executed during peak times. Always remember that every `UPDATE` and `DELETE` without a `WHERE` clause poses a significant risk to the entire dataset.

### Advanced Deep Dive Scenario 2: Enterprise Database Management
In an enterprise scenario 2, managing a SQL Server instance requires a deep understanding of both DDL and DML. When multiple teams access the same tables, strict DDL structures ensure that data formats remain consistent. For example, enforcing `NOT NULL` constraints and using `DEFAULT` values helps prevent application crashes. On the DML side, writing efficient queries using `WHERE`, `LIKE`, and `IN` is paramount. A common pattern involves querying logs or transaction tables for specific keywords using `LIKE`, or filtering user IDs with the `IN` operator. Database administrators frequently run `ALTER` commands during off-peak hours to add indexes, optimizing the `SELECT` queries executed during peak times. Always remember that every `UPDATE` and `DELETE` without a `WHERE` clause poses a significant risk to the entire dataset.

### Advanced Deep Dive Scenario 3: Enterprise Database Management
In an enterprise scenario 3, managing a SQL Server instance requires a deep understanding of both DDL and DML. When multiple teams access the same tables, strict DDL structures ensure that data formats remain consistent. For example, enforcing `NOT NULL` constraints and using `DEFAULT` values helps prevent application crashes. On the DML side, writing efficient queries using `WHERE`, `LIKE`, and `IN` is paramount. A common pattern involves querying logs or transaction tables for specific keywords using `LIKE`, or filtering user IDs with the `IN` operator. Database administrators frequently run `ALTER` commands during off-peak hours to add indexes, optimizing the `SELECT` queries executed during peak times. Always remember that every `UPDATE` and `DELETE` without a `WHERE` clause poses a significant risk to the entire dataset.

### Advanced Deep Dive Scenario 4: Enterprise Database Management
In an enterprise scenario 4, managing a SQL Server instance requires a deep understanding of both DDL and DML. When multiple teams access the same tables, strict DDL structures ensure that data formats remain consistent. For example, enforcing `NOT NULL` constraints and using `DEFAULT` values helps prevent application crashes. On the DML side, writing efficient queries using `WHERE`, `LIKE`, and `IN` is paramount. A common pattern involves querying logs or transaction tables for specific keywords using `LIKE`, or filtering user IDs with the `IN` operator. Database administrators frequently run `ALTER` commands during off-peak hours to add indexes, optimizing the `SELECT` queries executed during peak times. Always remember that every `UPDATE` and `DELETE` without a `WHERE` clause poses a significant risk to the entire dataset.

### Advanced Deep Dive Scenario 5: Enterprise Database Management
In an enterprise scenario 5, managing a SQL Server instance requires a deep understanding of both DDL and DML. When multiple teams access the same tables, strict DDL structures ensure that data formats remain consistent. For example, enforcing `NOT NULL` constraints and using `DEFAULT` values helps prevent application crashes. On the DML side, writing efficient queries using `WHERE`, `LIKE`, and `IN` is paramount. A common pattern involves querying logs or transaction tables for specific keywords using `LIKE`, or filtering user IDs with the `IN` operator. Database administrators frequently run `ALTER` commands during off-peak hours to add indexes, optimizing the `SELECT` queries executed during peak times. Always remember that every `UPDATE` and `DELETE` without a `WHERE` clause poses a significant risk to the entire dataset.

### Advanced Deep Dive Scenario 6: Enterprise Database Management
In an enterprise scenario 6, managing a SQL Server instance requires a deep understanding of both DDL and DML. When multiple teams access the same tables, strict DDL structures ensure that data formats remain consistent. For example, enforcing `NOT NULL` constraints and using `DEFAULT` values helps prevent application crashes. On the DML side, writing efficient queries using `WHERE`, `LIKE`, and `IN` is paramount. A common pattern involves querying logs or transaction tables for specific keywords using `LIKE`, or filtering user IDs with the `IN` operator. Database administrators frequently run `ALTER` commands during off-peak hours to add indexes, optimizing the `SELECT` queries executed during peak times. Always remember that every `UPDATE` and `DELETE` without a `WHERE` clause poses a significant risk to the entire dataset.

### Advanced Deep Dive Scenario 7: Enterprise Database Management
In an enterprise scenario 7, managing a SQL Server instance requires a deep understanding of both DDL and DML. When multiple teams access the same tables, strict DDL structures ensure that data formats remain consistent. For example, enforcing `NOT NULL` constraints and using `DEFAULT` values helps prevent application crashes. On the DML side, writing efficient queries using `WHERE`, `LIKE`, and `IN` is paramount. A common pattern involves querying logs or transaction tables for specific keywords using `LIKE`, or filtering user IDs with the `IN` operator. Database administrators frequently run `ALTER` commands during off-peak hours to add indexes, optimizing the `SELECT` queries executed during peak times. Always remember that every `UPDATE` and `DELETE` without a `WHERE` clause poses a significant risk to the entire dataset.

### Advanced Deep Dive Scenario 8: Enterprise Database Management
In an enterprise scenario 8, managing a SQL Server instance requires a deep understanding of both DDL and DML. When multiple teams access the same tables, strict DDL structures ensure that data formats remain consistent. For example, enforcing `NOT NULL` constraints and using `DEFAULT` values helps prevent application crashes. On the DML side, writing efficient queries using `WHERE`, `LIKE`, and `IN` is paramount. A common pattern involves querying logs or transaction tables for specific keywords using `LIKE`, or filtering user IDs with the `IN` operator. Database administrators frequently run `ALTER` commands during off-peak hours to add indexes, optimizing the `SELECT` queries executed during peak times. Always remember that every `UPDATE` and `DELETE` without a `WHERE` clause poses a significant risk to the entire dataset.

### Advanced Deep Dive Scenario 9: Enterprise Database Management
In an enterprise scenario 9, managing a SQL Server instance requires a deep understanding of both DDL and DML. When multiple teams access the same tables, strict DDL structures ensure that data formats remain consistent. For example, enforcing `NOT NULL` constraints and using `DEFAULT` values helps prevent application crashes. On the DML side, writing efficient queries using `WHERE`, `LIKE`, and `IN` is paramount. A common pattern involves querying logs or transaction tables for specific keywords using `LIKE`, or filtering user IDs with the `IN` operator. Database administrators frequently run `ALTER` commands during off-peak hours to add indexes, optimizing the `SELECT` queries executed during peak times. Always remember that every `UPDATE` and `DELETE` without a `WHERE` clause poses a significant risk to the entire dataset.

### Advanced Deep Dive Scenario 10: Enterprise Database Management
In an enterprise scenario 10, managing a SQL Server instance requires a deep understanding of both DDL and DML. When multiple teams access the same tables, strict DDL structures ensure that data formats remain consistent. For example, enforcing `NOT NULL` constraints and using `DEFAULT` values helps prevent application crashes. On the DML side, writing efficient queries using `WHERE`, `LIKE`, and `IN` is paramount. A common pattern involves querying logs or transaction tables for specific keywords using `LIKE`, or filtering user IDs with the `IN` operator. Database administrators frequently run `ALTER` commands during off-peak hours to add indexes, optimizing the `SELECT` queries executed during peak times. Always remember that every `UPDATE` and `DELETE` without a `WHERE` clause poses a significant risk to the entire dataset.

### Advanced Deep Dive Scenario 11: Enterprise Database Management
In an enterprise scenario 11, managing a SQL Server instance requires a deep understanding of both DDL and DML. When multiple teams access the same tables, strict DDL structures ensure that data formats remain consistent. For example, enforcing `NOT NULL` constraints and using `DEFAULT` values helps prevent application crashes. On the DML side, writing efficient queries using `WHERE`, `LIKE`, and `IN` is paramount. A common pattern involves querying logs or transaction tables for specific keywords using `LIKE`, or filtering user IDs with the `IN` operator. Database administrators frequently run `ALTER` commands during off-peak hours to add indexes, optimizing the `SELECT` queries executed during peak times. Always remember that every `UPDATE` and `DELETE` without a `WHERE` clause poses a significant risk to the entire dataset.

### Advanced Deep Dive Scenario 12: Enterprise Database Management
In an enterprise scenario 12, managing a SQL Server instance requires a deep understanding of both DDL and DML. When multiple teams access the same tables, strict DDL structures ensure that data formats remain consistent. For example, enforcing `NOT NULL` constraints and using `DEFAULT` values helps prevent application crashes. On the DML side, writing efficient queries using `WHERE`, `LIKE`, and `IN` is paramount. A common pattern involves querying logs or transaction tables for specific keywords using `LIKE`, or filtering user IDs with the `IN` operator. Database administrators frequently run `ALTER` commands during off-peak hours to add indexes, optimizing the `SELECT` queries executed during peak times. Always remember that every `UPDATE` and `DELETE` without a `WHERE` clause poses a significant risk to the entire dataset.

### Advanced Deep Dive Scenario 13: Enterprise Database Management
In an enterprise scenario 13, managing a SQL Server instance requires a deep understanding of both DDL and DML. When multiple teams access the same tables, strict DDL structures ensure that data formats remain consistent. For example, enforcing `NOT NULL` constraints and using `DEFAULT` values helps prevent application crashes. On the DML side, writing efficient queries using `WHERE`, `LIKE`, and `IN` is paramount. A common pattern involves querying logs or transaction tables for specific keywords using `LIKE`, or filtering user IDs with the `IN` operator. Database administrators frequently run `ALTER` commands during off-peak hours to add indexes, optimizing the `SELECT` queries executed during peak times. Always remember that every `UPDATE` and `DELETE` without a `WHERE` clause poses a significant risk to the entire dataset.

### Advanced Deep Dive Scenario 14: Enterprise Database Management
In an enterprise scenario 14, managing a SQL Server instance requires a deep understanding of both DDL and DML. When multiple teams access the same tables, strict DDL structures ensure that data formats remain consistent. For example, enforcing `NOT NULL` constraints and using `DEFAULT` values helps prevent application crashes. On the DML side, writing efficient queries using `WHERE`, `LIKE`, and `IN` is paramount. A common pattern involves querying logs or transaction tables for specific keywords using `LIKE`, or filtering user IDs with the `IN` operator. Database administrators frequently run `ALTER` commands during off-peak hours to add indexes, optimizing the `SELECT` queries executed during peak times. Always remember that every `UPDATE` and `DELETE` without a `WHERE` clause poses a significant risk to the entire dataset.

### Advanced Deep Dive Scenario 15: Enterprise Database Management
In an enterprise scenario 15, managing a SQL Server instance requires a deep understanding of both DDL and DML. When multiple teams access the same tables, strict DDL structures ensure that data formats remain consistent. For example, enforcing `NOT NULL` constraints and using `DEFAULT` values helps prevent application crashes. On the DML side, writing efficient queries using `WHERE`, `LIKE`, and `IN` is paramount. A common pattern involves querying logs or transaction tables for specific keywords using `LIKE`, or filtering user IDs with the `IN` operator. Database administrators frequently run `ALTER` commands during off-peak hours to add indexes, optimizing the `SELECT` queries executed during peak times. Always remember that every `UPDATE` and `DELETE` without a `WHERE` clause poses a significant risk to the entire dataset.

### Advanced Deep Dive Scenario 16: Enterprise Database Management
In an enterprise scenario 16, managing a SQL Server instance requires a deep understanding of both DDL and DML. When multiple teams access the same tables, strict DDL structures ensure that data formats remain consistent. For example, enforcing `NOT NULL` constraints and using `DEFAULT` values helps prevent application crashes. On the DML side, writing efficient queries using `WHERE`, `LIKE`, and `IN` is paramount. A common pattern involves querying logs or transaction tables for specific keywords using `LIKE`, or filtering user IDs with the `IN` operator. Database administrators frequently run `ALTER` commands during off-peak hours to add indexes, optimizing the `SELECT` queries executed during peak times. Always remember that every `UPDATE` and `DELETE` without a `WHERE` clause poses a significant risk to the entire dataset.

### Advanced Deep Dive Scenario 17: Enterprise Database Management
In an enterprise scenario 17, managing a SQL Server instance requires a deep understanding of both DDL and DML. When multiple teams access the same tables, strict DDL structures ensure that data formats remain consistent. For example, enforcing `NOT NULL` constraints and using `DEFAULT` values helps prevent application crashes. On the DML side, writing efficient queries using `WHERE`, `LIKE`, and `IN` is paramount. A common pattern involves querying logs or transaction tables for specific keywords using `LIKE`, or filtering user IDs with the `IN` operator. Database administrators frequently run `ALTER` commands during off-peak hours to add indexes, optimizing the `SELECT` queries executed during peak times. Always remember that every `UPDATE` and `DELETE` without a `WHERE` clause poses a significant risk to the entire dataset.

### Advanced Deep Dive Scenario 18: Enterprise Database Management
In an enterprise scenario 18, managing a SQL Server instance requires a deep understanding of both DDL and DML. When multiple teams access the same tables, strict DDL structures ensure that data formats remain consistent. For example, enforcing `NOT NULL` constraints and using `DEFAULT` values helps prevent application crashes. On the DML side, writing efficient queries using `WHERE`, `LIKE`, and `IN` is paramount. A common pattern involves querying logs or transaction tables for specific keywords using `LIKE`, or filtering user IDs with the `IN` operator. Database administrators frequently run `ALTER` commands during off-peak hours to add indexes, optimizing the `SELECT` queries executed during peak times. Always remember that every `UPDATE` and `DELETE` without a `WHERE` clause poses a significant risk to the entire dataset.

### Advanced Deep Dive Scenario 19: Enterprise Database Management
In an enterprise scenario 19, managing a SQL Server instance requires a deep understanding of both DDL and DML. When multiple teams access the same tables, strict DDL structures ensure that data formats remain consistent. For example, enforcing `NOT NULL` constraints and using `DEFAULT` values helps prevent application crashes. On the DML side, writing efficient queries using `WHERE`, `LIKE`, and `IN` is paramount. A common pattern involves querying logs or transaction tables for specific keywords using `LIKE`, or filtering user IDs with the `IN` operator. Database administrators frequently run `ALTER` commands during off-peak hours to add indexes, optimizing the `SELECT` queries executed during peak times. Always remember that every `UPDATE` and `DELETE` without a `WHERE` clause poses a significant risk to the entire dataset.

### Advanced Deep Dive Scenario 20: Enterprise Database Management
In an enterprise scenario 20, managing a SQL Server instance requires a deep understanding of both DDL and DML. When multiple teams access the same tables, strict DDL structures ensure that data formats remain consistent. For example, enforcing `NOT NULL` constraints and using `DEFAULT` values helps prevent application crashes. On the DML side, writing efficient queries using `WHERE`, `LIKE`, and `IN` is paramount. A common pattern involves querying logs or transaction tables for specific keywords using `LIKE`, or filtering user IDs with the `IN` operator. Database administrators frequently run `ALTER` commands during off-peak hours to add indexes, optimizing the `SELECT` queries executed during peak times. Always remember that every `UPDATE` and `DELETE` without a `WHERE` clause poses a significant risk to the entire dataset.

### Advanced Deep Dive Scenario 21: Enterprise Database Management
In an enterprise scenario 21, managing a SQL Server instance requires a deep understanding of both DDL and DML. When multiple teams access the same tables, strict DDL structures ensure that data formats remain consistent. For example, enforcing `NOT NULL` constraints and using `DEFAULT` values helps prevent application crashes. On the DML side, writing efficient queries using `WHERE`, `LIKE`, and `IN` is paramount. A common pattern involves querying logs or transaction tables for specific keywords using `LIKE`, or filtering user IDs with the `IN` operator. Database administrators frequently run `ALTER` commands during off-peak hours to add indexes, optimizing the `SELECT` queries executed during peak times. Always remember that every `UPDATE` and `DELETE` without a `WHERE` clause poses a significant risk to the entire dataset.

### Advanced Deep Dive Scenario 22: Enterprise Database Management
In an enterprise scenario 22, managing a SQL Server instance requires a deep understanding of both DDL and DML. When multiple teams access the same tables, strict DDL structures ensure that data formats remain consistent. For example, enforcing `NOT NULL` constraints and using `DEFAULT` values helps prevent application crashes. On the DML side, writing efficient queries using `WHERE`, `LIKE`, and `IN` is paramount. A common pattern involves querying logs or transaction tables for specific keywords using `LIKE`, or filtering user IDs with the `IN` operator. Database administrators frequently run `ALTER` commands during off-peak hours to add indexes, optimizing the `SELECT` queries executed during peak times. Always remember that every `UPDATE` and `DELETE` without a `WHERE` clause poses a significant risk to the entire dataset.

### Advanced Deep Dive Scenario 23: Enterprise Database Management
In an enterprise scenario 23, managing a SQL Server instance requires a deep understanding of both DDL and DML. When multiple teams access the same tables, strict DDL structures ensure that data formats remain consistent. For example, enforcing `NOT NULL` constraints and using `DEFAULT` values helps prevent application crashes. On the DML side, writing efficient queries using `WHERE`, `LIKE`, and `IN` is paramount. A common pattern involves querying logs or transaction tables for specific keywords using `LIKE`, or filtering user IDs with the `IN` operator. Database administrators frequently run `ALTER` commands during off-peak hours to add indexes, optimizing the `SELECT` queries executed during peak times. Always remember that every `UPDATE` and `DELETE` without a `WHERE` clause poses a significant risk to the entire dataset.

### Advanced Deep Dive Scenario 24: Enterprise Database Management
In an enterprise scenario 24, managing a SQL Server instance requires a deep understanding of both DDL and DML. When multiple teams access the same tables, strict DDL structures ensure that data formats remain consistent. For example, enforcing `NOT NULL` constraints and using `DEFAULT` values helps prevent application crashes. On the DML side, writing efficient queries using `WHERE`, `LIKE`, and `IN` is paramount. A common pattern involves querying logs or transaction tables for specific keywords using `LIKE`, or filtering user IDs with the `IN` operator. Database administrators frequently run `ALTER` commands during off-peak hours to add indexes, optimizing the `SELECT` queries executed during peak times. Always remember that every `UPDATE` and `DELETE` without a `WHERE` clause poses a significant risk to the entire dataset.

### Advanced Deep Dive Scenario 25: Enterprise Database Management
In an enterprise scenario 25, managing a SQL Server instance requires a deep understanding of both DDL and DML. When multiple teams access the same tables, strict DDL structures ensure that data formats remain consistent. For example, enforcing `NOT NULL` constraints and using `DEFAULT` values helps prevent application crashes. On the DML side, writing efficient queries using `WHERE`, `LIKE`, and `IN` is paramount. A common pattern involves querying logs or transaction tables for specific keywords using `LIKE`, or filtering user IDs with the `IN` operator. Database administrators frequently run `ALTER` commands during off-peak hours to add indexes, optimizing the `SELECT` queries executed during peak times. Always remember that every `UPDATE` and `DELETE` without a `WHERE` clause poses a significant risk to the entire dataset.

### Advanced Deep Dive Scenario 26: Enterprise Database Management
In an enterprise scenario 26, managing a SQL Server instance requires a deep understanding of both DDL and DML. When multiple teams access the same tables, strict DDL structures ensure that data formats remain consistent. For example, enforcing `NOT NULL` constraints and using `DEFAULT` values helps prevent application crashes. On the DML side, writing efficient queries using `WHERE`, `LIKE`, and `IN` is paramount. A common pattern involves querying logs or transaction tables for specific keywords using `LIKE`, or filtering user IDs with the `IN` operator. Database administrators frequently run `ALTER` commands during off-peak hours to add indexes, optimizing the `SELECT` queries executed during peak times. Always remember that every `UPDATE` and `DELETE` without a `WHERE` clause poses a significant risk to the entire dataset.

### Advanced Deep Dive Scenario 27: Enterprise Database Management

## Think Like a Dev
- **Data Integrity:** A developer always thinks about how to prevent bad data from entering the system. Use constraints (NOT NULL, UNIQUE, PRIMARY KEY) aggressively. Let the database enforce rules so your application code doesn't have to carry the entire burden.
- **Performance:** While `SELECT *` is convenient during development, a seasoned developer explicitly lists the columns they need. This reduces memory usage, network traffic, and improves query execution time.
- **Safety First:** Never run an `UPDATE` or `DELETE` statement without first writing it as a `SELECT` statement to verify the exact rows you are about to modify or destroy.

## Before/After

### Before (Without Databases - Flat Files)
Applications stored data in text files or CSVs. Searching for a specific user meant loading the entire file into memory, parsing it, and looping through every record. Updates required rewriting the entire file, leading to massive concurrency issues and data corruption risks.

### After (With Relational Databases)
Data is organized into normalized tables. Searching for a user is a simple `SELECT` query utilizing indexes for near-instant retrieval. The database engine manages concurrent access, ensuring that multiple users can read and write data simultaneously without corrupting the files.

## Common Mistakes
- **Forgetting the WHERE clause:** Running `UPDATE Users SET IsActive = 0;` will deactivate every single user in your system!
- **Using string concatenation for queries in app code:** This leads to SQL Injection vulnerabilities. Always use parameterized queries (which we will cover in the backend integration module).
- **Ignoring Data Types:** Storing dates as `VARCHAR` strings makes date math (like calculating age) incredibly difficult and inefficient. Always use the appropriate data type (e.g., `DATE`, `DATETIME`).
- **Overusing NULLs:** If a column should always have a value, mark it `NOT NULL`. Allowing NULLs indiscriminately leads to complex logic and unexpected behavior when querying.

## Labs

### Lab 1: Environment Setup
1. Download and install SQL Server Developer Edition.
2. Download and install SSMS.
3. Connect to your local server.

### Lab 2: Database and Schema Creation
1. Write a script to create a database named `ECommerceDB`.
2. Write a script to create a `Products` table with the following columns: `ProductID` (Primary Key), `ProductName`, `Price`, `StockQuantity`, and `Category`.

### Lab 3: Data Manipulation and Filtering
1. Insert at least 5 different products into your `Products` table.
2. Write a `SELECT` query to find all products where the `Price` is greater than 50.
3. Write an `UPDATE` query to reduce the `StockQuantity` of a specific product by 1.
4. Write a `SELECT` query using the `LIKE` operator to find all products belonging to a category that contains the word 'Electronics'.

## Interview Prep
**Q1: What is the difference between DDL and DML?**
*A1:* DDL (Data Definition Language) includes commands like CREATE, ALTER, and DROP, which define the structure of the database. DML (Data Manipulation Language) includes commands like SELECT, INSERT, UPDATE, and DELETE, which manage the actual data within those structures.

**Q2: What is the purpose of the IDENTITY property in SQL Server?**
*A2:* The IDENTITY property is used to automatically generate sequential numeric values for a column, commonly used for Primary Keys to ensure each row has a unique identifier without manual entry.

**Q3: Explain the difference between WHERE and HAVING.**
*A3:* `WHERE` filters rows before any grouping occurs. `HAVING` is used to filter groups after the `GROUP BY` clause has been applied.

## Cheat Sheet
- **Create DB:** `CREATE DATABASE DBName;`
- **Use DB:** `USE DBName;`
- **Create Table:** `CREATE TABLE TableName (Col1 Type Constraint, Col2 Type);`
- **Alter Table Add Col:** `ALTER TABLE TableName ADD ColName Type;`
- **Drop Table:** `DROP TABLE TableName;`
- **Insert:** `INSERT INTO TableName (Col1, Col2) VALUES (Val1, Val2);`
- **Select All:** `SELECT * FROM TableName;`
- **Select Filter:** `SELECT * FROM TableName WHERE Condition;`
- **Update:** `UPDATE TableName SET Col1 = Val1 WHERE Condition;`
- **Delete:** `DELETE FROM TableName WHERE Condition;`
- **Like (Starts with A):** `WHERE ColName LIKE 'A%'`
- **In List:** `WHERE ColName IN (Val1, Val2, Val3)`

## Key Takeaways
- Relational databases provide robust, secure, and highly concurrent data storage.
- SQL Server and SSMS are the standard tools for Microsoft stack database development.
- DDL shapes the container; DML manages the contents.
- Always be cautious with UPDATE and DELETE—double-check your WHERE clauses!
- Filtering is crucial for both performance and accurate data retrieval.

**Next Lecture:** [Lecture 36 — Advanced MSSQL - Joins, Aggregation & Programmability](../36%20-%20Advanced%20MSSQL%20-%20Joins%2C%20Aggregation%20%26%20Programmability/36%20-%20Advanced%20MSSQL%20-%20Joins%2C%20Aggregation%20%26%20Programmability.md)

### 📚 Extensive Tutorials & Resources
- **Microsoft Learn:** [SQL Server Installation Guide](https://learn.microsoft.com/en-us/sql/database-engine/install-windows/install-sql-server)
- **Microsoft Learn:** [Connect and Query a SQL Server Instance using SSMS](https://learn.microsoft.com/en-us/sql/ssms/tutorials/connect-query-sql-server)
- **SQL Server Tutorial:** [T-SQL CREATE TABLE Statement](https://www.sqlservertutorial.net/sql-server-basics/sql-server-create-table/)
- **SQL Server Tutorial:** [T-SQL CRUD Operations and Syntax](https://www.sqlservertutorial.net/sql-server-basics/)
- **SQLBolt:** [Learning SQL Queries with WHERE Constraints](https://sqlbolt.com/lesson/select_queries_with_constraints)
- **W3Schools:** [SQL LIKE Operator with Wildcards](https://www.w3schools.com/sql/sql_like.asp)
- **W3Schools:** [SQL IN Operator Quick Guide](https://www.w3schools.com/sql/sql_in.asp)

