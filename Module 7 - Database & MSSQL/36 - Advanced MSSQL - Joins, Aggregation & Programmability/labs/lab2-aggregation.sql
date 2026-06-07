/*
================================================================================
Lab 8.2: Aggregation Analytics
================================================================================
Objective:
Practice summarizing data using GROUP BY and filtering group results using HAVING.

Scenario:
The CEO wants a sales report based on employee performance. We have set up a 
temporary schema with Employees, Orders, and OrderDetails tables.

Tasks:
1. Write a query to find the total sales amount (defined as SUM(UnitPrice * Quantity))
   grouped by EmployeeID.
2. Modify the query to only show Employees whose total sales exceed $50,000.
   Use the HAVING clause.
3. Add a JOIN to the Employees table to display the employee's First and Last Name 
   instead of just their EmployeeID.
================================================================================
*/

-- ================================================================================
-- SETUP: RUN THIS FIRST TO CREATE SAMPLE TABLES AND DATA
-- ================================================================================
IF OBJECT_ID('TempOrderDetails_Sales', 'U') IS NOT NULL DROP TABLE TempOrderDetails_Sales;
IF OBJECT_ID('TempOrders_Sales', 'U') IS NOT NULL DROP TABLE TempOrders_Sales;
IF OBJECT_ID('TempEmployees_Sales', 'U') IS NOT NULL DROP TABLE TempEmployees_Sales;

CREATE TABLE TempEmployees_Sales (
    EmployeeID INT PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50)
);

CREATE TABLE TempOrders_Sales (
    OrderID INT PRIMARY KEY,
    EmployeeID INT FOREIGN KEY REFERENCES TempEmployees_Sales(EmployeeID)
);

CREATE TABLE TempOrderDetails_Sales (
    OrderDetailID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT FOREIGN KEY REFERENCES TempOrders_Sales(OrderID),
    Quantity INT,
    UnitPrice DECIMAL(10, 2)
);

INSERT INTO TempEmployees_Sales VALUES
(1, 'Alice', 'Smith'),
(2, 'Bob', 'Jones'),
(3, 'Charlie', 'Brown');

INSERT INTO TempOrders_Sales VALUES
(100, 1), (101, 1), (102, 1),
(200, 2), (201, 2),
(300, 3);

INSERT INTO TempOrderDetails_Sales (OrderID, Quantity, UnitPrice) VALUES
-- Alice's sales (EmployeeID = 1) -> Total: 20000 + 40000 + 5000 = 65000
(100, 10, 2000.00),
(101, 20, 2000.00),
(102, 5, 1000.00),
-- Bob's sales (EmployeeID = 2) -> Total: 35000 + 10000 = 45000
(200, 35, 1000.00),
(201, 10, 1000.00),
-- Charlie's sales (EmployeeID = 3) -> Total: 12000
(300, 12, 1000.00);

-- ================================================================================
-- TODO: TASK 1 - SUM GROUPED BY EMPLOYEE ID
-- ================================================================================
-- Write a query to find the total sales amount (SUM(UnitPrice * Quantity))
-- from TempOrderDetails_Sales, joined with TempOrders_Sales, grouped by EmployeeID.

-- SELECT ... FROM TempOrderDetails_Sales AS od JOIN ... GROUP BY ...


-- ================================================================================
-- TODO: TASK 2 - HAVING CLAUSE FILTERING (> 50,000)
-- ================================================================================
-- Modify the query from Task 1 to only show Employees whose total sales exceed $50,000.
-- Hint: Use HAVING SUM(UnitPrice * Quantity) > 50000.

-- SELECT ... FROM ... GROUP BY ... HAVING ...


-- ================================================================================
-- TODO: TASK 3 - JOIN WITH EMPLOYEES TO DISPLAY NAME
-- ================================================================================
-- Modify the query from Task 2 to include a JOIN to TempEmployees_Sales, and display 
-- the employee's FirstName and LastName (or concatenate them) instead of just the ID.
-- Note: Remember to add the employee names to the GROUP BY clause!

-- SELECT ... FROM ... JOIN ... GROUP BY ... HAVING ...
