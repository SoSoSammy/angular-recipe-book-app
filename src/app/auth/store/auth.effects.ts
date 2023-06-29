import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, switchMap, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean; // optional
}

//////////////////////////////
// Handle Authentication
const handleAuthentication = (
  expiresIn: number,
  email: string,
  userId: string,
  token: string
) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

  // Store user in local storage
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));

  // Dispatch authentication success action
  return new AuthActions.AuthenticateSucess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate,
    redirect: true,
  });
};

//////////////////////////////
// Handle Error
const handleError = (errorRes: any) => {
  let errorMessage = 'An unkown error occured';
  // for network errors or other errors that don't have an error key
  if (!errorRes.error || !errorRes.error.error)
    return of(new AuthActions.AuthenticateFail(errorMessage));

  // for errors that have an error key
  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email exists already';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email does not exist';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'This password is not correct';
      break;
  }
  // Dispatch authentication fail action
  return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  //////////////////////////////
  // Signup
  authSignup = createEffect(() =>
    this.actions$.pipe(
      // When the action is signup start
      ofType(AuthActions.SIGNUP_START),
      switchMap((signupAction: AuthActions.SignupStart) => {
        // Send request to server to try and sign up
        return this.http
          .post<AuthResponseData>(
            `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${environment.firebaseAPIKey}`,
            {
              email: signupAction.payload.email,
              password: signupAction.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            tap(resData => {
              // Set the auto logout timer
              this.authService.setLogoutTimer(+resData.expiresIn * 1000);
            }),
            map(resData =>
              handleAuthentication(
                +resData.expiresIn,
                resData.email,
                resData.localId,
                resData.idToken
              )
            ),
            // Handle any errors
            catchError(errorRes => handleError(errorRes))
          );
      })
    )
  );

  //////////////////////////////
  // Login
  authLogin = createEffect(() =>
    this.actions$.pipe(
      // When the action is login start
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        // Send the request to the server to try and log in with user data
        return this.http
          .post<AuthResponseData>(
            `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${environment.firebaseAPIKey}`,
            {
              email: authData.payload.email,
              password: authData.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            tap(resData => {
              // Set the auto logout timer
              this.authService.setLogoutTimer(+resData.expiresIn * 1000);
            }),
            map(resData =>
              handleAuthentication(
                +resData.expiresIn,
                resData.email,
                resData.localId,
                resData.idToken
              )
            ),
            // Handle any errors
            catchError(errorRes => handleError(errorRes))
          );
      })
    )
  );

  //////////////////////////////
  // Sucess Redirect
  authRedirect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap((authSuccessAction: AuthActions.AuthenticateSucess) => {
          if (authSuccessAction.payload.redirect)
            // Navigate to home page
            this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  //////////////////////////////
  // Auto Login
  autoLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
        // Retrieve data from local storage
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) return { type: 'DUMMY' }; // Dummy action

        // Create user based on local storage data
        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );

        // If token is valid, log in user
        if (loadedUser.token) {
          // Get the expiration in milliseconds
          const expirationDuration =
            new Date(userData._tokenExpirationDate).getTime() -
            new Date().getTime();
          // Set the auto logout timer
          this.authService.setLogoutTimer(expirationDuration);

          return new AuthActions.AuthenticateSucess({
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: false,
          });
        }
        return { type: 'DUMMY' }; // Dummy action
      })
    )
  );

  //////////////////////////////
  // Logout
  authLogout = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
          this.authService.clearLogoutTimer();
          localStorage.removeItem('userData');
          // Navigate to authentication page
          this.router.navigate(['/auth']);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
