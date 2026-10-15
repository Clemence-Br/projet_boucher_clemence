export interface SignUpRequest {
  login: string;
  nom: string;
  prenom: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  id: number;
  login: string;
  nom: string;
  prenom: string;
  email: string;
}
