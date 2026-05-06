import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CurrentUser } from '../../../shared/models/auth.model';

@Component({ selector: 'app-profil', templateUrl: './profil.component.html' })
export class ProfilComponent implements OnInit {
  user: CurrentUser | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
  }
}