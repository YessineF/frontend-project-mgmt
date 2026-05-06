import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Projet, ProjetInput } from '../../shared/models/projet.model';

@Injectable({ providedIn: 'root' })
export class ProjetService {
  private url = `${environment.apiUrl}/projets`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Projet[]>              { return this.http.get<Projet[]>(this.url); }
  getById(id: number): Observable<Projet>     { return this.http.get<Projet>(`${this.url}/${id}`); }
  getByEmploye(id: number): Observable<Projet[]> { return this.http.get<Projet[]>(`${this.url}/employe/${id}`); }
  create(p: ProjetInput): Observable<Projet>  { return this.http.post<Projet>(this.url, p); }
  update(id: number, p: ProjetInput): Observable<Projet> { return this.http.put<Projet>(`${this.url}/${id}`, p); }
  delete(id: number): Observable<void>        { return this.http.delete<void>(`${this.url}/${id}`); }
}