import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { delay, map, of, timer } from 'rxjs';
import { environment } from '../../environments/environment';
import { Credentials, User, UserCreate } from '../models/user';
import { Pollution, PollutionData } from '../models/pollution';

const USERS_URL = `${environment.apiUrl}${environment.endpoints.users}`;
const LOGIN_URL = `${environment.apiUrl}${environment.endpoints.login}`;
const POLLUTIONS_URL = `${environment.apiUrl}${environment.endpoints.pollutions}`;
const MOCK_DELAY_MS = 500;

// ===================== Utilisateurs =====================

let users: User[] = [
  { id: 1, login: 'admin', nom: 'Admin', prenom: 'Test', email: 'admin@example.com' },
];
let nextUserId = 2;

// login -> mot de passe (jamais renvoyé, comme l'API). Compte de départ : admin / admin
const passwords = new Map<string, string>([['admin', 'admin']]);

// ===================== Pollutions =====================

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
    photoUrl: 'https://picsum.photos/seed/pollution5/600/300',
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
    photoUrl: 'https://picsum.photos/seed/pollution6/600/300',
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
    photoUrl: 'https://picsum.photos/seed/pollution7/600/300',
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
    photoUrl: 'https://picsum.photos/seed/pollution8/600/300',
  },
];
let nextPollutionId = pollutions.length + 1;

// ===================== Intercepteur =====================

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  // --- Connexion ---
  if (environment.mock.users && req.method === 'POST' && req.url === LOGIN_URL) {
    return timer(MOCK_DELAY_MS).pipe(map(() => handleLogin(req)));
  }

  // --- Utilisateurs : liste et création ---
  if (environment.mock.users && req.url === USERS_URL) {
    if (req.method === 'GET') {
      return of(new HttpResponse({ status: 200, body: [...users] })).pipe(delay(MOCK_DELAY_MS));
    }
    if (req.method === 'POST') {
      return timer(800).pipe(map(() => handleCreateUser(req)));
    }
  }

  // --- Pollutions : /pollutions et /pollutions/:id ---
  if (
    environment.mock.pollutions &&
    (req.url === POLLUTIONS_URL || req.url.startsWith(`${POLLUTIONS_URL}/`))
  ) {
    return timer(MOCK_DELAY_MS).pipe(map(() => handlePollutions(req)));
  }

  // Tout le reste part vers la vraie API
  return next(req);
};

// ===================== Handlers : utilisateurs =====================

function handleLogin(req: HttpRequest<unknown>): HttpResponse<User> {
  const { login, password } = req.body as Credentials;
  const user = users.find((u) => u.login === login);

  if (!user || passwords.get(login) !== password) {
    throw new HttpErrorResponse({
      status: 401,
      url: req.url,
      error: { message: 'Login ou mot de passe incorrect.' },
    });
  }
  return new HttpResponse({ status: 200, body: user });
}

function handleCreateUser(req: HttpRequest<unknown>): HttpResponse<User> {
  const { password, ...data } = req.body as UserCreate;

  const taken = users.some(
    (u) => u.login === data.login || u.email.toLowerCase() === data.email.toLowerCase(),
  );
  if (taken) {
    throw new HttpErrorResponse({
      status: 409,
      url: req.url,
      error: { message: 'Ce login ou cet email est déjà utilisé.' },
    });
  }

  const created: User = { id: nextUserId++, ...data };
  users = [...users, created];
  passwords.set(data.login, password);

  return new HttpResponse({ status: 201, body: created });
}

// ===================== Handler : pollutions =====================

function handlePollutions(req: HttpRequest<unknown>): HttpResponse<unknown> {
  const path = req.url.slice(POLLUTIONS_URL.length); // "" ou "/3"
  const id = path ? Number(path.slice(1)) : null;
  const index = id === null ? -1 : pollutions.findIndex((p) => p.id === id);

  const notFound = () =>
    new HttpErrorResponse({
      status: 404,
      url: req.url,
      error: { message: 'Cette pollution est introuvable.' },
    });

  switch (req.method) {
    case 'GET':
      if (id === null) return new HttpResponse({ status: 200, body: [...pollutions] });
      if (index === -1) throw notFound();
      return new HttpResponse({ status: 200, body: pollutions[index] });

    case 'POST': {
      const created: Pollution = { ...(req.body as PollutionData), id: nextPollutionId++ };
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
