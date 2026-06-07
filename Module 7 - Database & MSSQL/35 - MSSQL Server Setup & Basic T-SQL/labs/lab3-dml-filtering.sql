/*
================================================================================
Lab 3: Data Manipulation and Filtering
================================================================================
Objective:
In this lab, you will write DML (Data Manipulation Language) commands to populate,
modify, and retrieve filtered records from your `Products` table.

Prerequisite:
You should have successfully created the `ECommerceDB` database and `Products` table 
from Lab 2.

Tasks:
1. Insert at least 5 different products into your `Products` table (ensure they have 
   different prices, stock levels, and categories - including 'Electronics').
2. Write a `SELECT` query to find all products where the `Price` is greater than 50.
3. Write an `UPDATE` query to reduce the `StockQuantity` of a specific product by 1.
4. Write a `SELECT` query using the `LIKE` operator to find all products belonging 
   to a category that contains the word 'Electronics'.
================================================================================
*/

USE ECommerceDB;
GO

-- ================================================================================
-- TODO: TASK 1 - INSERT DATA
-- ================================================================================
-- Write an INSERT query to add at least 5 distinct products to the Products table.
-- Include some electronic items (e.g. 'Smartphone', 'Headphones') and some other categories.
-- Insert sample values for ProductName, Price, StockQuantity, and Category.

-- INSERT INTO Products (ProductName, Price, StockQuantity, Category) VALUES ...


-- ================================================================================
-- TODO: TASK 2 - SELECT WITH FILTERING (> 50)
-- ================================================================================
-- Write a SELECT query to retrieve all columns for products priced above 50.00.

-- SELECT ... FROM Products WHERE ...


-- ================================================================================
-- TODO: TASK 3 - UPDATE STOCK
-- ================================================================================
-- Write an UPDATE query to decrement StockQuantity by 1 for a specific product.
-- Hint: Remember to target a specific ProductID in the WHERE clause!

-- UPDATE Products SET ... WHERE ...


-- ================================================================================
-- TODO: TASK 4 - SELECT WITH LIKE OPERATOR
-- ================================================================================
-- Write a SELECT query that searches for products under any category containing 'Electronics'.
-- Hint: Use '%Electronics%' with the LIKE operator.

-- SELECT ... FROM Products WHERE Category LIKE ...
