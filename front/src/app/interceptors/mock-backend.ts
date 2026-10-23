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
    photoUrl: null,
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
    photoUrl: 'https://picsum.photos/seed/pollution2/600/300',
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
    photoUrl: null,
  },
];
let nextId = pollutions.length + 1;

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  // Inscription : renvoie les données reçues (sans mot de passe) avec un id
  if (req.method === 'POST' && req.url === SIGN_UP_URL) {
    const { password, ...data } = req.body as SignUpRequest;
    const response: SignUpResponse = { id: Date.now(), ...data };
    return of(new HttpResponse({ status: 201, body: response })).pipe(delay(800));
  }

  // CRUD des pollutions : /pollutions et /pollutions/:id
  if (req.url === POLLUTIONS_URL || req.url.startsWith(`${POLLUTIONS_URL}/`)) {
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
