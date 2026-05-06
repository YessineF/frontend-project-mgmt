import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Employe, EmployeInput } from '../../shared/models/employe.model';

@Injectable({ providedIn: 'root' })
export class EmployeService {
  private url = `${environment.apiUrl}/employes`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Employe[]>              { return this.http.get<Employe[]>(this.url); }
  getById(id: number): Observable<Employe>     { return this.http.get<Employe>(`${this.url}/${id}`); }
  create(e: EmployeInput): Observable<Employe> { return this.http.post<Employe>(this.url, e); }
  update(id: number, e: EmployeInput): Observable<Employe> { return this.http.put<Employe>(`${this.url}/${id}`, e); }
  delete(id: number): Observable<void>         { return this.http.delete<void>(`${this.url}/${id}`); }
}