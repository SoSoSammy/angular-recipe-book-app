import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';

import * as RecipesActions from './recipe.actions';
import { Recipe } from '../recipe.model';

@Injectable()
export class RecipeEffects {
  //////////////////////////////
  // Fetch Recipes
  fetchRecipes = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipesActions.FETCH_RECIPES),
      switchMap(() => {
        return this.http.get<Recipe[]>(
          'https://angular-recipe-book-app-f5a71-default-rtdb.firebaseio.com/recipes.json'
        );
      }),
      // Only continue execution if recipes exists
      filter(recipes => recipes != undefined),
      map(recipes => {
        // If the recipe has no ingredients, set ingredients to an empty array
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      // Dispatch set recipes action
      map(recipes => new RecipesActions.SetRecipes(recipes))
    )
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
