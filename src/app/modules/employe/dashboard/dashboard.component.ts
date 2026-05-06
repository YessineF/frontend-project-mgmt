import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AuthService }        from '../../../core/services/auth.service';
import { ProjetService }      from '../../../core/services/projet.service';
import { AffectationService } from '../../../core/services/affectation.service';
import { Projet }      from '../../../shared/models/projet.model';
import { Affectation } from '../../../shared/models/affectation.model';
import { CurrentUser } from '../../../shared/models/auth.model';

@Component({
  selector: 'app-employe-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  user: CurrentUser | null = null;
  projets: Projet[]             = [];
  affectations: Affectation[]   = [];
  loading = true;

  constructor(
    private authService: AuthService,
    private projetService: ProjetService,
    private affectationService: AffectationService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (!this.user) return;

    forkJoin({
      projets:      this.projetService.getAll(),
      affectations: this.affectationService.getByEmploye(this.user.id)
    }).subscribe({
      next: ({ projets, affectations }) => {
        this.projets      = projets;
        this.affectations = affectations;
        this.loading      = false;
      },
      error: () => { this.loading = false; }
    });
  }

  get projetsEnCours(): number {
    return this.projets.filter(p => p.statut === 'EN_COURS').length;
  }

  badgeClass(statut: string): string {
    return { 'EN_COURS': 'bg-primary', 'TERMINE': 'bg-success', 'EN_ATTENTE': 'bg-warning text-dark' }[statut] ?? 'bg-secondary';
  }
}