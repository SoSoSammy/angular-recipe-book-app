import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Recipe } from '../../recipe.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css'],
})
export class RecipeItemComponent {
  // Make recipe property accessible from outside the component
  @Input() recipe: Recipe;
  // Make recipeSelected event listenable from outside the component
  @Output() recipeSelected = new EventEmitter<void>(); // void because we don't pass in any data
  
  // Emit an event when the recipe is selected
  onSelected(recipe: Recipe) {
    this.recipeSelected.emit();
  }
}
