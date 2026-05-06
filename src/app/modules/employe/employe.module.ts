import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeRoutingModule } from './employe-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjetsComponent }   from './projets/projets.component';
import { ProfilComponent }    from './profil/profil.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DashboardComponent, ProjetsComponent, ProfilComponent],
  imports: [CommonModule,FormsModule, EmployeRoutingModule]
})
export class EmployeModule {}