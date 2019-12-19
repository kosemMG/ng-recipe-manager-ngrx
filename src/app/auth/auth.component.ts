import {Component, ComponentFactoryResolver, OnDestroy, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import { Router } from '@angular/router';

import { AuthResponseData, AuthService } from './auth.service';
import {AlertComponent} from '../shared/alert/alert.component';
import {PlaceholderDirective} from '../shared/placeholder/placeholder.directive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true;
  isLoading = false;
  errorMessage: string = null;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;
  private closeSubscription: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private componentFactoryResolver: ComponentFactoryResolver) { }

   ngOnDestroy(): void {
    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }
   }

  /**
   * On form submitting calls login() or signup() method of the AuthService.
   * Manages the error message.
   * @param form - Angular form.
   */
  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    let authObservable: Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode) {
      authObservable = this.authService.login(email, password);
    } else {
      authObservable = this.authService.signup(email, password);
    }

    authObservable.subscribe(responseData => {
      console.log(responseData);
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    }, errorMessage => {
      console.error(errorMessage);
      this.errorMessage = errorMessage;
      this.showErrorAlert(errorMessage)
      this.isLoading = false;
    });

    form.reset();
  }

  /**
   * Switches login to signup mode and vice versa.
   */
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  /**
   * Resets the errorMessage in order to close the alert screen.
   */
  onHandleError() {
    this.errorMessage = null;
  }

  /**
   * Creates AlertComponent programmatically.
   * @param message - an error message.
   */
  private showErrorAlert(message: string): void {
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const alertComponentRef = hostViewContainerRef.createComponent(alertComponentFactory);
    alertComponentRef.instance.message = message;
    this.closeSubscription = alertComponentRef.instance.close
      .subscribe(() => {
        this.closeSubscription.unsubscribe();
        hostViewContainerRef.clear();
      });
  }
}
