/*
================================================================================
Lab 2: Database and Schema Creation
================================================================================
Objective:
In this lab, you will write DDL (Data Definition Language) commands to create 
a new SQL Server database and define a database table schema.

Tasks:
1. Write a script to create a database named `ECommerceDB`.
2. Write a script to create a `Products` table with the following columns:
   - ProductID: Primary Key, automatically incremented (IDENTITY).
   - ProductName: Unicode string up to 100 characters, cannot be NULL.
   - Price: Decimal type with precision for currency (e.g., DECIMAL(10, 2)), cannot be NULL.
   - StockQuantity: Integer, cannot be NULL.
   - Category: Unicode string up to 50 characters, nullable.

Verify:
Run the queries and check that ECommerceDB exists and that the Products table is 
successfully created.
================================================================================
*/

-- TODO: Write the CREATE DATABASE script here
-- Hint: CREATE DATABASE ECommerceDB;


-- TODO: Write the batch separator (GO) and select the database
-- Hint: 
-- GO
-- USE ECommerceDB;
-- GO


-- TODO: Write the CREATE TABLE script for 'Products' here
-- CREATE TABLE Products (
--     -- Define ProductID (PK, Identity)
--     -- Define ProductName (NVARCHAR)
--     -- Define Price (DECIMAL)
--     -- Define StockQuantity (INT)
--     -- Define Category (NVARCHAR)
-- );
