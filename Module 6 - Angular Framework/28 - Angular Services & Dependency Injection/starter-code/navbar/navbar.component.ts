import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../cart.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  private cartService = inject(CartService);

  // TODO: Read totalItemCount$ from CartService using toSignal()
  // totalItems = toSignal(this.cartService.totalItemCount$, { initialValue: 0 });
}
