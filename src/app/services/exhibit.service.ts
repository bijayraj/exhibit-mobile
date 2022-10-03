import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ExhibitService {
  constructor(
    private router: Router,
    private http: HttpClient
  ) {
  }

  getAll() {
    return this.http.get<any>(`${environment.apiUrl}/exhibit`)
      .pipe(map(exhibit => exhibit));
  }


}
