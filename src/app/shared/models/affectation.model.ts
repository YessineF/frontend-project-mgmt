export interface Affectation {
  id: number;
  employeId: number;
  employeNom: string;
  employePrenom: string;
  projetId: number;
  projetNom: string;
  dateDebut: string;
  dateFin: string | null;
}

export interface AffectationInput {
  employeId: number;
  projetId: number;
  dateDebut: string;
  dateFin?: string | null;
}