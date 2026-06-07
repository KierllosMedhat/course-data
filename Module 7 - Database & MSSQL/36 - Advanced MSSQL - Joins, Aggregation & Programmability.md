# 35 - Advanced MSSQL: Joins, Aggregation & Programmability

Welcome to the third lecture of the database module! In this lesson, we are diving deep into the advanced querying capabilities of Microsoft SQL Server (MSSQL). You will transition from writing simple `SELECT` statements to crafting complex, multi-table queries that can summarize millions of rows, extract nuanced insights, and automate database operations using programmability features.

## 1. Prerequisites
Before beginning this module, ensure you have:
* **Basic SQL Knowledge**: A solid understanding of basic `SELECT`, `INSERT`, `UPDATE`, and `DELETE` statements.
* **Filtering and Sorting**: Comfort using `WHERE`, `ORDER BY`, `LIKE`, and logical operators (`AND`, `OR`, `NOT`).
* **Environment Setup**: Microsoft SQL Server Management Studio (SSMS) or Azure Data Studio installed.
* **Sample Database**: The Northwind or AdventureWorks sample database attached to your local SQL Server instance.
* **Relational Concepts**: Understanding of Primary Keys (PK) and Foreign Keys (FK).

## 2. Objectives
By the end of this lecture, you will be able to:
1. **Master Relational Joins**: Effectively combine data from multiple tables using `INNER JOIN`, `LEFT/RIGHT OUTER JOIN`, `FULL OUTER JOIN`, and `CROSS JOIN`.
2. **Aggregate Data**: Use `GROUP BY` and `HAVING` clauses to summarize data effectively and filter grouped results.
3. **Utilize Built-In Functions**: Leverage string, date, math, and conversion functions to manipulate data on the fly.
4. **Implement Subqueries**: Write nested queries (scalar, multi-valued, and correlated) to solve complex analytical problems.
5. **Introduce Programmability**: Create and manage basic Views to abstract query complexity, and write Stored Procedures to encapsulate business logic for reuse and security.

## 3. Agenda
1. **Introduction to Relational Algebra and Joins**
2. **Deep Dive: INNER vs. OUTER JOINs**
3. **Aggregating Data: GROUP BY and HAVING**
4. **Built-in Functions in MSSQL**
5. **The Power of Subqueries**
6. **Programmability: Views**
7. **Programmability: Stored Procedures**
8. **Labs & Exercises**
9. **Review & Q&A**

---

## 4. Deep Dive

### 4.1 INNER and OUTER JOINs
Relational databases store data in multiple normalized tables. To construct meaningful reports or application views, we must combine these tables. This is achieved through joins.

#### INNER JOIN
An `INNER JOIN` returns only the rows where there is a match in **both** tables based on the join condition.

```sql
-- Syntax & Example
SELECT 
    e.EmployeeID,
    e.FirstName,
    e.LastName,
    d.DepartmentName
FROM 
    Employees AS e
INNER JOIN 
    Departments AS d ON e.DepartmentID = d.DepartmentID;
```
If an employee does not belong to a department, or a department has no employees, those records are excluded from the result set.

#### LEFT OUTER JOIN
A `LEFT JOIN` (or `LEFT OUTER JOIN`) returns **all** rows from the left table, and the matched rows from the right table. The result is `NULL` from the right side if there is no match.

```sql
SELECT 
    c.CustomerID,
    c.CompanyName,
    o.OrderID,
    o.OrderDate
FROM 
    Customers AS c
LEFT OUTER JOIN 
    Orders AS o ON c.CustomerID = o.CustomerID;
```
This query is critical for finding "orphaned" records, such as Customers who have never placed an order (where `o.OrderID IS NULL`).

#### RIGHT OUTER JOIN
A `RIGHT JOIN` is the exact reverse of a `LEFT JOIN`. It returns all rows from the right table, and matching rows from the left.

```sql
SELECT 
    c.CustomerID,
    c.CompanyName,
    o.OrderID,
    o.OrderDate
FROM 
    Customers AS c
RIGHT OUTER JOIN 
    Orders AS o ON c.CustomerID = o.CustomerID;
```

#### FULL OUTER JOIN
Combines the results of both `LEFT` and `RIGHT` joins. It returns all records when there is a match in either left or right table.

```sql
SELECT 
    e.EmployeeName,
    p.ProjectName
FROM 
    Employees AS e
FULL OUTER JOIN 
    ProjectAssignments AS p ON e.EmployeeID = p.EmployeeID;
```

#### CROSS JOIN
Produces the Cartesian product of two tables. If Table A has 10 rows and Table B has 5 rows, the result is 50 rows.

```sql
SELECT 
    c.ColorName,
    s.SizeName
FROM 
    Colors AS c
CROSS JOIN 
    Sizes AS s;
```

### 4.2 Aggregation: GROUP BY & HAVING
Aggregation allows us to roll up detail records into summaries (e.g., total sales per month, average salary per department).

#### Aggregate Functions
The most common aggregate functions are:
* `COUNT()`: Counts the number of rows.
* `SUM()`: Adds up numerical values.
* `AVG()`: Calculates the mean of numerical values.
* `MIN()`: Finds the smallest value.
* `MAX()`: Finds the largest value.

#### The GROUP BY Clause
When you use an aggregate function alongside non-aggregated columns, you must group by the non-aggregated columns.

```sql
SELECT 
    DepartmentID,
    COUNT(EmployeeID) AS NumberOfEmployees,
    AVG(Salary) AS AverageSalary
FROM 
    Employees
GROUP BY 
    DepartmentID;
```

#### The HAVING Clause
The `WHERE` clause filters rows **before** aggregation. The `HAVING` clause filters groups **after** aggregation.

```sql
-- Find departments with an average salary greater than $75,000
SELECT 
    DepartmentID,
    COUNT(EmployeeID) AS NumberOfEmployees,
    AVG(Salary) AS AverageSalary
FROM 
    Employees
GROUP BY 
    DepartmentID
HAVING 
    AVG(Salary) > 75000;
```

### 4.3 Built-in Functions
MSSQL provides a rich set of built-in functions.

#### String Functions
* `LEN(string)`: Returns string length.
* `SUBSTRING(string, start, length)`: Extracts a part of a string.
* `UPPER(string)` / `LOWER(string)`: Case conversion.
* `CONCAT(str1, str2, ...)`: Joins strings safely (handles NULLs).
* `REPLACE(string, old, new)`: Replaces occurrences of a substring.

```sql
SELECT 
    UPPER(LastName) + ', ' + FirstName AS FullName,
    SUBSTRING(PhoneNumber, 1, 3) AS AreaCode
FROM Employees;
```

#### Date & Time Functions
* `GETDATE()`: Current system date and time.
* `DATEADD(datepart, number, date)`: Adds time to a date.
* `DATEDIFF(datepart, startdate, enddate)`: Difference between dates.
* `FORMAT(value, format)`: Formats date/time (and numbers).

```sql
SELECT 
    OrderID,
    OrderDate,
    DATEDIFF(day, OrderDate, GETDATE()) AS DaysSinceOrder
FROM Orders;
```

#### Conversion Functions
* `CAST(expression AS data_type)`
* `CONVERT(data_type, expression, [style])`
* `ISNULL(check_expression, replacement_value)`
* `COALESCE(val1, val2, ...)`: Returns first non-null value.

```sql
SELECT 
    ProductName,
    ISNULL(Color, 'N/A') AS ProductColor,
    CAST(Price AS VARCHAR(10)) AS PriceText
FROM Products;
```

### 4.4 Subqueries
A subquery is a query nested inside another query (`SELECT`, `INSERT`, `UPDATE`, `DELETE`).

#### Scalar Subqueries
Returns a single value (one row, one column). Used wherever an expression is allowed.
```sql
-- Find employees who earn more than the company average
SELECT EmployeeName, Salary
FROM Employees
WHERE Salary > (SELECT AVG(Salary) FROM Employees);
```

#### Multi-Valued Subqueries
Returns a single column with multiple rows. Used with `IN`, `ANY`, or `ALL`.
```sql
-- Find customers who have ordered product ID 42
SELECT CustomerName
FROM Customers
WHERE CustomerID IN (
    SELECT CustomerID 
    FROM Orders 
    JOIN OrderDetails ON Orders.OrderID = OrderDetails.OrderID
    WHERE ProductID = 42
);
```

#### Correlated Subqueries
A subquery that references columns from the outer query. It executes once for every row evaluated by the outer query.
```sql
-- Find employees who earn more than the average salary of THEIR specific department
SELECT EmployeeName, Salary, DepartmentID
FROM Employees AS e1
WHERE Salary > (
    SELECT AVG(Salary)
    FROM Employees AS e2
    WHERE e1.DepartmentID = e2.DepartmentID
);
```

### 4.5 Programmability: Views and Stored Procedures

#### Views
A view is a virtual table based on the result-set of an SQL statement. It abstracts complex joins and aggregations, providing a simplified interface for applications or users, and can enhance security by restricting column access.

```sql
CREATE VIEW vw_ActiveEmployees AS
SELECT 
    e.EmployeeID,
    e.FirstName + ' ' + e.LastName AS FullName,
    d.DepartmentName,
    e.HireDate
FROM 
    Employees AS e
INNER JOIN 
    Departments AS d ON e.DepartmentID = d.DepartmentID
WHERE 
    e.IsActive = 1;
    
-- Usage:
SELECT * FROM vw_ActiveEmployees WHERE DepartmentName = 'IT';
```

#### Stored Procedures (SPs)
A stored procedure is a prepared SQL code that you can save, so the code can be reused over and over again. They can accept parameters, execute complex transactional logic, and return result sets or output parameters.

Benefits:
* **Performance**: Execution plans are cached.
* **Security**: Can grant execute permission without granting direct table access. Reduces SQL injection risk.
* **Maintainability**: Centralizes business logic in the database.

```sql
CREATE PROCEDURE sp_GetEmployeesByDepartment
    @DepartmentName VARCHAR(50),
    @MinSalary DECIMAL(18,2) = 0 -- Optional parameter with default
AS
BEGIN
    -- SET NOCOUNT ON prevents the message that shows the count of the number of rows affected
    SET NOCOUNT ON;

    SELECT 
        e.EmployeeID,
        e.FirstName,
        e.LastName,
        e.Salary
    FROM 
        Employees AS e
    INNER JOIN 
        Departments AS d ON e.DepartmentID = d.DepartmentID
    WHERE 
        d.DepartmentName = @DepartmentName
        AND e.Salary >= @MinSalary;
END;
GO

-- Execution:
EXEC sp_GetEmployeesByDepartment @DepartmentName = 'Sales', @MinSalary = 60000;
```

---

## 5. Think Like a Dev
When working with advanced SQL, your mindset must shift from "how do I get this data?" to "how do I get this data *efficiently* and *maintainably*?"

1. **Set-Based vs. Procedural Thinking**: SQL is designed to operate on sets of data simultaneously. Avoid using cursors or loops whenever possible. Think in terms of Venn diagrams (sets) rather than iterating through arrays.
2. **Always Consider the Grain**: When writing a query with joins, constantly ask yourself: "What does one row in my result set represent?" If it's supposed to represent a unique Order, but you're joining to OrderDetails and getting multiple rows per Order, your grain has exploded. You need to aggregate.
3. **NULL is Not Zero or Empty String**: `NULL` means "unknown." Comparing `NULL = NULL` yields `NULL` (false), not true. This is why we use `IS NULL` and why `LEFT JOIN` logic can get tricky. Think about how your application will handle `NULL` values returned from the DB.
4. **The Principle of Least Privilege**: When designing Views and Stored Procedures, you are creating an API for your database. An application should rarely access base tables directly. It should call stored procedures, which limits the blast radius of bugs and malicious intent.

---

## 6. Before/After

### Before: The N+1 Query Problem in Application Code
Novice developers often query a list of records, loop through them in application code (Node.js, C#, Python), and run another query for each record.

```javascript
// BAD PRACTICE: N+1 Queries
const departments = await db.query('SELECT * FROM Departments');

for (let dept of departments) {
    // This executes N times!
    const employees = await db.query(`SELECT COUNT(*) FROM Employees WHERE DepartmentID = ${dept.DepartmentID}`);
    dept.EmployeeCount = employees[0].count;
}
```

### After: The Power of SQL Joins and Aggregation
A seasoned developer pushes this work down to the database engine, which is heavily optimized for relational operations.

```sql
-- GOOD PRACTICE: A single, efficient query
SELECT 
    d.DepartmentName,
    COUNT(e.EmployeeID) AS EmployeeCount
FROM 
    Departments AS d
LEFT JOIN 
    Employees AS e ON d.DepartmentID = e.DepartmentID
GROUP BY 
    d.DepartmentName;
```
The application now only makes **one** round trip to the database.

---

## 7. Common Mistakes

1. **Unintentional Cartesian Products**: Forgetting the `ON` clause or misconfiguring it can result in a `CROSS JOIN`, multiplying your rows exponentially and crashing your server.
2. **Filtering the Right Side of a LEFT JOIN in the WHERE Clause**:
   ```sql
   -- MISTAKE: This turns the LEFT JOIN into an INNER JOIN!
   SELECT * FROM Customers c
   LEFT JOIN Orders o ON c.CustomerID = o.CustomerID
   WHERE o.OrderDate > '2023-01-01';
   ```
   *Fix*: Move the condition to the `ON` clause if you still want all customers.
   ```sql
   SELECT * FROM Customers c
   LEFT JOIN Orders o ON c.CustomerID = o.CustomerID AND o.OrderDate > '2023-01-01';
   ```
3. **Using `COUNT(*)` vs `COUNT(ColumnName)`**: `COUNT(*)` counts all rows, including those with nulls. `COUNT(ColumnName)` counts only non-null values in that column. Mixing these up leads to inaccurate reports.
4. **Over-using Correlated Subqueries**: Correlated subqueries execute row-by-row. If your outer query returns 10,000 rows, the subquery executes 10,000 times. Often, these can be rewritten as highly optimized `INNER JOIN`s.
5. **Not Handling NULLs in Strings or Math**: `100 + NULL = NULL`. `'Hello ' + NULL = NULL`. Always wrap nullable columns in `ISNULL()` or `COALESCE()` when performing operations.

---

## 8. Labs

### Lab 8.1: Master the Joins
**Scenario**: You are managing an e-commerce database.
1. Write an `INNER JOIN` to retrieve all `OrderIDs` and their corresponding `ProductName`s from the `Orders`, `OrderDetails`, and `Products` tables.
2. Write a `LEFT JOIN` to find all `Products` that have *never* been ordered.
3. Write a query using `COALESCE` to display the `ShipRegion`. If `ShipRegion` is NULL, display 'N/A'.

### Lab 8.2: Aggregation Analytics
**Scenario**: The CEO wants a sales report.
1. Write a query to find the total sales amount (`SUM(UnitPrice * Quantity)`) grouped by `EmployeeID`.
2. Modify the query to only show Employees whose total sales exceed $50,000. Use the `HAVING` clause.
3. Add a `JOIN` to display the `EmployeeName` instead of just the ID.

### Lab 8.3: Procedure Creation
**Scenario**: The application needs a secure way to insert new customers.
1. Create a stored procedure `sp_InsertCustomer` that accepts `@CompanyName`, `@ContactName`, and `@City`.
2. Inside the procedure, check if a customer with that `CompanyName` already exists. If so, return an error using `THROW`.
3. If they do not exist, `INSERT` the record and `SELECT` the newly created `CustomerID` using `SCOPE_IDENTITY()`.

---

## 9. Interview Prep

**Q: Explain the difference between `WHERE` and `HAVING`.**
*Answer*: `WHERE` filters rows from the base tables *before* grouping and aggregation occur. `HAVING` filters the resulting groups *after* the `GROUP BY` clause has been applied. You cannot use aggregate functions in a `WHERE` clause, but you must use them (or grouped columns) in a `HAVING` clause.

**Q: What is a correlated subquery and why should you be careful with it?**
*Answer*: A correlated subquery is a subquery that references one or more columns from the outer query. It's dangerous for performance because it generally executes row-by-row for every row returned by the outer query, acting essentially as a nested loop. Where possible, it should be refactored into a `JOIN`.

**Q: Why use Stored Procedures instead of inline SQL strings in your application?**
*Answer*:
1. **Security**: Mitigates SQL Injection; allows granting execution rights without exposing tables.
2. **Network Traffic**: Sending a procedure call `EXEC sp_Name` takes fewer bytes than sending a massive 50-line SQL query.
3. **Maintainability**: SQL logic is decoupled from application code. You can update the procedure without recompiling the application.
4. **Performance**: In MSSQL, execution plans for SPs are cached, reducing compilation overhead for repeated executions.

**Q: What is the difference between `ISNULL` and `COALESCE`?**
*Answer*: `ISNULL` is an MSSQL-specific function that takes exactly two arguments and replaces the first with the second if the first is NULL. `COALESCE` is ANSI SQL standard and can take multiple arguments, returning the first non-NULL value in the list. `COALESCE` also determines the data type based on the highest precedence element, while `ISNULL` uses the data type of the first parameter.

---

## 10. Cheat Sheet

### Joins Quick Reference
* `INNER JOIN`: Intersect (Match in both)
* `LEFT JOIN`: Everything on the Left + Matches on the Right
* `RIGHT JOIN`: Everything on the Right + Matches on the Left
* `FULL JOIN`: Union (Everything from both, matched where possible)
* `CROSS JOIN`: Cartesian Product (Every row combined with every row)

### Aggregation Syntax Template
```sql
SELECT 
    Category,
    COUNT(ID) as TotalItems,
    SUM(Price) as TotalValue
FROM 
    Table
WHERE 
    IsActive = 1        -- Row filter
GROUP BY 
    Category            -- Grouping mechanism
HAVING 
    SUM(Price) > 1000   -- Group filter
ORDER BY 
    TotalValue DESC;    -- Sorting mechanism
```

### Essential Functions
* **Date**: `GETDATE()`, `DATEADD(day, 1, @d)`, `DATEDIFF(year, @d1, @d2)`
* **String**: `LEN(@s)`, `SUBSTRING(@s, 1, 5)`, `REPLACE(@s, 'a', 'b')`, `CONCAT(@s1, @s2)`
* **Null Handling**: `ISNULL(Column, 'Default')`, `COALESCE(Col1, Col2, Col3)`
* **Conversion**: `CAST(Col AS VARCHAR(10))`, `CONVERT(VARCHAR(10), Col, 101)`

---

## 11. Key Takeaways
1. **Relational Power**: The true power of a relational database lies in its ability to securely and efficiently join normalized data back together.
2. **Let the DB Do the Heavy Lifting**: Always perform sorting, filtering, and aggregation at the database level. Do not drag millions of rows into your application memory just to calculate a sum.
3. **Programmability == Professionalism**: Using Views and Stored Procedures elevates your database from a "dumb storage bucket" to a secure, encapsulated data service layer.
4. **Mind the NULLs**: NULLs are the source of many logic bugs in SQL. Always defensively program around them using `ISNULL`, `COALESCE`, and careful `JOIN` conditions.

---

## Appendix: Extended Glossary and Advanced Examples

### A. Extended String Functions
In advanced scenarios, you might need to manipulate strings extensively.
* **CHARINDEX(substring, string, [start_location])**: Returns the starting position of the specified expression in a character string.
  ```sql
  SELECT CHARINDEX('SQL', 'Advanced MSSQL Programming'); -- Returns 14
  ```
* **PATINDEX('%pattern%', string)**: Returns the starting position of the first occurrence of a pattern.
* **LTRIM(string) / RTRIM(string)**: Removes leading/trailing spaces. In SQL Server 2017+, `TRIM()` is also available.

### B. Extended Date Functions
* **DATETIMEFROMPARTS(year, month, day, hour, minute, seconds, milliseconds)**: Constructs a datetime value.
* **EOMONTH(start_date, [months_to_add])**: Returns the last day of the month containing the specified date.
  ```sql
  SELECT EOMONTH('2023-02-15'); -- Returns '2023-02-28'
  ```

### C. Advanced Subquery Variations

#### The EXISTS Operator
`EXISTS` is used to test for the existence of any record in a subquery. It returns TRUE if the subquery returns one or more records. It is often much faster than `IN` for large datasets.

```sql
-- Find suppliers who supply at least one product that costs more than $100
SELECT CompanyName
FROM Suppliers AS s
WHERE EXISTS (
    SELECT 1 
    FROM Products AS p 
    WHERE p.SupplierID = s.SupplierID AND p.UnitPrice > 100
);
```

#### Derived Tables
A derived table is a subquery used in the `FROM` clause. It acts as a temporary table for the duration of the query.

```sql
SELECT 
    DeptName, 
    AvgSalary 
FROM (
    SELECT 
        d.DepartmentName AS DeptName, 
        AVG(e.Salary) AS AvgSalary
    FROM Departments AS d
    JOIN Employees AS e ON d.DepartmentID = e.DepartmentID
    GROUP BY d.DepartmentName
) AS DerivedTable
WHERE AvgSalary > 60000;
```

### D. Deep Dive into Programmability Context

#### Output Parameters in Stored Procedures
Stored procedures can return values via `OUTPUT` parameters, avoiding the need to return a full result set for a single value.

```sql
CREATE PROCEDURE sp_CountEmployees
    @DepartmentID INT,
    @EmployeeCount INT OUTPUT
AS
BEGIN
    SELECT @EmployeeCount = COUNT(*) 
    FROM Employees 
    WHERE DepartmentID = @DepartmentID;
END;
GO

-- Calling the SP:
DECLARE @Count INT;
EXEC sp_CountEmployees @DepartmentID = 1, @EmployeeCount = @Count OUTPUT;
PRINT 'Number of employees: ' + CAST(@Count AS VARCHAR);
```

#### User Defined Functions (UDFs)
While Stored Procedures are for actions, UDFs are strictly for computing values and returning them. They can be used inside `SELECT` statements (unlike SPs).

**Scalar UDF:**
```sql
CREATE FUNCTION fn_CalculateDiscount (@Price DECIMAL(18,2), @DiscountPercentage INT)
RETURNS DECIMAL(18,2)
AS
BEGIN
    RETURN @Price - (@Price * @DiscountPercentage / 100.0);
END;
GO

-- Usage:
SELECT ProductName, UnitPrice, dbo.fn_CalculateDiscount(UnitPrice, 10) AS DiscountedPrice FROM Products;
```
*Warning*: Scalar UDFs can cause severe performance issues when applied to millions of rows because they act like a hidden correlated subquery.

### E. Advanced Grouping Techniques

#### GROUPING SETS
`GROUPING SETS` allow you to define multiple groupings in the same query. It's equivalent to multiple `GROUP BY` queries combined with `UNION ALL`.

```sql
SELECT 
    Department, 
    JobTitle, 
    SUM(Salary) AS TotalSalary
FROM Employees
GROUP BY GROUPING SETS (
    (Department, JobTitle), -- Group by Dept and Title
    (Department),           -- Group by Dept only
    ()                      -- Grand Total
);
```

#### ROLLUP
`ROLLUP` is a shortcut for defining grouping sets that represent a hierarchy. `GROUP BY ROLLUP (Year, Month)` creates groupings for (Year, Month), (Year), and Grand Total.

#### CUBE
`CUBE` creates a grouping set for every possible combination of the columns provided.

### F. Window Functions Preview
While advanced querying often starts with `GROUP BY`, the true master level involves Window Functions (`OVER()` clause). They allow you to perform aggregations without collapsing the rows.

```sql
-- Compare each employee's salary to the department average, keeping all employee rows
SELECT 
    EmployeeName,
    DepartmentName,
    Salary,
    AVG(Salary) OVER (PARTITION BY DepartmentName) AS DeptAvgSalary,
    Salary - AVG(Salary) OVER (PARTITION BY DepartmentName) AS DifferenceFromAvg
FROM Employees;
```
We will explore Window Functions deeply in the next module, but recognize that they are the modern, superior alternative to many complex correlated subqueries.

### G. Security Context for Programmability
* **GRANT EXECUTE**: You can grant a user the right to execute a stored procedure without granting them `SELECT`, `INSERT`, `UPDATE`, or `DELETE` on the underlying tables.
  ```sql
  GRANT EXECUTE ON sp_InsertCustomer TO [AppUserRole];
  ```
* **Dynamic SQL Risks**: If you construct SQL strings inside your stored procedures and execute them using `EXEC()` or `sp_executesql`, you re-introduce SQL injection risks unless parameterized properly.

### H. Performance Tuning Basics
* **Execution Plans**: Always review the execution plan for complex queries. Look for "Table Scans" or "Index Scans" which indicate missing indexes or non-sargable conditions.
* **SARGable Queries**: Search Argument Able. Avoid using functions on the column side of a `WHERE` clause.
  * *Bad*: `WHERE YEAR(OrderDate) = 2023` (Causes an index scan)
  * *Good*: `WHERE OrderDate >= '2023-01-01' AND OrderDate < '2024-01-01'` (Allows index seek)

### I. Transactions and ACID Properties
Stored procedures are the ideal place to define transaction boundaries to ensure data integrity.

```sql
CREATE PROCEDURE sp_TransferFunds
    @FromAccount INT,
    @ToAccount INT,
    @Amount DECIMAL(18,2)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        UPDATE Accounts SET Balance = Balance - @Amount WHERE AccountID = @FromAccount;
        UPDATE Accounts SET Balance = Balance + @Amount WHERE AccountID = @ToAccount;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        -- Log or re-throw the error
        THROW;
    END CATCH
END;
```

### J. Extended Scenario 1
In this extended scenario, we consider an enterprise architecture involving massive data warehouses. When dealing with billion-row tables, the principles of `JOIN` optimization become critical. For instance, ensuring that foreign key columns are indexed is not just a recommendation; it is a strict requirement to prevent hash joins from spilling into `tempdb`. Furthermore, understanding the difference between a nested loop join, a merge join, and a hash join allows developers to write T-SQL that guides the query optimizer. 
To further elaborate on the usage of `GROUP BY` and `HAVING` in these scenarios, consider a case where we need to aggregate daily telemetry data from IoT devices into monthly summaries. The raw data table might have 500 million rows. A `CROSS JOIN` here would be catastrophic. Instead, we use staging tables, batch processing via Stored Procedures, and incremental aggregation to maintain performance.

### J. Extended Scenario 2
In this extended scenario, we consider an enterprise architecture involving massive data warehouses. When dealing with billion-row tables, the principles of `JOIN` optimization become critical. For instance, ensuring that foreign key columns are indexed is not just a recommendation; it is a strict requirement to prevent hash joins from spilling into `tempdb`. Furthermore, understanding the difference between a nested loop join, a merge join, and a hash join allows developers to write T-SQL that guides the query optimizer. 
To further elaborate on the usage of `GROUP BY` and `HAVING` in these scenarios, consider a case where we need to aggregate daily telemetry data from IoT devices into monthly summaries. The raw data table might have 500 million rows. A `CROSS JOIN` here would be catastrophic. Instead, we use staging tables, batch processing via Stored Procedures, and incremental aggregation to maintain performance.

### J. Extended Scenario 3
In this extended scenario, we consider an enterprise architecture involving massive data warehouses. When dealing with billion-row tables, the principles of `JOIN` optimization become critical. For instance, ensuring that foreign key columns are indexed is not just a recommendation; it is a strict requirement to prevent hash joins from spilling into `tempdb`. Furthermore, understanding the difference between a nested loop join, a merge join, and a hash join allows developers to write T-SQL that guides the query optimizer. 
To further elaborate on the usage of `GROUP BY` and `HAVING` in these scenarios, consider a case where we need to aggregate daily telemetry data from IoT devices into monthly summaries. The raw data table might have 500 million rows. A `CROSS JOIN` here would be catastrophic. Instead, we use staging tables, batch processing via Stored Procedures, and incremental aggregation to maintain performance.

### J. Extended Scenario 4
In this extended scenario, we consider an enterprise architecture involving massive data warehouses. When dealing with billion-row tables, the principles of `JOIN` optimization become critical. For instance, ensuring that foreign key columns are indexed is not just a recommendation; it is a strict requirement to prevent hash joins from spilling into `tempdb`. Furthermore, understanding the difference between a nested loop join, a merge join, and a hash join allows developers to write T-SQL that guides the query optimizer. 
To further elaborate on the usage of `GROUP BY` and `HAVING` in these scenarios, consider a case where we need to aggregate daily telemetry data from IoT devices into monthly summaries. The raw data table might have 500 million rows. A `CROSS JOIN` here would be catastrophic. Instead, we use staging tables, batch processing via Stored Procedures, and incremental aggregation to maintain performance.

### J. Extended Scenario 5
In this extended scenario, we consider an enterprise architecture involving massive data warehouses. When dealing with billion-row tables, the principles of `JOIN` optimization become critical. For instance, ensuring that foreign key columns are indexed is not just a recommendation; it is a strict requirement to prevent hash joins from spilling into `tempdb`. Furthermore, understanding the difference between a nested loop join, a merge join, and a hash join allows developers to write T-SQL that guides the query optimizer. 
To further elaborate on the usage of `GROUP BY` and `HAVING` in these scenarios, consider a case where we need to aggregate daily telemetry data from IoT devices into monthly summaries. The raw data table might have 500 million rows. A `CROSS JOIN` here would be catastrophic. Instead, we use staging tables, batch processing via Stored Procedures, and incremental aggregation to maintain performance.

### J. Extended Scenario 6
In this extended scenario, we consider an enterprise architecture involving massive data warehouses. When dealing with billion-row tables, the principles of `JOIN` optimization become critical. For instance, ensuring that foreign key columns are indexed is not just a recommendation; it is a strict requirement to prevent hash joins from spilling into `tempdb`. Furthermore, understanding the difference between a nested loop join, a merge join, and a hash join allows developers to write T-SQL that guides the query optimizer. 
To further elaborate on the usage of `GROUP BY` and `HAVING` in these scenarios, consider a case where we need to aggregate daily telemetry data from IoT devices into monthly summaries. The raw data table might have 500 million rows. A `CROSS JOIN` here would be catastrophic. Instead, we use staging tables, batch processing via Stored Procedures, and incremental aggregation to maintain performance.

### J. Extended Scenario 7
In this extended scenario, we consider an enterprise architecture involving massive data warehouses. When dealing with billion-row tables, the principles of `JOIN` optimization become critical. For instance, ensuring that foreign key columns are indexed is not just a recommendation; it is a strict requirement to prevent hash joins from spilling into `tempdb`. Furthermore, understanding the difference between a nested loop join, a merge join, and a hash join allows developers to write T-SQL that guides the query optimizer. 
To further elaborate on the usage of `GROUP BY` and `HAVING` in these scenarios, consider a case where we need to aggregate daily telemetry data from IoT devices into monthly summaries. The raw data table might have 500 million rows. A `CROSS JOIN` here would be catastrophic. Instead, we use staging tables, batch processing via Stored Procedures, and incremental aggregation to maintain performance.

### 📚 Extensive Tutorials & Resources
- **GeeksForGeeks:** [SQL Tutorial](https://www.geeksforgeeks.org/sql-tutorial/)
- **FreeCodeCamp:** [Relational Database Certification](https://www.freecodecamp.org/learn/relational-database/)
- **SQLServerTutorial:** [Learn Microsoft SQL Server](https://www.sqlservertutorial.net/)
