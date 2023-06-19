import { Component, Input } from '@angular/core';

import { Recipe } from '../../recipe.model';
import { RecipeService } from '../../recipe.service';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css'],
})
export class RecipeItemComponent {
  // Make recipe property accessible from outside the component
  @Input() recipe: Recipe;

  constructor(private recipeService: RecipeService) {}

  // Emit an event when the recipe is selected
  onSelected() {
    this.recipeService.recipeSelected.emit(this.recipe);
  }
}
