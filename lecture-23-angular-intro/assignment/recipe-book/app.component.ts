import { Component } from '@angular/core';
// import { RecipeListComponent } from './recipe-list/recipe-list.component';
// import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [/* TODO: Import RecipeListComponent and RecipeDetailComponent */],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">Recipe Book</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-1 border-r pr-4">
          <!-- TODO: Use <app-recipe-list> and bind recipes array to it -->
          <!-- Handle selection event to set selectedRecipe -->
        </div>
        
        <div class="md:col-span-2">
          <!-- TODO: Use @if to show <app-recipe-detail> if selectedRecipe exists -->
          <!-- Pass selectedRecipe as an input -->
        </div>
      </div>
    </div>
  `
})
export class AppComponent {
  // TODO: Create a 'recipes' array with dummy data (id, name, description)
  // recipes = [ ... ];
  
  // TODO: Create a 'selectedRecipe' property (initially null)
  // selectedRecipe = null;
  
  // TODO: Create a method to handle recipe selection
}
