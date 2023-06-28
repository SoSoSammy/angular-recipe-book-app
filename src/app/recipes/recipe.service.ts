import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'Matcha Green Tea Cake',
  //     'A delicious matcha green tea cake!',
  //     'https://cf.foodista.com/content/fp/7cafpt65esowsd3f.jpg',
  //     [
  //       new Ingredient('Eggs', 2),
  //       new Ingredient('All-purpose flour', '3/4 cup'),
  //       new Ingredient('Matcha green tea powder', '1 1/2 tbsp'),
  //       new Ingredient('Raspberries', '1/2 cup'),
  //     ]
  //   ),
  //   new Recipe(
  //     'Sourdough Bread',
  //     'Easy to make sourdough bread!',
  //     'https://th.bing.com/th/id/OIP.1GvKGEtfYmOpxwi-zj_vpQHaE6?pid=ImgDet&rs=1',
  //     [
  //       new Ingredient('Whole-wheat flour', '6 cups'),
  //       new Ingredient('Sourdough starter', '1/4 cup'),
  //       new Ingredient('Salt', '1 tsp'),
  //     ]
  //   ),
  // ];
  private recipes: Recipe[] = [];

  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<fromShoppingList.AppState>
  ) {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice(); // return a copy of the array
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    // this.shoppingListService.addIngredients(ingredients);
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
