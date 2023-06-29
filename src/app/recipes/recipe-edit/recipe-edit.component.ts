import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';

import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipe.actions';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  private storeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    // Subscribe to changes in URL parameters
    this.route.params.subscribe((params: Params) => {
      this.id = +params.id;
      // Decide if we are in edit mode based on if id URL parameter is present
      this.editMode = params.id != null;
      this.initForm();
    });
  }

  ngOnDestroy(): void {
    if (this.storeSub) this.storeSub.unsubscribe();
  }

  private initForm() {
    // Set default recipe values
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    // If in edit mode, set default recipe values to recipe passed in from URL
    if (this.editMode) {
      this.storeSub = this.store
        .select('recipes')
        .pipe(
          map(recipesState =>
            recipesState.recipes.find((recipe, index) => index === this.id)
          )
        )
        .subscribe(recipe => {
          recipeName = recipe.name;
          recipeImagePath = recipe.imagePath;
          recipeDescription = recipe.description;

          // If the recipe has ingredients, create a new form group for each ingredient
          if (recipe.ingredients) {
            recipe.ingredients.forEach(ingredient =>
              recipeIngredients.push(
                // name of this FormGroup is its index in the FormArray
                new FormGroup({
                  name: new FormControl(ingredient.name, Validators.required),
                  amount: new FormControl(
                    ingredient.amount,
                    Validators.required
                  ),
                  // If wanted to do number validation, do:
                  // amount: new FormControl(ingredient.amount, [
                  //   Validators.required,
                  //   Validators.pattern(/^[1-9]+[0-9]*$/),
                  // ]),
                })
              )
            );
          }
        });
    }

    // Fill out the form controls with the default value of '' or the recipe's values
    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients,
    });
  }

  // Get the ingredient form controls
  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  // Add new ingredient form group to form
  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, Validators.required),
        // If wanted to do number validation, do:
        // amount: new FormControl(null, [
        //   Validators.required,
        //   Validators.pattern(/^[1-9]+[0-9]*$/),
        // ]),
      })
    );
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  // When the form is submitted
  onSubmit() {
    // const newRecipe = new Recipe(
    //   this.recipeForm.value.name,
    //   this.recipeForm.value.description,
    //   this.recipeForm.value.imagePath,
    //   this.recipeForm.value.ingredients
    // );

    // If we are in edit mode, update existing recipe, if not, add new recipe
    if (this.editMode)
      // this.recipeService.updateRecipe(this.id, this.recipeForm.value);
      this.store.dispatch(
        new RecipesActions.UpdateRecipe({
          index: this.id,
          newRecipe: this.recipeForm.value,
        })
      );
    else
      this.store.dispatch(new RecipesActions.AddRecipe(this.recipeForm.value));

    // Redirect up one level
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
