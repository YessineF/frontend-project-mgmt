import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjetService } from '../../../core/services/projet.service';
import { Projet, ProjetInput, StatutProjet } from '../../../shared/models/projet.model';

declare var bootstrap: any;

@Component({
  selector: 'app-projets',
  templateUrl: './projets.component.html'
})
export class ProjetsComponent implements OnInit {

  projets: Projet[]  = [];
  loading    = false;
  errorMsg   = '';
  successMsg = '';

  form!: FormGroup;
  editId: number | null = null;
  isEditMode = false;

  readonly statuts: StatutProjet[] = ['EN_ATTENTE', 'EN_COURS', 'TERMINE'];
  private modalInstance: any;

  constructor(private fb: FormBuilder, private projetService: ProjetService) {}

  ngOnInit(): void {
    this.initForm();
    this.load();
  }

  private initForm(): void {
    this.form = this.fb.group({
      nom:         ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      budget:      [null, [Validators.min(0)]],
      statut:      ['EN_ATTENTE', Validators.required]
    });
  }

  private load(): void {
    this.loading = true;
    this.projetService.getAll().subscribe({
      next: (data) => { this.projets = data; this.loading = false; },
      error: () => { this.errorMsg = 'Erreur de chargement'; this.loading = false; }
    });
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.editId = null;
    this.form.reset({ statut: 'EN_ATTENTE' });
    this.showModal();
  }

  openEditModal(p: Projet): void {
    this.isEditMode = true;
    this.editId = p.id;
    this.form.patchValue({ nom: p.nom, description: p.description, budget: p.budget, statut: p.statut });
    this.showModal();
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const payload: ProjetInput = this.form.value;
    const req$ = this.isEditMode
      ? this.projetService.update(this.editId!, payload)
      : this.projetService.create(payload);
    req$.subscribe({
      next: () => {
        this.hideModal();
        this.load();
        this.successMsg = `Projet ${this.isEditMode ? 'modifié' : 'créé'} avec succès`;
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err: HttpErrorResponse) => { this.errorMsg = err.error?.error ?? 'Erreur'; }
    });
  }

  delete(id: number): void {
    if (!confirm('Supprimer ce projet ?')) return;
    this.projetService.delete(id).subscribe({
      next: () => {
        this.projets = this.projets.filter(p => p.id !== id);
        this.successMsg = 'Projet supprimé';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err: HttpErrorResponse) => { this.errorMsg = err.error?.error ?? 'Erreur'; }
    });
  }

  badgeClass(statut: string): string {
    return { 'EN_COURS': 'bg-primary', 'TERMINE': 'bg-success', 'EN_ATTENTE': 'bg-warning text-dark' }[statut] ?? 'bg-secondary';
  }

  private showModal(): void {
    this.errorMsg = '';
    const el = document.getElementById('projetModal');
    if (el) { this.modalInstance = new bootstrap.Modal(el); this.modalInstance.show(); }
  }
  private hideModal(): void { this.modalInstance?.hide(); }
  get f() { return this.form.controls; }
}