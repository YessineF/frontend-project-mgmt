import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CategorieService } from '../../../core/services/categorie.service';
import { Categorie } from '../../../shared/models/categorie.model';

declare var bootstrap: any;

@Component({ selector: 'app-categories', templateUrl: './categories.component.html' })
export class CategoriesComponent implements OnInit {

  categories: Categorie[] = [];
  loading = false; errorMsg = ''; successMsg = '';
  form!: FormGroup;
  editId: number | null = null;
  isEditMode = false;
  private modalInstance: any;

  constructor(private fb: FormBuilder, private categorieService: CategorieService) {}

  ngOnInit(): void {
    this.form = this.fb.group({ nom: ['', [Validators.required, Validators.minLength(2)]] });
    this.load();
  }

  private load(): void {
    this.loading = true;
    this.categorieService.getAll().subscribe({
      next: d => { this.categories = d; this.loading = false; },
      error: () => { this.errorMsg = 'Erreur de chargement'; this.loading = false; }
    });
  }

  openCreate(): void {
    this.isEditMode = false; this.editId = null;
    this.form.reset(); this.showModal();
  }

  openEdit(c: Categorie): void {
    this.isEditMode = true; this.editId = c.id;
    this.form.patchValue({ nom: c.nom }); this.showModal();
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const req$ = this.isEditMode
      ? this.categorieService.update(this.editId!, this.form.value)
      : this.categorieService.create(this.form.value);
    req$.subscribe({
      next: () => {
        this.hideModal(); this.load();
        this.successMsg = `Catégorie ${this.isEditMode ? 'modifiée' : 'créée'}`;
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err: HttpErrorResponse) => { this.errorMsg = err.error?.error ?? 'Erreur'; }
    });
  }

  delete(id: number): void {
    if (!confirm('Supprimer cette catégorie ?')) return;
    this.categorieService.delete(id).subscribe({
      next: () => {
        this.categories = this.categories.filter(c => c.id !== id);
        this.successMsg = 'Catégorie supprimée';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err: HttpErrorResponse) => { this.errorMsg = err.error?.error ?? 'Erreur'; }
    });
  }

  private showModal(): void {
    this.errorMsg = '';
    const el = document.getElementById('catModal');
    if (el) { this.modalInstance = new bootstrap.Modal(el); this.modalInstance.show(); }
  }
  private hideModal(): void { this.modalInstance?.hide(); }
  get f() { return this.form.controls; }
}