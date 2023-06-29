import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Subscription, take } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';
import { Recipe } from '../recipes/recipe.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;
  collapsed = true;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.userSub = this.store
      .select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        this.isAuthenticated = !!user; // true when we have user, false when no user
        console.log(!user);
        console.log(!!user);
      });
  }

  // Store data
  onSaveData() {
    let recipes: Recipe[];
    this.store
      .select('recipes')
      .pipe(map(recipesState => (recipes = recipesState.recipes)))
      .subscribe()
      .unsubscribe();

    // If the user is trying to save no recipes, display a warning message
    if (recipes.length < 1) {
      if (
        confirm(
          '⚠ Warning: This action will replace all existing recipes on your account with nothing ⚠'
        )
      )
        this.store.dispatch(new RecipeActions.StoreRecipes(this.getUserId()));
    } else {
      this.store.dispatch(new RecipeActions.StoreRecipes(this.getUserId()));
    }
  }

  // Retrieve data
  onFetchData() {
    // this.dataStorageService.fetchRecipes().subscribe();
    this.store.dispatch(new RecipeActions.FetchRecipes(this.getUserId()));
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
    this.store.dispatch(new RecipeActions.SetRecipes([]));
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
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
