import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { EmployeService }   from '../../../core/services/employe.service';
import { CategorieService } from '../../../core/services/categorie.service';
import { Employe, EmployeInput } from '../../../shared/models/employe.model';
import { Categorie }             from '../../../shared/models/categorie.model';

// Référence au bootstrap JS global pour contrôler les modals
declare var bootstrap: any;

@Component({
  selector: 'app-employes',
  templateUrl: './employes.component.html'
})
export class EmployesComponent implements OnInit {

  employes: Employe[]    = [];
  categories: Categorie[] = [];
  loading   = false;
  errorMsg  = '';
  successMsg = '';

  form!: FormGroup;
  editId: number | null = null;
  isEditMode = false;

  private modalInstance: any;

  constructor(
    private fb: FormBuilder,
    private employeService: EmployeService,
    private categorieService: CategorieService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.load();
  }

  private initForm(): void {
    this.form = this.fb.group({
      nom:         ['', [Validators.required, Validators.minLength(2)]],
      prenom:      ['', [Validators.required, Validators.minLength(2)]],
      email:       ['', [Validators.required, Validators.email]],
      password:    ['', Validators.minLength(4)],
      role:        ['EMPLOYE', Validators.required],
      categorieId: [null]
    });
  }

  private load(): void {
    this.loading = true;
    this.employeService.getAll().subscribe({
      next: (data) => { this.employes = data; this.loading = false; },
      error: () => { this.errorMsg = 'Erreur de chargement'; this.loading = false; }
    });
    this.categorieService.getAll().subscribe({
      next: (data) => this.categories = data
    });
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.editId     = null;
    this.form.reset({ role: 'EMPLOYE', categorieId: null });
    this.form.get('password')?.setValidators([Validators.required, Validators.minLength(4)]);
    this.form.get('password')?.updateValueAndValidity();
    this.showModal();
  }

  openEditModal(employe: Employe): void {
    this.isEditMode = true;
    this.editId     = employe.id;
    this.form.patchValue({
      nom: employe.nom, prenom: employe.prenom,
      email: employe.email, role: employe.role,
      categorieId: employe.categorieId
    });
    // Mot de passe optionnel en modification
    this.form.get('password')?.clearValidators();
    this.form.get('password')?.setValue('');
    this.form.get('password')?.updateValueAndValidity();
    this.showModal();
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const payload: EmployeInput = this.form.value;

    const request$ = this.isEditMode
      ? this.employeService.update(this.editId!, payload)
      : this.employeService.create(payload);

    request$.subscribe({
      next: () => {
        this.hideModal();
        this.load();
        this.successMsg = `Employé ${this.isEditMode ? 'modifié' : 'créé'} avec succès`;
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMsg = err.error?.error ?? 'Erreur lors de la sauvegarde';
      }
    });
  }

  delete(id: number): void {
    if (!confirm('Supprimer cet employé ?')) return;
    this.employeService.delete(id).subscribe({
      next: () => {
        this.employes = this.employes.filter(e => e.id !== id);
        this.successMsg = 'Employé supprimé';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMsg = err.error?.error ?? 'Erreur de suppression';
      }
    });
  }

  private showModal(): void {
    const el = document.getElementById('employeModal');
    if (el) {
      this.modalInstance = new bootstrap.Modal(el);
      this.modalInstance.show();
    }
  }

  private hideModal(): void {
    this.modalInstance?.hide();
  }

  get f() { return this.form.controls; }
}