import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, switchMap, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

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

@Injectable()
export class AuthEffects {
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
            map(resData => {
              const expirationDate = new Date(
                new Date().getTime() + +resData.expiresIn * 1000
              );
              // Dispatch the login action upon successful authentication
              return new AuthActions.Login({
                email: resData.email,
                userId: resData.localId,
                token: resData.idToken,
                expirationDate: expirationDate,
              });
            }),
            // Handle any errors
            catchError(errorRes => {
              let errorMessage = 'An unkown error occured';
              // for network errors or other errors that don't have an error key
              if (!errorRes.error || !errorRes.error.error)
                return of(new AuthActions.LoginFail(errorMessage));

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
              return of(new AuthActions.LoginFail(errorMessage)); // create observable
            })
          );
      })
    )
  );

  authSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.LOGIN),
        tap(() => {
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}
