import { Component, OnDestroy, OnInit } from '@angular/core';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import {Subscription} from 'rxjs';
import {UserModel} from '../auth/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;
  userSubscription: Subscription;
  isAuthenticated = false;

  constructor(private dataStorageService: DataStorageService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.user
      .subscribe(
        (user: UserModel | null) => {
          this.isAuthenticated = !!user;  // !user ? false : true
        }
      );
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  /**
   * Calls the storeRecipes() method of the DataStorageService.
   */
  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  /**
   * Calls the fetchRecipes() method of the DataStorageService.
   */
  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  /**
   * Calls the logout() method of the AuthService.
   */
  onLogout() {
    this.authService.logout();
  }
}
