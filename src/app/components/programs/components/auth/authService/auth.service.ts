import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import jwt_decode from 'jwt-decode';
import { tap } from 'rxjs/operators';
import { getUrl } from 'src/environments/URLs.service';
import { AppRole } from '../model/app-role';
import { AuthenticationResponse } from '../model/authenticationResponse';

@Injectable({
  providedIn: 'root'
})

export class AuthService {


  private tokenExpirationTimer: any;
  jwtHelper = new JwtHelperService();
  roles: AppRole[] = [];

  constructor(private http: HttpClient, private router: Router) { }

  isRefreshaTokenExpired() {
    return this.jwtHelper.isTokenExpired(this.getRefToken());
  }

  logIn(body: { username: string, password: string }) {
    return this.http.post<AuthenticationResponse>(getUrl("login"), body).pipe(tap(response => {
      this.persistTokens(response, body.username);
    }));
  }

  refreshToken() {
    let body = {
      "expiredAccessToken": this.getAccessToken()
    }
    return this.http.post<AuthenticationResponse>(getUrl("refreshToken"), body)
      .pipe(tap(response => {
        this.persistTokens(response, this.getUsername());
      }));
  }

  private persistTokens(authenticationResponse: AuthenticationResponse, username: string) {
    sessionStorage.setItem("token", authenticationResponse.token as string);
    sessionStorage.setItem("refreshtoken", authenticationResponse.refreshToken as string);
    let refreshtokenClaims = jwt_decode(authenticationResponse.refreshToken as string) as any
    this.autoLogout(refreshtokenClaims["iat"], refreshtokenClaims["exp"]);
  }

  autoLogout(iat: Number, exp: Number) {
    this.resetLogoutTimer()
    var jwtExpiredInMilliseconds = (+exp * 1000) - (+iat * 1000);
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout('SESSTION_EXPIRED');
    }, jwtExpiredInMilliseconds);
  }

  logout(errorCode?: string) {
    this.resetAuthData();
    this.router.navigate(['/login'], { queryParams: { 'err-msg': errorCode } }).then(() => {
      window.location.reload();
    });

  }

  resetAuthData() {
    sessionStorage.clear();
    this.resetLogoutTimer()
    this.roles = []
  }

  private resetLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null
  }

  // resetPassword(body) {
  //   return this.http.post<any>(getUrl("resetPassword"), body);
  // }

  getAccessToken(): string {
    return window.sessionStorage.getItem('token') as string;
  }

  getRefToken(): string {
    return window.sessionStorage.getItem('refreshtoken') as string;
  }

  isLoggedIn() {
    return this.getRefToken() != null && !this.isRefreshaTokenExpired();
  }


  getUserRoles(): AppRole[] {
    const token = this.getAccessToken();
    if (token && !this.roles.length) {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      if (tokenData && tokenData.roles) {
        for (const roleKey of Object.keys(tokenData.roles)) {
            this.roles.push(+AppRole[tokenData.roles[roleKey]]);
        }
      }
    }
    return this.roles;
  }





  isAdmin() {
    // return this.getUserRole()?.trim() === 'isAdmin';
  }
  isWorker() {
    // return this.getUserRole()?.trim() === 'isWorker';
  }
  isSupervisor() {
    // return this.getUserRole()?.trim() === 'isSupervisor';
  }
  isAccountant() {
    // return this.getUserRole()?.trim() === 'isAccountant';
  }
  isHr() {
    // return this.getUserRole()?.trim() === 'isHr';
  }

  getUserId() {
    return window.sessionStorage.getItem('sub') as string;
  }
  getUsername(): string {
    return window.sessionStorage.getItem('username') as string;
  }
}
