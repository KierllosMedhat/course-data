import { Component, OnInit, ViewChild, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DeleteConfirmDialogComponent } from './delete-confirm-dialog.component';

export interface ProductItem {
  id: number;
  name: string;
  price: number;
  category: string;
}

const INITIAL_PRODUCTS: ProductItem[] = [
  { id: 101, name: 'MacBook Pro M3', price: 1999, category: 'Computers' },
  { id: 102, name: 'iPhone 15 Pro Max', price: 1199, category: 'Phones' },
  { id: 103, name: 'iPad Pro 12.9"', price: 1099, category: 'Tablets' },
  { id: 104, name: 'Apple Watch Ultra 2', price: 799, category: 'Wearables' },
  { id: 105, name: 'AirPods Max', price: 549, category: 'Audio' }
];

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'price', 'category', 'actions'];
  dataSource = new MatTableDataSource<ProductItem>(INITIAL_PRODUCTS);

  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  // TODO: Implement the deleteProduct action
  // 1. Open the DeleteConfirmDialogComponent using MatDialog
  // 2. Pass the product name as dialog data
  // 3. Listen to the dialog afterClosed() event
  // 4. If confirmed:
  //    - Filter the product out of the data source array
  //    - Reassign the updated array to this.dataSource.data
  //    - Display a MatSnackBar confirming success (duration 3000ms)
  openDeleteDialog(product: ProductItem): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '400px',
      data: { productName: product.name }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        // TODO: Perform filter/removal
        const updatedData = this.dataSource.data.filter(p => p.id !== product.id);
        this.dataSource.data = updatedData;

        // TODO: Show success snackbar message
        this.snackBar.open(`Deleted "${product.name}" successfully!`, 'Dismiss', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    });
  }
}
