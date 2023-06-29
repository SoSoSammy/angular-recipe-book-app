import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { take } from 'rxjs';

import { Recipe } from './recipe.model';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private dataStorageService: DataStorageService,
    private recipeService: RecipeService,
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const recipes = this.recipeService.getRecipes();

    // When there are no recipes, fetch them
    if (recipes.length === 0) {
      // the resolver automatically subscribes for us
      // return this.dataStorageService.fetchRecipes();
      this.store.dispatch(new RecipeActions.FetchRecipes());
      return this.actions$.pipe(ofType(RecipeActions.SET_RECIPES), take(1));
    } else return recipes;
  }
}
