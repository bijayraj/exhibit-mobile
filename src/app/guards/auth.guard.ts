import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(private authService: AuthenticationService, private router: Router) { }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const user = this.authService.userValue;
    if (user) {
      // logged in so return true
      return true;
    } else {
      // not logged in so redirect to login page with the return url
      console.log('Caught here');
      this.router.navigateByUrl('/login');
      return false;
    }
    // return this.authService.user.pipe(
    //   filter(val => val !== null),
    //   take(1),
    //   map(user => {
    //     console.log(user);
    //     if (user) {
    //       return true;
    //     } else {
    //       this.router.navigateByUrl('/login');
    //       return false;
    //     }
    //   })
    // );

  }
}
