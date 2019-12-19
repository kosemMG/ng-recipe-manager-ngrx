import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { exhaustMap, take } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.user
      .pipe(
        take(1), // Takes just the latest user observable and immediately unsubscribes.

        exhaustMap(user => { // Waits for the first observable (i.e. user) to complete
                                    // and replaces it by a new observable (i.e. http observable).

          if (!user) {  // when logging in there is still no user
            return next.handle(request);
          }
          const modifiedRequest = request.clone({
            params: new HttpParams().set('auth', user.token)
          });
          return next.handle(modifiedRequest);
        })
      );
  }
}
