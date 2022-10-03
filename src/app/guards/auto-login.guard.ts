import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { filter, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {
  private myUser: boolean = false;

  constructor(private authService: AuthenticationService, private router: Router) { }

  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const user = this.authService.userValue;
    // return true;
    console.log("USER FOUND");
    console.log(user);
    if (user) {
      // Directly open inside area       
      this.router.navigateByUrl('/tabs', { replaceUrl: true });
      return true;
    } else {
      // this.router.navigate(['/login']);
      return true;
    }


    // return this.authService.userSubject.pipe(
    //   filter(val => val !== null), // Filter out initial Behaviour subject value
    //   take(1), // Otherwise the Observable doesn't complete!
    //   map(isAuthenticated => {
    //     console.log('Found previous token, automatic login');
    //     if (isAuthenticated) {
    //       // Directly open inside area       
    //       this.router.navigateByUrl('/tabs', { replaceUrl: true });
    //     } else {
    //       // Simply allow access to the login
    //       return true;
    //     }
    //   })
    // );
  }
}
