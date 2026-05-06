import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjetsComponent }   from './projets/projets.component';
import { ProfilComponent }    from './profil/profil.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'projets',   component: ProjetsComponent },
  { path: 'profil',    component: ProfilComponent },
  { path: '',          redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeRoutingModule {}