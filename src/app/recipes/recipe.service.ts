import { Injectable } from '@angular/core';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe(
      'Matcha Green Tea Cake',
      'A delicious matcha green tea cake!',
      'https://cf.foodista.com/content/fp/7cafpt65esowsd3f.jpg',
      [
        new Ingredient('Eggs', 2),
        new Ingredient('All-purpose flour', '3/4 cup'),
        new Ingredient('Matcha green tea powder', '1 1/2 tablespoons'),
        new Ingredient('Raspberries', '1/2 cup'),
      ]
    ),
    new Recipe(
      'Sourdough Bread',
      'Easy to make sourdough bread!',
      'https://th.bing.com/th/id/OIP.1GvKGEtfYmOpxwi-zj_vpQHaE6?pid=ImgDet&rs=1',
      [
        new Ingredient('Whole-wheat flour', '6 cups'),
        new Ingredient('Sourdough starter', '1/4 cup'),
        new Ingredient('Salt', '1 tsp'),
      ]
    ),
  ];

  constructor(private shoppingListService: ShoppingListService) {}

  getRecipe(index: number) {
    return this.recipes[index];
  }

  getRecipes() {
    return this.recipes.slice(); // return a copy of the array
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }
}
