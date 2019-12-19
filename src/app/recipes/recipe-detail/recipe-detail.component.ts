import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { RecipeModel } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: RecipeModel;
  recipeId: number;

  constructor(private recipeService: RecipeService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.recipeId = +params.id;
          this.recipe = this.recipeService.getRecipe(this.recipeId);
        }
      );
  }

  /**
   * The method is called on click on "To shopping list" in the
   * "Manage recipe" dropdown in recipe-detail.component.html
   */
  onAddToShoppingList(): void {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  /**
   * Navigates to the recipe edit panel
   */
  onEditRecipe(): void {
    // this.router.navigate(['../', this.recipeId, 'edit'], {relativeTo: this.route});
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  /**
   * Calls deleteRecipe() method from the RecipeService and navigates to the recipes page.
   */
  onDeleteRecipe(): void {
    this.recipeService. deleteRecipe(this.recipeId);
    this.router.navigate(['/recipes']);
  }
}
