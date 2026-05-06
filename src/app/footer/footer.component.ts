import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer bg-dark text-white-50 text-center py-3 mt-auto">
      <div class="container">
        <small>
          <i class="bi bi-code-slash me-1"></i>
          Gestion de Projets &copy; {{ currentYear }}
        </small>
      </div>
    </footer>
  `,
  styles: [`
    .footer { font-size: 0.85rem; }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}