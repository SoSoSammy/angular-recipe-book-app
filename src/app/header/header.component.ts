import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { RecipeService } from '../recipes/recipe.service';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;
  collapsed = true;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private recipeService: RecipeService,
    private store: Store<fromApp.AppState>
  ) {}

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
    const recipes = this.recipeService.getRecipes();

    // If the user is trying to save no recipes, display a warning message
    if (recipes.length < 1) {
      if (
        confirm(
          '⚠ Warning: This action will replace all existing recipes on your account with nothing ⚠'
        )
      )
        this.dataStorageService.storeRecipes();
    } else {
      this.dataStorageService.storeRecipes();
    }
  }

  // Retrieve data
  onFetchData() {
    // this.dataStorageService.fetchRecipes().subscribe();
    this.store.dispatch(new RecipeActions.FetchRecipes());
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
    this.recipeService.setRecipes([]);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
