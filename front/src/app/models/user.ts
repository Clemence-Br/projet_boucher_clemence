// Envoyé à l'API
export interface UserCreate {
  login: string;
  nom: string;
  prenom: string;
  email: string;
  password: string;
}

// Renvoyé par l'API
export interface User {
  id: number;
  login: string;
  nom: string;
  prenom: string;
  email: string;
}

export interface Credentials {
  login: string;
  password: string;
}
