/*
================================================================================
Lab 8.1: ERD Design & Database Implementation for a University System
================================================================================
Objective:
In this lab, you will translate a conceptual Entity-Relationship Diagram (ERD) 
into a physical SQL Server database schema. 

Before starting, you should have sketched or designed your ERD. The entities are:
1. Student (1:N with Enrollment, M:N with Course)
2. Professor (1:N with Course, 1:N with Department)
3. Course (1:N with Enrollment, M:N with Student)
4. Department (1:N with Course/Professor/Student)
5. Classroom (1:N with Course/Class)
6. Enrollment (Join table between Student and Course)

Tasks:
1. Complete the CREATE TABLE statements below. Ensure you define:
   - Primary Keys (PK)
   - Foreign Keys (FK) with appropriate constraints
   - At least 3 attributes per table (e.g., Name, Email, Capacity, etc.)
   - Appropriate data types (INT, VARCHAR, NVARCHAR, DATE, etc.)
2. Insert sample data into all tables.
3. Write queries to verify your design (indicated in the TODO sections at the end).
================================================================================
*/

-- Create Database (Optional, run if you want a clean test database)
-- CREATE DATABASE UniversityDB;
-- GO
-- USE UniversityDB;
-- GO

-- 1. TODO: Create the Departments Table
-- Should contain at least DepartmentID (PK), DepartmentName, and OfficeLocation.
CREATE TABLE Departments (
    DepartmentID INT IDENTITY(1,1),
    DepartmentName NVARCHAR(100) NOT NULL,
    OfficeLocation NVARCHAR(100) NULL,
    -- TODO: Add Primary Key constraint (inline or table-level)
);

-- 2. TODO: Create the Classrooms Table
-- Should contain ClassroomID (PK), RoomNumber, and Capacity.
CREATE TABLE Classrooms (
    ClassroomID INT IDENTITY(1,1),
    -- TODO: Define RoomNumber (e.g. Room 101, Auditorium A)
    -- TODO: Define Capacity (e.g. 30, 120)
    -- TODO: Add Primary Key constraint
);

-- 3. TODO: Create the Professors Table
-- Should contain ProfessorID (PK), FirstName, LastName, Email, and DepartmentID (FK).
CREATE TABLE Professors (
    ProfessorID INT IDENTITY(1,1),
    -- TODO: Define FirstName and LastName
    -- TODO: Define Email
    -- TODO: Define DepartmentID as an INT
    -- TODO: Add Primary Key constraint
    -- TODO: Add Foreign Key constraint referencing Departments(DepartmentID)
);

-- 4. TODO: Create the Students Table
-- Should contain StudentID (PK), FirstName, LastName, Email, EnrollmentDate, and DepartmentID (FK - Major).
CREATE TABLE Students (
    StudentID INT IDENTITY(1,1),
    -- TODO: Define FirstName and LastName
    -- TODO: Define Email
    -- TODO: Define EnrollmentDate (DATE type)
    -- TODO: Define DepartmentID (FK for their major department)
    -- TODO: Add Primary Key constraint
    -- TODO: Add Foreign Key constraint referencing Departments(DepartmentID)
);

-- 5. TODO: Create the Courses Table
-- Should contain CourseID (PK), CourseCode, CourseName, Credits, ProfessorID (FK), and ClassroomID (FK).
CREATE TABLE Courses (
    CourseID INT IDENTITY(1,1),
    -- TODO: Define CourseCode (e.g. CS101, MATH201)
    -- TODO: Define CourseName
    -- TODO: Define Credits (INT)
    -- TODO: Define ProfessorID (FK)
    -- TODO: Define ClassroomID (FK)
    -- TODO: Add Primary Key constraint
    -- TODO: Add Foreign Key referencing Professors(ProfessorID)
    -- TODO: Add Foreign Key referencing Classrooms(ClassroomID)
);

-- 6. TODO: Create the Enrollments Join Table (M:N Relationship between Student and Course)
-- Should contain EnrollmentID (PK) or a Composite PK (StudentID, CourseID), StudentID (FK), CourseID (FK), and Grade.
CREATE TABLE Enrollments (
    EnrollmentID INT IDENTITY(1,1),
    -- TODO: Define StudentID (FK)
    -- TODO: Define CourseID (FK)
    -- TODO: Define Grade (VARCHAR or DECIMAL, e.g., 'A', 95.5)
    -- TODO: Add Primary Key constraint
    -- TODO: Add Foreign Key referencing Students(StudentID)
    -- TODO: Add Foreign Key referencing Courses(CourseID)
);

-- ================================================================================
-- SAMPLE DATA INSERTION (Once tables are created, uncomment and run or write your own)
-- ================================================================================
/*
-- Insert Departments
INSERT INTO Departments (DepartmentName, OfficeLocation) VALUES 
('Computer Science', 'Turing Hall, 3rd Floor'),
('Mathematics', 'Euler Building, 1st Floor'),
('Physics', 'Newton Lab, Ground Floor');

-- Insert Classrooms
INSERT INTO Classrooms (RoomNumber, Capacity) VALUES
('Room 101', 30),
('Auditorium A', 120),
('Lab 204', 25);

-- Insert Professors
-- (TODO: Insert at least 3 professors matching the departments above)

-- Insert Students
-- (TODO: Insert at least 5 students matching the departments/majors above)

-- Insert Courses
-- (TODO: Insert at least 4 courses)

-- Insert Enrollments
-- (TODO: Enroll students in various courses)
*/

-- ================================================================================
-- TODO: WRITE THE FOLLOWING VERIFICATION QUERIES
-- ================================================================================

-- Query 1: Retrieve all students with their chosen Major (Department Name).
-- TODO: Write your query here

-- Query 2: Retrieve all courses, showing the course name, professor's last name, and classroom room number.
-- TODO: Write your query here

-- Query 3: Retrieve all students enrolled in a specific course (e.g., 'Introduction to Computer Science').
-- TODO: Write your query here
