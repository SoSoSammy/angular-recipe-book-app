import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions'; // creates object with all exports

// Define State type
export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
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
    //////////////////////////
    // Add new ingredient
    case ShoppingListActions.ADD_INGREDIENT: // convention is all caps
      return {
        ...state, // copy old state
        ingredients: [...state.ingredients, action.payload],
      };

    // Add multiple ingredients
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload],
      };

    //////////////////////////
    // Update an ingredient
    case ShoppingListActions.UPDATE_INGREDIENT:
      // Get the ingredient with the specified index
      const ingredient = state.ingredients[state.editedIngredientIndex];
      // Create the updated ingredient based on old ingredient data + new data
      const updatedIngredient = {
        ...ingredient,
        ...action.payload,
      };
      // Copy the old ingredients
      const updatedIngredients = [...state.ingredients];
      // Replace existing ingredient with specified index with updated ingredient
      updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

      return {
        ...state,
        ingredients: updatedIngredients,
        editedIngredient: null,
        editedIngredientIndex: -1,
      };

    //////////////////////////
    // Delete an ingredient
    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        // Filter through ingredients and return updated ingredients without deleted ingredient
        ingredients: state.ingredients.filter((ig, igIndex) => {
          // Don't add the ingredient if the index is the same as the specified deleted item index
          return igIndex !== state.editedIngredientIndex;
        }),
        editedIngredient: null,
        editedIngredientIndex: -1,
      };

    //////////////////////////
    // Start editing
    case ShoppingListActions.START_EDIT:
      return {
        ...state,
        editedIngredientIndex: action.payload,
        editedIngredient: { ...state.ingredients[action.payload] },
      };

    //////////////////////////
    // Stop editing
    case ShoppingListActions.STOP_EDIT:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1,
      };

    default:
      return state;
  }
}
