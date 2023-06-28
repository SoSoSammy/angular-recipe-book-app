import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions'; // creates object with all exports

// Define State type
export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

// Define overall AppState type
export interface AppState {
  shoppingList: State;
}

const initialState: State = {
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
  editedIngredient: null,
  editedIngredientIndex: -1,
};

export function shoppingListReducer(
  state: State = initialState,
  action: ShoppingListActions.ShoppingListActions
) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT: // convention is all caps
      return {
        ...state, // copy old state
        ingredients: [...state.ingredients, action.payload],
      };

    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload],
      };

    case ShoppingListActions.UPDATE_INGREDIENT:
      // Get the ingredient with the specified index
      const ingredient = state.ingredients[action.payload.index];
      // Create the updated ingredient based on old ingredient data + new data
      const updatedIngredient = {
        ...ingredient,
        ...action.payload.ingredient,
      };
      // Copy the old ingredients
      const updatedIngredients = [...state.ingredients];
      // Replace existing ingredient with specified index with updated ingredient
      updatedIngredients[action.payload.index] = updatedIngredient;

      return {
        ...state,
        ingredients: updatedIngredients,
      };

    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        // Filter through ingredients and return updated ingredients without deleted ingredient
        ingredients: state.ingredients.filter((ig, igIndex) => {
          // Don't add the ingredient if the index is the same as the specified deleted item index
          return igIndex !== action.payload;
        }),
      };
    default:
      return state;
  }
}
