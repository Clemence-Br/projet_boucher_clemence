export const POLLUTION_TYPES = [
  'Plastique',
  'Chimique',
  'Dépôt sauvage',
  'Eau',
  'Air',
  'Autre',
] as const;

export type PollutionType = (typeof POLLUTION_TYPES)[number];

/** Indice de dangerosité : de 0 à MAX_DANGER_INDEX */
export const MAX_DANGER_INDEX = 150;

export type PollutionLevel = 'Faible' | 'Modérée' | 'Élevée' | 'Dangereuse';

export function getPollutionLevel(index: number | null | undefined): PollutionLevel | null {
  if (index === null || index === undefined || Number.isNaN(index)) return null;
  if (index <= 20) return 'Faible';
  if (index <= 50) return 'Modérée';
  if (index <= 100) return 'Élevée';
  return 'Dangereuse';
}

export interface PollutionData {
  title: string;
  type: PollutionType;
  description: string;
  observationDate: string;
  location: string;
  latitude: number;
  longitude: number;
  dangerIndex: number;
  photoUrl: string | null;
}

// Enregistré côté backend
export interface Pollution extends PollutionData {
  id: number;
}
