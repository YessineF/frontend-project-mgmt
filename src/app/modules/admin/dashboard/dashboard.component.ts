import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { forkJoin } from 'rxjs';
import { EmployeService }     from '../../../core/services/employe.service';
import { ProjetService }      from '../../../core/services/projet.service';
import { CategorieService }   from '../../../core/services/categorie.service';
import { AffectationService } from '../../../core/services/affectation.service';
import { Projet }             from '../../../shared/models/projet.model';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  today = new Date();
  loading = true;

  stats = {
    totalEmployes: 0,
    totalProjets: 0,
    totalCategories: 0,
    totalAffectations: 0,
    projetsEnCours: 0,
    projetsTermines: 0,
    projetsEnAttente: 0,
    budgetTotal: 0,
    budgetMoyen: 0
  };

  projetsRecents: Projet[] = [];

  private charts: Chart[] = [];

  constructor(
    private employeService: EmployeService,
    private projetService: ProjetService,
    private categorieService: CategorieService,
    private affectationService: AffectationService
  ) {}

  ngOnInit(): void {
    forkJoin({
      employes:     this.employeService.getAll(),
      projets:      this.projetService.getAll(),
      categories:   this.categorieService.getAll(),
      affectations: this.affectationService.getAll()
    }).subscribe({
      next: ({ employes, projets, categories, affectations }) => {
        this.stats.totalEmployes     = employes.length;
        this.stats.totalProjets      = projets.length;
        this.stats.totalCategories   = categories.length;
        this.stats.totalAffectations = affectations.length;

        this.stats.projetsEnCours    = projets.filter(p => p.statut === 'EN_COURS').length;
        this.stats.projetsTermines   = projets.filter(p => p.statut === 'TERMINE').length;
        this.stats.projetsEnAttente  = projets.filter(p => p.statut === 'EN_ATTENTE').length;

        const totalBudget = projets.reduce((sum, p) => sum + (p.budget || 0), 0);
        this.stats.budgetTotal = totalBudget;
        this.stats.budgetMoyen = projets.length ? Math.round(totalBudget / projets.length) : 0;

        this.projetsRecents = [...projets].slice(0, 5);
        this.loading = false;

        // Charts need the DOM — init in next tick
        setTimeout(() => this.initCharts(), 50);
      },
      error: () => { this.loading = false; }
    });
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.charts.forEach(c => c.destroy());
  }


  private initCharts(): void {
    this.createStatutBarChart();
    this.createBudgetDoughnut();
    this.createBudgetLineChart();
  }

  private createStatutBarChart(): void {
    const canvas = document.getElementById('statutChart') as HTMLCanvasElement;
    if (!canvas) return;

    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['En cours', 'Terminés', 'En attente'],
        datasets: [{
          label: 'Projets',
          data: [
            this.stats.projetsEnCours,
            this.stats.projetsTermines,
            this.stats.projetsEnAttente
          ],
          backgroundColor: [
            'rgba(59,130,246,0.85)',
            'rgba(16,185,129,0.85)',
            'rgba(245,158,11,0.85)'
          ],
          borderColor: [
            '#3b82f6',
            '#10b981',
            '#f59e0b'
          ],
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#f1f5f9',
            bodyColor: '#94a3b8',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.y} projet(s)`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: '#64748b', font: { family: 'Plus Jakarta Sans', size: 12 } }
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(226,232,240,0.6)' },
            border: { display: false, dash: [4, 4] },
            ticks: {
              color: '#64748b',
              font: { family: 'Plus Jakarta Sans', size: 11 },
              stepSize: 1
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private createBudgetDoughnut(): void {
    const canvas = document.getElementById('budgetChart') as HTMLCanvasElement;
    if (!canvas) return;

    const budgetEnCours   = this.projetsRecents
      .filter(p => p.statut === 'EN_COURS').reduce((s, p) => s + (p.budget||0), 0);
    const budgetTermine   = this.projetsRecents
      .filter(p => p.statut === 'TERMINE').reduce((s, p) => s + (p.budget||0), 0);
    const budgetEnAttente = this.projetsRecents
      .filter(p => p.statut === 'EN_ATTENTE').reduce((s, p) => s + (p.budget||0), 0);

    const chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['En cours', 'Terminés', 'En attente'],
        datasets: [{
          data: [budgetEnCours, budgetTermine, budgetEnAttente],
          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
          borderColor: '#ffffff',
          borderWidth: 3,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#64748b',
              font: { family: 'Plus Jakarta Sans', size: 11 },
              padding: 16,
              boxWidth: 10,
              boxHeight: 10,
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#f1f5f9',
            bodyColor: '#94a3b8',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.toLocaleString('fr')} DT`
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private createBudgetLineChart(): void {
    const canvas = document.getElementById('budgetLineChart') as HTMLCanvasElement;
    if (!canvas) return;

    const labels = this.projetsRecents.map(p => p.nom.length > 15 ? p.nom.slice(0,15)+'…' : p.nom);
    const data   = this.projetsRecents.map(p => p.budget || 0);

    const chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Budget (DT)',
          data,
          fill: true,
          borderColor: '#6366f1',
          backgroundColor: (ctx) => {
            const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 280);
            gradient.addColorStop(0, 'rgba(99,102,241,0.25)');
            gradient.addColorStop(1, 'rgba(99,102,241,0.02)');
            return gradient;
          },
          tension: 0.4,
          pointBackgroundColor: '#6366f1',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#f1f5f9',
            bodyColor: '#94a3b8',
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => ` ${(ctx.parsed.y ?? 0).toLocaleString('fr')} DT`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: '#64748b', font: { family: 'Plus Jakarta Sans', size: 11 } }
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(226,232,240,0.6)' },
            border: { display: false },
            ticks: {
              color: '#64748b',
              font: { family: 'Plus Jakarta Sans', size: 11 },
              callback: (v) => Number(v).toLocaleString('fr') + ' DT'
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }


  getPercent(statut: string): number {
    if (!this.stats.totalProjets) return 0;
    const count =
      statut === 'EN_COURS'   ? this.stats.projetsEnCours   :
      statut === 'TERMINE'    ? this.stats.projetsTermines  :
      statut === 'EN_ATTENTE' ? this.stats.projetsEnAttente : 0;
    return Math.round((count / this.stats.totalProjets) * 100);
  }

  getStatutClass(statut: string): string {
    const map: Record<string, string> = {
      'EN_COURS':   'badge-en-cours',
      'TERMINE':    'badge-termine',
      'EN_ATTENTE': 'badge-en-attente'
    };
    return map[statut] ?? '';
  }
}
