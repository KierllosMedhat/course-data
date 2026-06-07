/*
================================================================================
Lab 8.1: Master the Joins
================================================================================
Objective:
Practice multi-table queries using INNER JOIN, LEFT JOIN, and handling NULLs.

Scenario:
You are managing an e-commerce database. We have set up a temporary schema below
with Products, Orders, and OrderDetails tables.

Tasks:
1. Write an INNER JOIN to retrieve all OrderID, OrderDate, ProductName, Quantity,
   and UnitPrice from the Orders, OrderDetails, and Products tables.
2. Write a LEFT JOIN to find all Products that have never been ordered (where 
   OrderDetailID or OrderID is NULL).
3. Write a query using COALESCE to display the ShipRegion from the Orders table.
   If ShipRegion is NULL, display 'N/A'.
================================================================================
*/

-- ================================================================================
-- SETUP: RUN THIS FIRST TO CREATE SAMPLE TABLES AND DATA
-- ================================================================================
IF OBJECT_ID('TempOrderDetails', 'U') IS NOT NULL DROP TABLE TempOrderDetails;
IF OBJECT_ID('TempProducts', 'U') IS NOT NULL DROP TABLE TempProducts;
IF OBJECT_ID('TempOrders', 'U') IS NOT NULL DROP TABLE TempOrders;

CREATE TABLE TempProducts (
    ProductID INT PRIMARY KEY,
    ProductName VARCHAR(100),
    Price DECIMAL(10, 2)
);

CREATE TABLE TempOrders (
    OrderID INT PRIMARY KEY,
    OrderDate DATE,
    ShipRegion VARCHAR(50)
);

CREATE TABLE TempOrderDetails (
    OrderDetailID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT FOREIGN KEY REFERENCES TempOrders(OrderID),
    ProductID INT FOREIGN KEY REFERENCES TempProducts(ProductID),
    Quantity INT,
    UnitPrice DECIMAL(10, 2)
);

INSERT INTO TempProducts VALUES
(1, 'Laptop', 1000.00),
(2, 'Mouse', 25.00),
(3, 'Keyboard', 50.00),
(4, 'Monitor', 250.00),
(5, 'USB Cable', 10.00);

INSERT INTO TempOrders VALUES
(1001, '2023-10-01', 'North America'),
(1002, '2023-10-02', NULL),
(1003, '2023-10-03', 'Europe');

INSERT INTO TempOrderDetails (OrderID, ProductID, Quantity, UnitPrice) VALUES
(1001, 1, 1, 1000.00),
(1001, 2, 2, 25.00),
(1002, 1, 1, 1000.00),
(1002, 3, 1, 50.00),
(1003, 2, 5, 20.00);

-- ================================================================================
-- TODO: TASK 1 - INNER JOIN
-- ================================================================================
-- Write an INNER JOIN to retrieve OrderID, OrderDate (from TempOrders), 
-- ProductName (from TempProducts), Quantity, and UnitPrice (from TempOrderDetails).

-- SELECT ... FROM TempOrders AS o INNER JOIN ... ON ...


-- ================================================================================
-- TODO: TASK 2 - LEFT JOIN (UNORDERED PRODUCTS)
-- ================================================================================
-- Write a LEFT JOIN to find all Products that have NEVER been ordered.
-- Hint: Left join TempProducts with TempOrderDetails on ProductID, 
-- and filter where the Detail ProductID (or OrderDetailID) is NULL.

-- SELECT ... FROM TempProducts AS p LEFT JOIN ... ON ... WHERE ...


-- ================================================================================
-- TODO: TASK 3 - NULL HANDLING (COALESCE / ISNULL)
-- ================================================================================
-- Write a query to select OrderID, OrderDate, and ShipRegion from TempOrders.
-- Use COALESCE (or ISNULL) to display 'N/A' if the ShipRegion is NULL.

-- SELECT ... COALESCE(..., 'N/A') AS ShipRegion FROM TempOrders;
