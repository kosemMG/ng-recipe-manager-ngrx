import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { RecipeService } from '../recipe.service';
import { RecipeModel } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  recipeId: number;
  editMode = false; // initially creating a new recipe
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private recipeService: RecipeService,
              private router: Router) {}

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.recipeId = +params.id;
          this.editMode = params.id != null; // checking if id is undefined hence we're creating a new recipe
          this.initForm();
        }
      );
  }

  /**
   * Creates and initialises the form.
   */
  private initForm(): void {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    const recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.recipeId);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      if (recipe.ingredients) {
        for (const ingredient of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(ingredient.name, Validators.required),
              amount: new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ])
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients
    });
  }

  /**
   * Submits the form.
   * Depending on editMode calls updateRecipe() or addRecipe() method of the RecipeService.
   */
  onSubmit(): void {
    const newRecipe = new RecipeModel(
      this.recipeForm.value.name,
      this.recipeForm.value.description,
      this.recipeForm.value.imagePath,
      this.recipeForm.value.ingredients,
    );
    this.editMode ? this.recipeService.updateRecipe(this.recipeId, newRecipe) : this.recipeService.addRecipe(newRecipe);
    this.onCancel();
  }

  /**
   * Navigates back to the recipe page.
   */
  onCancel(): void {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  /**
   * Creates a new form for adding an ingredient.
   */
  onAddIngredient(): void {
    const ingredients = this.recipeForm.get('ingredients') as FormArray;
    ingredients.push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    );
  }

  /**
   * Removes an ingredient form by its index.
   * @param index of an ingredient form - number.
   */
  onDeleteIngredient(index: number): void {
    const ingredients = this.recipeForm.get('ingredients') as FormArray;
    ingredients.removeAt(index);
  }

  getControls() {
    const ingredients = this.recipeForm.get('ingredients') as FormArray;
    return ingredients.controls;
  }
}
