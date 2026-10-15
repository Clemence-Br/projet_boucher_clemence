export const POLLUTION_TYPES = [
  'Plastique',
  'Chimique',
  'Dépôt sauvage',
  'Eau',
  'Air',
  'Autre',
] as const;

export type PollutionType = (typeof POLLUTION_TYPES)[number];

export interface Pollution {
  id?: number;
  title: string;
  type: PollutionType;
  description: string;
  observationDate: string;
  location: string;
  latitude: number;
  longitude: number;
  photoUrl: string | null;
}