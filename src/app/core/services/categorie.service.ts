import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Categorie, CategorieInput } from '../../shared/models/categorie.model';

@Injectable({ providedIn: 'root' })
export class CategorieService {
  private url = `${environment.apiUrl}/categories`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Categorie[]>                { return this.http.get<Categorie[]>(this.url); }
  getById(id: number): Observable<Categorie>       { return this.http.get<Categorie>(`${this.url}/${id}`); }
  create(c: CategorieInput): Observable<Categorie> { return this.http.post<Categorie>(this.url, c); }
  update(id: number, c: CategorieInput): Observable<Categorie> { return this.http.put<Categorie>(`${this.url}/${id}`, c); }
  delete(id: number): Observable<void>             { return this.http.delete<void>(`${this.url}/${id}`); }
}