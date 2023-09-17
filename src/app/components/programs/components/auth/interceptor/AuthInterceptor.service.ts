import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../authService/auth.service';
import { AuthenticationResponse } from '../model/authenticationResponse';
const TOKEN_HEADER_KEY = 'Authorization';  // for Spring Boot back-end

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
    let authReq = req;
    const token = this.isRefreshing ? this.authService.getRefToken() : this.authService.getAccessToken();
    if (token != null) {
      authReq = this.addTokenHeader(req, token);
    }
    return next.handle(authReq).pipe(catchError(error => {
      let isJwtExpiredErrResponse = error instanceof HttpErrorResponse && !authReq.url.includes('auth/authenticate')
        && error.status === 401 ;//&& error?.error?.errors[0].code === 'JWT_EXPIRED';
      if (isJwtExpiredErrResponse) {
        return this.handle401Error(authReq, next);
      }
      return throwError(error);
    }));
  }
  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (this.authService.isRefreshaTokenExpired()) {
      this.isRefreshing = false
      this.authService.logout('SESSTION_EXPIRED');
    }
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const token = this.authService.getRefToken();
      if (token)
        return this.authService.refreshToken().pipe(
          switchMap((response: AuthenticationResponse) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(response.refreshToken);
            return next.handle(this.addTokenHeader(request, response.token as string));
          }), catchError((err) => {
            this.isRefreshing = false;
            this.authService.logout(err.error.errors[0].code);
            return throwError(err);
          })
        );
    }
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }
  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
  }
}
export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
