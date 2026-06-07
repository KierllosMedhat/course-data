/*
================================================================================
Lab 8.3: Procedure Creation
================================================================================
Objective:
Encapsulate write operations and business validation logic inside a reusable, 
secure Stored Procedure.

Scenario:
The application needs a secure way to insert new customers. We have set up a 
temporary Customers table below.

Tasks:
1. Create a stored procedure named `sp_InsertCustomer` that accepts three inputs:
   - `@CompanyName` (VARCHAR(100))
   - `@ContactName` (VARCHAR(100))
   - `@City` (VARCHAR(50))
2. Inside the procedure, implement validation:
   - Check if a customer with that `@CompanyName` already exists.
   - If they exist, raise an error using the `THROW` statement.
   - If they do not exist, `INSERT` the new customer record and use `SCOPE_IDENTITY()` 
     to retrieve and SELECT the newly generated `CustomerID`.
3. Test your procedure under both conditions:
   - Inserting a new company.
   - Attempting to insert a company that already exists.
================================================================================
*/

-- ================================================================================
-- SETUP: RUN THIS FIRST TO CREATE TEMPORARY CUSTOMERS TABLE
-- ================================================================================
IF OBJECT_ID('TempCustomers', 'U') IS NOT NULL DROP TABLE TempCustomers;

CREATE TABLE TempCustomers (
    CustomerID INT IDENTITY(1,1) PRIMARY KEY,
    CompanyName VARCHAR(100) NOT NULL UNIQUE,
    ContactName VARCHAR(100),
    City VARCHAR(50)
);

INSERT INTO TempCustomers (CompanyName, ContactName, City) VALUES
('Acme Corp', 'John Doe', 'New York'),
('Globex Corp', 'Hank Scorpio', 'Cypress Creek');
GO

-- ================================================================================
-- TODO: TASK 1 & 2 - CREATE THE STORED PROCEDURE
-- ================================================================================
-- Write the CREATE PROCEDURE script here.
-- Hint: 
-- 1. Check existence with EXISTS: IF EXISTS(SELECT 1 FROM TempCustomers WHERE CompanyName = @CompanyName)
-- 2. Use THROW 50000, 'Company already exists.', 1; to throw an error.
-- 3. Run SELECT SCOPE_IDENTITY() AS NewCustomerID; after INSERT.

-- CREATE PROCEDURE sp_InsertCustomer
-- ...
-- GO


-- ================================================================================
-- TODO: TASK 3 - TEST THE STORED PROCEDURE
-- ================================================================================

-- Test 1: Insert a new company (Should succeed and return a new CustomerID)
-- EXEC sp_InsertCustomer @CompanyName = 'Initech', @ContactName = 'Peter Gibbons', @City = 'Austin';

-- Test 2: Insert a duplicate company (Should throw an error and fail to insert)
-- EXEC sp_InsertCustomer @CompanyName = 'Acme Corp', @ContactName = 'Jane Smith', @City = 'Boston';

-- Check the final table state
-- SELECT * FROM TempCustomers;
