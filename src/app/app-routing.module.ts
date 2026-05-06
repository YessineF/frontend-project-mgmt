import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard }  from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

const routes: Routes = [
  // Redirection racine
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  // Module AUTH (public)
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then(m => m.AuthModule)
  },

  // Module ADMIN (connecté + rôle ADMIN)
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () =>
      import('./modules/admin/admin.module').then(m => m.AdminModule)
  },

  // Module EMPLOYE (connecté)
  {
    path: 'employe',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/employe/employe.module').then(m => m.EmployeModule)
  },

  // Page non autorisée
  {
    path: 'unauthorized',
    loadChildren: () =>
      import('./modules/auth/auth.module').then(m => m.AuthModule)
  },

  // Wildcard
  { path: '**', redirectTo: 'auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}