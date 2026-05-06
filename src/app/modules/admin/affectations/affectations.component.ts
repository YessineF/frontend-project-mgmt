import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AffectationService } from '../../../core/services/affectation.service';
import { EmployeService }     from '../../../core/services/employe.service';
import { ProjetService }      from '../../../core/services/projet.service';
import { Affectation }        from '../../../shared/models/affectation.model';
import { Employe }            from '../../../shared/models/employe.model';
import { Projet }             from '../../../shared/models/projet.model';

declare var bootstrap: any;

@Component({ selector: 'app-affectations', templateUrl: './affectations.component.html' })
export class AffectationsComponent implements OnInit {

  affectations: Affectation[] = [];
  employes: Employe[] = [];
  projets: Projet[]   = [];
  loading = false; errorMsg = ''; successMsg = '';
  form!: FormGroup;
  private modalInstance: any;

  constructor(
    private fb: FormBuilder,
    private affectationService: AffectationService,
    private employeService: EmployeService,
    private projetService: ProjetService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      employeId: [null, Validators.required],
      projetId:  [null, Validators.required],
      dateDebut: ['', Validators.required],
      dateFin:   ['']
    });
    this.load();
  }

  private load(): void {
    this.loading = true;
    forkJoin({
      affectations: this.affectationService.getAll(),
      employes:     this.employeService.getAll(),
      projets:      this.projetService.getAll()
    }).subscribe({
      next: ({ affectations, employes, projets }) => {
        this.affectations = affectations;
        this.employes = employes;
        this.projets  = projets;
        this.loading  = false;
      },
      error: () => { this.errorMsg = 'Erreur de chargement'; this.loading = false; }
    });
  }

  openModal(): void {
    this.errorMsg = '';
    this.form.reset();
    const el = document.getElementById('affModal');
    if (el) { this.modalInstance = new bootstrap.Modal(el); this.modalInstance.show(); }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const v = this.form.value;
    this.affectationService.create({ ...v, dateFin: v.dateFin || null }).subscribe({
      next: () => {
        this.modalInstance?.hide();
        this.load();
        this.successMsg = 'Affectation créée avec succès';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err: HttpErrorResponse) => { this.errorMsg = err.error?.error ?? 'Erreur'; }
    });
  }

  delete(id: number): void {
    if (!confirm('Supprimer cette affectation ?')) return;
    this.affectationService.delete(id).subscribe({
      next: () => {
        this.affectations = this.affectations.filter(a => a.id !== id);
        this.successMsg = 'Affectation supprimée';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err: HttpErrorResponse) => { this.errorMsg = err.error?.error ?? 'Erreur'; }
    });
  }

  get f() { return this.form.controls; }
}