import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, switchMap, withLatestFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as RecipesActions from './recipe.actions';
import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class RecipeEffects {
  //////////////////////////////
  // Fetch Recipes
  fetchRecipes = createEffect(() =>
    this.actions$.pipe(
      ofType<RecipesActions.FetchRecipes>(RecipesActions.FETCH_RECIPES),
      switchMap(action => {
        return this.http.get<Recipe[]>(
          `https://angular-recipe-book-app-f5a71-default-rtdb.firebaseio.com/${action.payload}.json`
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

  //////////////////////////////
  // Store Recipes
  storeRecipes = createEffect(
    () =>
      this.actions$.pipe(
        ofType<RecipesActions.StoreRecipes>(RecipesActions.STORE_RECIPES), // put in userid as payload
        withLatestFrom(this.store.select('recipes')), // merge a value from another observable into this observable stream
        switchMap(([action, recipesState]) => {
          return this.http.put(
            `https://angular-recipe-book-app-f5a71-default-rtdb.firebaseio.com/${action.payload}.json`,
            recipesState.recipes
          );
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
