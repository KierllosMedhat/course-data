import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent {
  // TODO: Define the component contract with Signal input and output emitter
  currentRating = input<number>(0);
  ratingChange = output<number>();

  rate(stars: number): void {
    // TODO: Emit the star rating selection
    this.ratingChange.emit(stars);
  }
}
