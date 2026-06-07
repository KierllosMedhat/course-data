/*
================================================================================
Lab 8.2: Normalization Exercise
================================================================================
Objective:
Convert a single, flat, unnormalized "spreadsheet" table into 3rd Normal Form (3NF).

Legacy Schema:
LegacyReport (
    ProjectName, 
    ProjectManager, 
    ManagerPhone, 
    EmployeeID, 
    EmployeeName, 
    Role, 
    HourlyRate, 
    HoursWorked
)

We have provided a script that creates a temporary staging table populated with 
this legacy unnormalized data.

Your Tasks:
1. Analyze the functional dependencies:
   - What determines ManagerPhone? (ProjectManager)
   - What determines EmployeeName? (EmployeeID)
   - What determines HourlyRate and HoursWorked? (ProjectName + EmployeeID)
2. Design and create the 3NF tables:
   - A Managers table (ManagerID PK, ManagerName, ManagerPhone)
   - A Projects table (ProjectID PK, ProjectName, ManagerID FK)
   - An Employees table (EmployeeID PK, EmployeeName)
   - A ProjectAssignments table (ProjectID FK, EmployeeID FK, Role, HourlyRate, HoursWorked)
3. Write SQL INSERT queries to migrate data from the unnormalized `TempLegacyReport` 
   table to your new 3NF tables.
4. Verify your normalization design by querying the new 3NF tables to rebuild the 
   original report structure.
================================================================================
*/

-- ================================================================================
-- SETUP: RUN THIS FIRST TO CREATE STAGING DATA
-- ================================================================================
IF OBJECT_ID('TempLegacyReport', 'U') IS NOT NULL DROP TABLE TempLegacyReport;

CREATE TABLE TempLegacyReport (
    ProjectName VARCHAR(100),
    ProjectManager VARCHAR(100),
    ManagerPhone VARCHAR(20),
    EmployeeID INT,
    EmployeeName VARCHAR(100),
    Role VARCHAR(50),
    HourlyRate DECIMAL(10, 2),
    HoursWorked DECIMAL(10, 2)
);

INSERT INTO TempLegacyReport VALUES
('Apollo Project', 'Sarah Jenkins', '555-0199', 101, 'John Doe', 'Lead Developer', 75.00, 40.00),
('Apollo Project', 'Sarah Jenkins', '555-0199', 102, 'Jane Smith', 'UX Designer', 60.00, 20.00),
('Zeus Platform', 'Mark Davis', '555-0244', 101, 'John Doe', 'Senior Developer', 80.00, 15.00),
('Zeus Platform', 'Mark Davis', '555-0244', 103, 'Bob Johnson', 'QA Engineer', 45.00, 35.00),
('Athena App', 'Sarah Jenkins', '555-0199', 102, 'Jane Smith', 'UX Consultant', 65.00, 10.00);

SELECT * FROM TempLegacyReport;

-- ================================================================================
-- TODO: TASK 1 - CREATE THE 3NF TABLES
-- ================================================================================

-- Hint: Create Managers first, then Projects, then Employees, then ProjectAssignments (Join Table)

-- 1. TODO: Create Managers Table (ManagerID PK Identity, ManagerName, ManagerPhone)
-- CREATE TABLE Managers ( ... )

-- 2. TODO: Create Projects Table (ProjectID PK Identity, ProjectName, ManagerID FK)
-- CREATE TABLE Projects ( ... )

-- 3. TODO: Create Employees Table (EmployeeID PK, EmployeeName)
-- Note: EmployeeID from the legacy report can be used directly as the PK (no Identity needed).
-- CREATE TABLE Employees ( ... )

-- 4. TODO: Create ProjectAssignments Table (ProjectID FK, EmployeeID FK, Role, HourlyRate, HoursWorked)
-- The primary key here should be a composite key of (ProjectID, EmployeeID).
-- CREATE TABLE ProjectAssignments ( ... )


-- ================================================================================
-- TODO: TASK 2 - MIGRATE DATA FROM TempLegacyReport TO 3NF TABLES
-- ================================================================================

-- 1. TODO: Migrate unique managers from TempLegacyReport to Managers
-- Hint: Use INSERT INTO ... SELECT DISTINCT
-- INSERT INTO Managers (ManagerName, ManagerPhone) 
-- SELECT DISTINCT ProjectManager, ManagerPhone FROM TempLegacyReport;

-- 2. TODO: Migrate unique projects to Projects table
-- Hint: You need to associate the correct ManagerID by joining TempLegacyReport with your new Managers table.

-- 3. TODO: Migrate unique employees to Employees table

-- 4. TODO: Migrate project assignments, roles, hourly rates, and hours worked to ProjectAssignments table.
-- Hint: You will need to join TempLegacyReport with the new Projects table to map ProjectName to ProjectID.


-- ================================================================================
-- TODO: TASK 3 - VERIFY & QUERIES
-- ================================================================================

-- 1. TODO: Write a SELECT query with JOINs that combines your four 3NF tables to 
--    produce the exact output format of TempLegacyReport.

-- 2. TODO: Write a query that shows total hours worked on each project.

-- 3. TODO: Write a query that lists each employee, the projects they are assigned to, and their total earnings on each project (HoursWorked * HourlyRate).
