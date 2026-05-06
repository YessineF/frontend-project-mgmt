import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent }    from './dashboard/dashboard.component';
import { EmployesComponent }     from './employes/employes.component';
import { ProjetsComponent }      from './projets/projets.component';
import { CategoriesComponent }   from './categories/categories.component';
import { AffectationsComponent } from './affectations/affectations.component';

const routes: Routes = [
  { path: 'dashboard',    component: DashboardComponent },
  { path: 'employes',     component: EmployesComponent },
  { path: 'projets',      component: ProjetsComponent },
  { path: 'categories',   component: CategoriesComponent },
  { path: 'affectations', component: AffectationsComponent },
  { path: '',             redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}