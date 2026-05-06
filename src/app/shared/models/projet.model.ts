export type StatutProjet = 'EN_COURS' | 'TERMINE' | 'EN_ATTENTE';

export interface Projet {
  id: number;
  nom: string;
  description: string;
  budget: number;
  statut: StatutProjet;
  nombreEmployes: number;
}

export interface ProjetInput {
  nom: string;
  description?: string;
  budget?: number;
  statut: StatutProjet;
}