import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { RecipeModel } from './recipe.model';
import { IngredientModel } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<RecipeModel[]>();
  private recipes: RecipeModel[] = [];

  constructor(private shoppingListService: ShoppingListService,
              private route: ActivatedRoute) {}

  /**
   * Resets the recipes list.
   * @param recipes - array of objects {name: string, amount: number}
   */
  setRecipes(recipes: RecipeModel[]) {
    this.recipes = recipes;
    this.emitRecipes();
  }

  /**
   * Returns a new copy of the recipes array.
   */
  getRecipes(): RecipeModel[] {
    return this.recipes.slice();
  }

  /**
   * Adds ingredients to the shopping list.
   * @param ingredients - array of objects {name: string, amount: number}
   */
  addIngredientsToShoppingList(ingredients: IngredientModel[]): void {
    this.shoppingListService.addIngredients(ingredients);
  }

  /**
   * Returns a recipe object {name: string, desc: string, imagePath: string, ingredients: IngredientModel[]} by its id.
   * @param id of a recipe - number.
   */
  getRecipe(id: number): RecipeModel {
    return this.recipes[id];
  }

  /**
   * Adds a new recipe into the recipes list and emits the list through the Subject observable.
   * @param recipe - object {name: string, desc: string, imagePath: string, ingredients: IngredientModel[]}
   */
  addRecipe(recipe: RecipeModel): void {
    this.recipes.push(recipe);
    this.emitRecipes();
  }

  /**
   * Updates the recipe by its index and emits the recipes list through the Subject observable.
   * @param index of the recipe - number.
   * @param newRecipe - object {name: string, desc: string, imagePath: string, ingredients: IngredientModel[]}
   */
  updateRecipe(index: number, newRecipe: RecipeModel): void {
    this.recipes[index] = newRecipe;
    this.emitRecipes();
  }

  /**
   * Removes a recipe from the list by its index.
   * @param index of the recipe - number.
   */
  deleteRecipe(index: number): void {
    this.recipes.splice(index, 1);
    this.emitRecipes();
  }

  /**
   * Just a shortcut to emit a list of recipes by a Subject Observable.
   */
  emitRecipes() {
    this.recipesChanged.next(this.recipes.slice());
  }
}
