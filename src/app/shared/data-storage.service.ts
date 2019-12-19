import {Injectable} from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { map, tap} from 'rxjs/operators';

import {RecipeService} from '../recipes/recipe.service';
import {RecipeModel} from '../recipes/recipe.model';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  apiUrl = 'https://ng-recipe-book-576d9.firebaseio.com/recipes.json';

  constructor(private http: HttpClient,
              private recipeService: RecipeService,
              private authService: AuthService) {
  }

  /**
   * Stores recipes in the backend API database.
   */
  storeRecipes(): void {
    const recipes = this.recipeService.getRecipes();
    this.http.put(this.apiUrl, recipes)
      .subscribe(response => {
        console.log(response);
      });
  }

  /**
   * Fetches recipes from the backend API database.
   */
  fetchRecipes() {
    return this.http.get<RecipeModel[]>(this.apiUrl)
      .pipe(map(recipes => {    // Adds ingredients property as an empty array if absent in database.
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}
