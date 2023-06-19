import { EventEmitter } from '@angular/core';

import { Recipe } from './recipe.model';

export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
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

  getRecipes() {
    return this.recipes.slice(); // return a copy of the array
  }
}
