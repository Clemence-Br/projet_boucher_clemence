import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { delay, map, of, timer } from 'rxjs';
import { environment } from '../../environments/environment';
import { SignUpRequest, SignUpResponse } from '../models/auth';
import { Pollution, PollutionData } from '../models/pollution';

const SIGN_UP_URL = `${environment.apiUrl}${environment.endpoints.signUp}`;
const POLLUTIONS_URL = `${environment.apiUrl}${environment.endpoints.pollutions}`;
const MOCK_DELAY_MS = 500;

// Données de test pour simuler le backend
let pollutions: Pollution[] = [
  {
    id: 1,
    title: 'Déchets plastiques sur la plage',
    type: 'Plastique',
    description: 'Bouteilles et sacs plastiques échoués sur environ 200 m de plage.',
    observationDate: '2026-09-14',
    location: 'Plage de Palavas-les-Flots',
    latitude: 43.5282,
    longitude: 3.9275,
    photoUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK85W8DjwKFXfD-AEn6FA5kviBlFTSmF2pUPQCfMiIPQ&s=10',
  },
  {
    id: 2,
    title: 'Rejet suspect dans la rivière',
    type: 'Chimique',
    description: "Nappe irisée et odeur d'hydrocarbures près du pont.",
    observationDate: '2026-10-02',
    location: "Quai de l'Ill, Strasbourg",
    latitude: 48.5734,
    longitude: 7.7521,
    photoUrl: null,
  },
  {
    id: 3,
    title: 'Dépôt sauvage en forêt',
    type: 'Dépôt sauvage',
    description: 'Gravats, électroménager et pneus déposés en bordure de chemin.',
    observationDate: '2026-08-21',
    location: 'Forêt de la Robertsau, Strasbourg',
    latitude: 48.6053,
    longitude: 7.7924,
    photoUrl: null,
  },
  {
    id: 4,
    title: "Fumées épaisses près de l'usine",
    type: 'Air',
    description: 'Panache de fumée noire visible depuis plusieurs minutes.',
    observationDate: '2026-10-15',
    location: 'Zone industrielle du Port du Rhin',
    latitude: 48.5612,
    longitude: 7.8068,
    photoUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9mO2ts0hlilUDyTfYAhQ-D2cmRvx0HLl49EDV64rZjw&s=10',
  },
  {
    id: 5,
    title: 'Mousse blanche sur le canal',
    type: 'Eau',
    description:
      "Importante couche de mousse blanche sur plus de 50 m, avec poissons morts en surface. Rejet probable d'une station de lavage.",
    observationDate: '2026-09-28',
    location: 'Canal de la Marne au Rhin, Schiltigheim',
    latitude: 48.6075,
    longitude: 7.7469,
    photoUrl: null,
  },
  {
    id: 6,
    title: 'Fûts métalliques abandonnés',
    type: 'Chimique',
    description:
      "Une dizaine de fûts rouillés, certains percés, avec écoulement d'un liquide huileux dans le fossé voisin.",
    observationDate: '2026-10-08',
    location: 'Chemin rural, Entzheim',
    latitude: 48.5453,
    longitude: 7.6381,
    photoUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZjthGg2_AsIl3M8zKW8tpt52q-oq9XtRF2x5n-86Vrw&s=10',
  },
  {
    id: 7,
    title: 'Sacs poubelle éventrés en bord de route',
    type: 'Dépôt sauvage',
    description:
      'Une trentaine de sacs ouverts par les animaux, déchets dispersés sur 100 m le long de la départementale.',
    observationDate: '2026-10-19',
    location: 'D1004, sortie de Brumath',
    latitude: 48.7313,
    longitude: 7.7167,
    photoUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5EStRlsAxsFbqaiPTo0s8vH3nYUZQwX4HrkJ_bbz6tQ&s=10',
  },
  {
    id: 8,
    title: 'Microplastiques sur la berge du Rhin',
    type: 'Plastique',
    description:
      'Accumulation de granulés plastiques et de fragments de polystyrène dans le sable, sur toute la largeur de la berge.',
    observationDate: '2026-10-21',
    location: 'Berges du Rhin, Kehl',
    latitude: 48.5728,
    longitude: 7.8164,
    photoUrl: null,
  },
];
let nextId = pollutions.length + 1;

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  // Inscription : renvoie les données reçues (sans mot de passe) avec un id
  if (environment.mock.auth && req.method === 'POST' && req.url === SIGN_UP_URL) {
    const { password, ...data } = req.body as SignUpRequest;
    const response: SignUpResponse = { id: Date.now(), ...data };
    return of(new HttpResponse({ status: 201, body: response })).pipe(delay(800));
  }

  // CRUD des pollutions : /pollutions et /pollutions/:id
  if (
    environment.mock.pollutions &&
    (req.url === POLLUTIONS_URL || req.url.startsWith(`${POLLUTIONS_URL}/`))
  ) {
    // Si le handler lance une erreur, `map` la transforme en erreur de l'Observable
    return timer(MOCK_DELAY_MS).pipe(map(() => handlePollutions(req)));
  }

  return next(req);
};

function handlePollutions(req: HttpRequest<unknown>): HttpResponse<unknown> {
  const path = req.url.slice(POLLUTIONS_URL.length); // "" ou "/3"
  const id = path ? Number(path.slice(1)) : null;
  const index = id === null ? -1 : pollutions.findIndex((p) => p.id === id);

  const notFound = () => new HttpErrorResponse({ status: 404, url: req.url });

  switch (req.method) {
    case 'GET':
      if (id === null) return new HttpResponse({ status: 200, body: [...pollutions] });
      if (index === -1) throw notFound();
      return new HttpResponse({ status: 200, body: pollutions[index] });

    case 'POST': {
      const created: Pollution = { ...(req.body as PollutionData), id: nextId++ };
      pollutions = [...pollutions, created];
      return new HttpResponse({ status: 201, body: created });
    }

    case 'PUT': {
      if (index === -1) throw notFound();
      const updated: Pollution = { ...(req.body as PollutionData), id: id! };
      pollutions = pollutions.map((p) => (p.id === id ? updated : p));
      return new HttpResponse({ status: 200, body: updated });
    }

    case 'DELETE':
      if (index === -1) throw notFound();
      pollutions = pollutions.filter((p) => p.id !== id);
      return new HttpResponse({ status: 204, body: null });

    default:
      throw new HttpErrorResponse({ status: 405, url: req.url });
  }
}
