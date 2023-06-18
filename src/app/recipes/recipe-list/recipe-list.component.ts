import { Component, Output, EventEmitter } from '@angular/core';

import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent {
  @Output() recipeWasSelected = new EventEmitter<Recipe>();

  recipes: Recipe[] = [
    new Recipe(
      'Matcha Green Tea Cake',
      'A delicious matcha green tea cake!',
      'https://cf.foodista.com/content/fp/7cafpt65esowsd3f.jpg'
    ),
    new Recipe(
      'Another Matcha Green Tea Cake',
      'Yet another delicious matcha green tea cake!',
      'https://cf.foodista.com/content/fp/7cafpt65esowsd3f.jpg'
    ),
  ];

  onRecipeSelected(recipe: Recipe) {
    this.recipeWasSelected.emit(recipe);
  }
}
