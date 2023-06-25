import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    // Override all existing recipes
    this.http
      .put(
        'https://angular-recipe-book-app-f5a71-default-rtdb.firebaseio.com/recipes.json',
        recipes
      )
      .subscribe(response => console.log(response));
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(
        'https://angular-recipe-book-app-f5a71-default-rtdb.firebaseio.com/recipes.json'
      )
      .pipe(
        map(recipes => {
          // If the recipe has no ingredients, set ingredients to an empty array
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        }),
        // Execute code without altering data in observable
        tap(recipes => this.recipeService.setRecipes(recipes))
      );
  }
}
