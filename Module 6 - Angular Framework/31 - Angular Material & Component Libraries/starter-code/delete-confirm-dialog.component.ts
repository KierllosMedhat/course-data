import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface DeleteConfirmData {
  productName: string;
}

@Component({
  selector: 'app-delete-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Delete Product</h2>
    
    <mat-dialog-content>
      <p>Are you sure you want to delete <strong>{{ data.productName }}</strong>? This action cannot be undone.</p>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <!-- TODO: Bind mat-dialog-close to return false when cancelled -->
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      
      <!-- TODO: Bind mat-dialog-close to return true when confirmed -->
      <button mat-raised-button color="warn" [mat-dialog-close]="true">Confirm Delete</button>
    </mat-dialog-actions>
  `
})
export class DeleteConfirmDialogComponent {
  dialogRef = inject(MatDialogRef<DeleteConfirmDialogComponent>);
  data = inject<DeleteConfirmData>(MAT_DIALOG_DATA);
}
