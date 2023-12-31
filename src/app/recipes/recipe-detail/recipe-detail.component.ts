import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs';

import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipe.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    // Get the recipe from the URL and update it when the URL changes
    this.route.params
      .pipe(
        // Get recipe id from URL parameter
        map(params => +params.id),
        // Return recipes state as an observable
        switchMap(id => {
          this.id = id;
          return this.store.select('recipes');
        }),
        // Get the recipe with the same index as the URL parameter
        map(recipesState =>
          recipesState.recipes.find((recipe, index) => index === this.id)
        )
      )
      // Set recipe to recipe
      .subscribe(recipe => (this.recipe = recipe));
  }

  onAddToShoppingList() {
    this.store.dispatch(
      new ShoppingListActions.AddIngredients(this.recipe.ingredients)
    );
    this.router.navigate(['/shopping-list']);
  }

  onDeleteRecipe() {
    // this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }
}
