import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArtworkService {
  constructor(
    private router: Router,
    private http: HttpClient
  ) { }


  get(id: number) {
    return this.http.get<any>(`${environment.apiUrl}/artwork/${id}`);
  }

  create(userData) {
    return this.http.post<any>(`${environment.apiUrl}/artwork`, userData)
      .pipe(map(exhibit => exhibit));
  }

  getAll() {
    return this.http.get<any>(`${environment.apiUrl}/artwork`);
  }


  getAssets(id: number) {
    return this.http.get<any>(`${environment.apiUrl}/artwork-asset/artwork/${id}`);
  }

  askQuestion(id: number, question: string) {
    return this.http.post<any>(`${environment.apiUrl}/artwork/question/${id}`, { question: question })
      .pipe(map(message => message));
  }

  getByTagId(id: string) {
    return this.http.get<any>(`${environment.apiUrl}/artwork/tag/${id}`);
  }

  addTag(tagId: string, artworkId: number, location: string) {
    return this.http.post<any>(`${environment.apiUrl}/artwork-tag`, { uuid: tagId, ArtworkId: artworkId, location: location })
      .pipe(map(message => message));
  }


}
