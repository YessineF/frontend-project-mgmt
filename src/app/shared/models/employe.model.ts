export interface Employe {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYE';
  categorieId: number | null;
  categorieNom: string | null;
}

export interface EmployeInput {
  nom: string;
  prenom: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'EMPLOYE';
  categorieId: number | null;
}