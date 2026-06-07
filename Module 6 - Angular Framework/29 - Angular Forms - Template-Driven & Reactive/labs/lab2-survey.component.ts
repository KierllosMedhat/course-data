import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-lab2-survey',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lab2-survey.component.html',
  styleUrls: ['./lab2-survey.component.css']
})
export class Lab2SurveyComponent implements OnInit, OnDestroy {
  surveyForm!: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    // TODO: Initialize surveyForm with:
    // - title: string, required
    // - questions: empty FormArray
    this.surveyForm = this.fb.group({
      title: ['', Validators.required],
      questions: this.fb.array([])
    });
  }

  // Getter for convenience
  get questions(): FormArray {
    return this.surveyForm.get('questions') as FormArray;
  }

  // TODO: Implement adding a question FormGroup to the FormArray
  addQuestion(): void {
    const questionGroup = this.fb.group({
      questionText: ['', Validators.required],
      answerType: ['Text', Validators.required],
      isRequired: [false]
    });

    // TODO: Subscribe to valueChanges of 'answerType' control inside this questionGroup
    // If the answerType is 'Number', dynamically add a 'maxValue' control with integer validation.
    // If the answerType is anything else, remove the 'maxValue' control.
    // Make sure to manage subscription lifecycle using takeUntil(this.destroy$).
    questionGroup.get('answerType')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (value === 'Number') {
          // TODO: Add 'maxValue' control
        } else {
          // TODO: Remove 'maxValue' control if it exists
        }
      });

    this.questions.push(questionGroup);
  }

  // TODO: Implement removing a question FormGroup by index
  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  onSubmit(): void {
    if (this.surveyForm.valid) {
      console.log('Survey Submitted Data:', this.surveyForm.value);
    } else {
      this.surveyForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
