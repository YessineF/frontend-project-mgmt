import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest,
  HttpHandler, HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    // ✅ Toujours ajouter Content-Type JSON
    let headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    // ✅ Ajouter Authorization si token présent
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const authReq = req.clone({ setHeaders: headers });

    return next.handle(authReq);
  }
}