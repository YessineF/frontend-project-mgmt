import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sidebarOpen = false;
  pageTitle = '';

  private readonly titleMap: Record<string, string> = {
    '/admin/dashboard':    'Vue d\'ensemble',
    '/admin/employes':     'Gestion des employés',
    '/admin/projets':      'Gestion des projets',
    '/admin/categories':   'Catégories',
    '/admin/affectations': 'Affectations',
    '/employe/dashboard':  'Mon espace',
    '/employe/projets':    'Mes projets',
    '/employe/profil':     'Mon profil'
  };

  constructor(public authService: AuthService, private router: Router) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.pageTitle = this.titleMap[e.urlAfterRedirects] ?? 'GestionProjets';
      this.sidebarOpen = false; // close sidebar on navigation (mobile)
    });
  }
}
