import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const MOCK_USERS: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User' },
  { id: 3, name: 'Carol Williams', email: 'carol@example.com', role: 'User' },
  { id: 4, name: 'David Brown', email: 'david@example.com', role: 'Manager' },
  { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'User' },
  { id: 6, name: 'Frank Miller', email: 'frank@example.com', role: 'User' },
  { id: 7, name: 'Grace Wilson', email: 'grace@example.com', role: 'Manager' },
  { id: 8, name: 'Henry Moore', email: 'henry@example.com', role: 'User' },
  { id: 9, name: 'Ivy Taylor', email: 'ivy@example.com', role: 'User' },
  { id: 10, name: 'Jack Anderson', email: 'jack@example.com', role: 'Admin' },
  { id: 11, name: 'Kelly Thomas', email: 'kelly@example.com', role: 'User' },
  { id: 12, name: 'Leo Jackson', email: 'leo@example.com', role: 'User' },
  { id: 13, name: 'Mia White', email: 'mia@example.com', role: 'Manager' },
  { id: 14, name: 'Nathan Harris', email: 'nathan@example.com', role: 'User' },
  { id: 15, name: 'Olivia Martin', email: 'olivia@example.com', role: 'User' }
];

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent implements AfterViewInit {
  // TODO: Define the columns to be displayed in order
  displayedColumns: string[] = ['id', 'name', 'email', 'role'];

  // TODO: Initialize the MatTableDataSource with MOCK_USERS
  dataSource = new MatTableDataSource<User>(MOCK_USERS);

  // TODO: Query the template for MatSort and MatPaginator using @ViewChild
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    // TODO: Connect the sort and paginator to the dataSource
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  // TODO: Implement the applyFilter method to filter the table data dynamically
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
