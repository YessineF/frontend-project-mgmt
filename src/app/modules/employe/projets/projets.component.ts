import { Component, OnInit } from '@angular/core';
import { ProjetService } from '../../../core/services/projet.service';
import { Projet }        from '../../../shared/models/projet.model';

@Component({ selector: 'app-employe-projets', templateUrl: './projets.component.html' })
export class ProjetsComponent implements OnInit {

  projets: Projet[] = [];
  loading   = false;
  errorMsg  = '';
  filterStatut = '';

  constructor(private projetService: ProjetService) {}

  ngOnInit(): void {
    this.loading = true;
    this.projetService.getAll().subscribe({
      next: (data) => { this.projets = data; this.loading = false; },
      error: () => { this.errorMsg = 'Erreur de chargement'; this.loading = false; }
    });
  }

  get filteredProjets(): Projet[] {
    if (!this.filterStatut) return this.projets;
    return this.projets.filter(p => p.statut === this.filterStatut);
  }

  badgeClass(statut: string): string {
    return { 'EN_COURS': 'bg-primary', 'TERMINE': 'bg-success', 'EN_ATTENTE': 'bg-warning text-dark' }[statut] ?? 'bg-secondary';
  }
}