import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, filter } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();

    // Get unique user id to put in URL for database
    const userId = this.getUserId();

    // Override all existing recipes
    this.http
      .put(
        `https://angular-recipe-book-app-f5a71-default-rtdb.firebaseio.com/${userId}.json`,
        recipes
      )
      .subscribe(response => console.log(response));
  }

  fetchRecipes() {
    // Get unique user id to put in URL for database
    const userId = this.getUserId();

    return this.http
      .get<Recipe[]>(
        `https://angular-recipe-book-app-f5a71-default-rtdb.firebaseio.com/${userId}.json`
      )
      .pipe(
        filter(recipes => recipes != undefined), // only continue execution if recipes exists
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
