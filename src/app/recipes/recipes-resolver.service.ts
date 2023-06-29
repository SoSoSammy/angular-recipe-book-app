import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { map, of, switchMap, take } from 'rxjs';

import { Recipe } from './recipe.model';
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // the resolver automatically subscribes for us
    return this.store.select('recipes').pipe(
      take(1),
      map(recipesState => {
        return recipesState.recipes;
      }),
      switchMap(recipes => {
        // If there are no recipes, fetch them
        if (recipes.length === 0) {
          this.store.dispatch(new RecipeActions.FetchRecipes(this.getUserId()));
          return this.actions$.pipe(ofType(RecipeActions.SET_RECIPES), take(1));
        }
        // If we already have recipes, return them
        else {
          return of(recipes);
        }
      })
    );
  }

  private getUserId() {
    let userId: string;
    this.store
      .select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(user => (userId = user.id))
      .unsubscribe();
    console.log(userId);
    return userId;
  }
}
