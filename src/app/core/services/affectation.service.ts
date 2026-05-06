import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Affectation, AffectationInput } from '../../shared/models/affectation.model';

@Injectable({ providedIn: 'root' })
export class AffectationService {
  private url = `${environment.apiUrl}/affectations`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Affectation[]>                    { return this.http.get<Affectation[]>(this.url); }
  getByProjet(id: number): Observable<Affectation[]>     { return this.http.get<Affectation[]>(`${this.url}/projet/${id}`); }
  getByEmploye(id: number): Observable<Affectation[]>    { return this.http.get<Affectation[]>(`${this.url}/employe/${id}`); }
  create(a: AffectationInput): Observable<Affectation>   { return this.http.post<Affectation>(this.url, a); }
  delete(id: number): Observable<void>                   { return this.http.delete<void>(`${this.url}/${id}`); }
}