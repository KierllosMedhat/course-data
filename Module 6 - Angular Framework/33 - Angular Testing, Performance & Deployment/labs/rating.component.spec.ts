import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { RatingComponent } from './rating.component';

describe('RatingComponent', () => {
  let fixture: ComponentFixture<RatingComponent>;
  let component: RatingComponent;

  beforeEach(async () => {
    // TODO: Configure testing module importing RatingComponent
    await TestBed.configureTestingModule({
      imports: [RatingComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the rating component', () => {
    expect(component).toBeTruthy();
  });

  it('should render exactly 5 star buttons in the DOM by default', () => {
    // TODO: Query the DOM for all button elements inside the component
    const buttons = fixture.nativeElement.querySelectorAll('.star-button');
    
    // Assert there are 5 stars
    expect(buttons.length).toBe(5);
  });

  it('should apply the "filled" class to exactly 3 stars when currentRating is input as 3', () => {
    // TODO: Set input "currentRating" to 3 using fixture.componentRef.setInput()
    fixture.componentRef.setInput('currentRating', 3);
    
    // CRITICAL: Trigger change detection so the template updates
    fixture.detectChanges();

    // TODO: Query each star element (star-1, star-2, star-3, star-4, star-5)
    // Check that star-1, star-2, and star-3 have the 'filled' class
    // and star-4, star-5 do not.
    const star1 = fixture.nativeElement.querySelector('[data-testid="star-1"]');
    const star2 = fixture.nativeElement.querySelector('[data-testid="star-2"]');
    const star3 = fixture.nativeElement.querySelector('[data-testid="star-3"]');
    const star4 = fixture.nativeElement.querySelector('[data-testid="star-4"]');
    const star5 = fixture.nativeElement.querySelector('[data-testid="star-5"]');

    expect(star1.classList.contains('filled')).toBe(true);
    expect(star2.classList.contains('filled')).toBe(true);
    expect(star3.classList.contains('filled')).toBe(true);
    expect(star4.classList.contains('filled')).toBe(false);
    expect(star5.classList.contains('filled')).toBe(false);
  });

  it('should emit the correct rating number on the ratingChange output when a star is clicked', () => {
    // TODO: Set up a listener subscription to component.ratingChange
    let emittedRating: number | undefined;
    component.ratingChange.subscribe((val) => {
      emittedRating = val;
    });

    // TODO: Click on the 4th star button
    const star4 = fixture.nativeElement.querySelector('[data-testid="star-4"]');
    star4.click();

    // Assert that the emitted value matches the clicked star index
    expect(emittedRating).toBe(4);
  });
});
