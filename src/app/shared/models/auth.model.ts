export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  token: string;
  email: string;
  nom: string;
  prenom: string;
  role: 'ADMIN' | 'EMPLOYE';
}

export interface CurrentUser {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: 'ADMIN' | 'EMPLOYE';
}