import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminRoutingModule }    from './admin-routing.module';
import { DashboardComponent }    from './dashboard/dashboard.component';
import { EmployesComponent }     from './employes/employes.component';
import { ProjetsComponent }      from './projets/projets.component';
import { CategoriesComponent }   from './categories/categories.component';
import { AffectationsComponent } from './affectations/affectations.component';
import { ReplacePipe } from '../../shared/pipes/replace.pipe';

@NgModule({
  declarations: [
    DashboardComponent,
    EmployesComponent,
    ProjetsComponent,
    CategoriesComponent,
    AffectationsComponent,
    ReplacePipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AdminRoutingModule
  ]
})
export class AdminModule {}