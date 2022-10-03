import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
// import { User } from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private router: Router,
    private http: HttpClient
  ) {
  }

  addUser(userData) {
    return this.http.post<any>(`${environment.apiUrl}/user`, userData, { withCredentials: false })
      .pipe(map(user => {
        return user;
      }));
  }
}

