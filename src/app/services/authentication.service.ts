import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/user';
import { Preferences } from '@capacitor/preferences';



@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public user: Observable<User>;
  public userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);;
  private refreshTokenTimeout;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {

    this.user = this.userSubject.asObservable();
    // const tokenUser = this.refreshToken().then(
    //   obs => {
    //     obs.toPromise().then(user3 => {
    //       console.log('User3');
    //       console.log(user3);
    //       this.userSubject.next(user3);
    //     });
    //   }
    // );
    // promise.all([tokenUser]);
    // this.loadToken();

  }


  public get userValue(): User {
    return this.userSubject.value;
  }

  async loadToken() {
    const token = await Preferences.get({ key: 'token' });
    const refreshToken = await Preferences.get({ key: 'token2' });

    if (token && token.value && refreshToken && refreshToken.value) {
      console.log('set token: ', token.value);

      const user3 = await this.refreshToken();
      return user3;
      // user3.subscribe(user => {
      //   this.userSubject.next(user);

      // });


      // .then(
      //   obs => {
      //     obs.toPromise().then(user3 => {
      //       console.log('User3');
      //       console.log(user3);
      //       this.userSubject.next(user3);
      //     });
      //   }
      // );

    } else {
      console.log('Token not found');
      this.userSubject.next(null);
    }
  }

  login(credential: { username, password }) {
    return this.http.post<any>(`${environment.apiUrl}/login`, credential, { withCredentials: false })
      .pipe(map(user => {
        this.userSubject.next(user);
        this.startRefreshTokenTimer();
        this.setSession(user);
        return user;
      }));
  }



  async logout() {
    const refreshToken = await Preferences.get({ key: 'token2' });//localStorage.getItem('token2');
    this.http.post<any>(`${environment.apiUrl}/revoke-token?refreshToken=${refreshToken.value}`,
      {}, { withCredentials: false }).subscribe();
    this.stopRefreshTokenTimer();
    this.userSubject.next(null);
    this.clearSession();
    // this.router.navigate(['/login']);
  }

  async refreshToken() {
    const refreshToken = await Preferences.get({ key: 'token2' });//localStorage.getItem('token2');
    console.log('REFRESH TOKEN');
    console.log(refreshToken);

    if (refreshToken.value === null) {
      this.userSubject.next(null);
      return;
    }

    return this.http.post<any>(`${environment.apiUrl}/refresh-token?refreshToken=${refreshToken.value}`, {}, { withCredentials: false })
      .pipe(map((user) => {
        this.userSubject.next(user);
        this.setSession(user);
        this.startRefreshTokenTimer();
        return user;
      }));
  }

  private async setSession(user) {
    await Preferences.set({ key: 'token', value: user.jwtToken });
    await Preferences.set({ key: 'token2', value: user.refreshToken });

    // localStorage.setItem('token', user.jwtToken);
    // localStorage.setItem('token2', user.refreshToken);
  }

  private async clearSession() {
    await Preferences.remove({ key: 'token' });
    await Preferences.remove({ key: 'token2' });
    // localStorage.removeItem('token');
    // localStorage.removeItem('token2');
  }

  // helper methods


  private startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token
    const jwtToken = JSON.parse(atob(this.userValue.jwtToken.split('.')[1]));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(async () => {
      const postObj = await this.refreshToken();
      postObj.subscribe();
    }, timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}
