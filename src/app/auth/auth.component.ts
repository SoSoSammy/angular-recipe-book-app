import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { AuthService, AuthResponseData } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;

  private closeSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    // private componentFactoryResolver: ComponentFactoryResolver
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error) this.showErrorAlert(this.error);
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode; // reverse value of isLoginMode
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return; // if form is invalid, do nothing

    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    // Login
    // if (this.isLoginMode) authObs = this.authService.login(email, password);
    if (this.isLoginMode)
      this.store.dispatch(
        new AuthActions.LoginStart({ email: email, password: password })
      );
    // Signup
    else authObs = this.authService.signup(email, password);

    // Subscribe to the observable returned by login or signup and handle errors
    // authObs.subscribe(
    //   resData => {
    //     console.log(resData);
    //     this.isLoading = false;
    //     this.router.navigate(['/recipes']);
    //   },
    //   errorMessage => {
    //     console.log(errorMessage);
    //     this.error = errorMessage;
    //     this.showErrorAlert(errorMessage);
    //     this.isLoading = false;
    //   }
    // );

    form.reset();
  }

  onHandleError() {
    this.error = null;
  }

  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  }

  private showErrorAlert(message: string) {
    // const alertCmp = new AlertComponent(); // works for TypeScript, but won't work for Angular

    // Deprecated
    // const alertCmpFactory =
    //   this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

    const hostViewContainerRef = this.alertHost.viewContainerRef;
    // Clear anything that has been rendered before
    hostViewContainerRef.clear();

    // Deprecated
    // const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

    // New way of doing it
    const componentRef =
      hostViewContainerRef.createComponent<AlertComponent>(AlertComponent);

    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }
}
