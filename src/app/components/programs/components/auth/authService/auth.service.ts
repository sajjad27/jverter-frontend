import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import jwt_decode from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { getUrl } from 'src/environments/URLs.service';
import { AppRole } from '../model/app-role';
import { AuthenticationResponse } from '../model/authenticationResponse';
import { UserData } from '../model/user-data.model';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private _STORAGE_TOKEN_KEY = "token";
  private _STORAGE_REFRESH_TOKEN_KEY = "refreshtoken";

  private tokenExpirationTimer: any;
  jwtHelper = new JwtHelperService();

  $userData: BehaviorSubject<UserData | null> = new BehaviorSubject<UserData | null>(null);
  userData: UserData | null = null;


  constructor(private http: HttpClient) {
    this.$userData.subscribe(userData => {
      this.userData = userData
    })
    this.initializeAfterReload();
  }

  isRefreshaTokenExpired() {
    return this.jwtHelper.isTokenExpired(this.getRefToken());
  }

  logIn(body: { username: string, password: string }) {
    this.http.post<AuthenticationResponse>(getUrl("login"), body).subscribe(response => {
      this.persistTokens(response);
    });
  }

  refreshToken() {
    let body = {
      "expiredAccessToken": this.getAccessToken()
    }
    return this.http.post<AuthenticationResponse>(getUrl("refreshToken"), body)
      .pipe(tap(response => {
        this.persistTokens(response);
      }));
  }

  private persistTokens(authenticationResponse: AuthenticationResponse) {
    sessionStorage.setItem(this._STORAGE_TOKEN_KEY, authenticationResponse.token as string);
    sessionStorage.setItem(this._STORAGE_REFRESH_TOKEN_KEY, authenticationResponse.refreshToken as string);
    this.initializeAfterReload();
  }

  private initializeAfterReload() {
    const token = this.getAccessToken();
    const refreshToken = this.getRefToken();

    if (token && refreshToken) {
      this.handleJwtPayload(token);
      const refreshTokenClaims = jwt_decode(refreshToken) as any;
      this.autoLogout(refreshTokenClaims["iat"], refreshTokenClaims["exp"]);
    }
  }

  handleJwtPayload(token: string | undefined) {
    if (token) {
      const tokenData = this.jwtHelper.decodeToken(token);
      if (tokenData) {
        let userId = tokenData.sub;
        let username = tokenData.username;
        let userRoles = this._getRolesFromToken(tokenData)
        this.$userData.next({ userId: userId, username: username, userRoles: userRoles })
      }
    }
  }

  private _getRolesFromToken(tokenData: any): AppRole[] {
    let roles: AppRole[] = [];
    if (tokenData && tokenData.roles) {
      for (const roleKey of Object.keys(tokenData.roles)) {
        roles.push(+AppRole[tokenData.roles[roleKey]]);
      }
    }
    return roles
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

  }

  resetAuthData() {
    sessionStorage.clear();
    this.resetLogoutTimer();
    this.$userData.next(null)
  }

  private resetLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null
  }

  getAccessToken(): string {
    return window.sessionStorage.getItem(this._STORAGE_TOKEN_KEY) as string;
  }

  getRefToken(): string {
    return window.sessionStorage.getItem(this._STORAGE_REFRESH_TOKEN_KEY) as string;
  }

  isLoggedIn() {
    return this.getRefToken() != null && !this.isRefreshaTokenExpired();
  }

  userHasRole(role: AppRole): boolean | undefined {
    return this.userData?.userRoles?.includes(role)
  }

  togglz() {
    return this.http.get('http://localhost:8080/togglz/index', { responseType: 'text' })
  }
}