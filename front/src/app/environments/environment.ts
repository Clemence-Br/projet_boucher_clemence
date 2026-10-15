// src/environments/environment.development.ts
export const environment = {
  production: false,
  useMock: true,
  apiUrl: 'http://localhost:3000/api', // URL de l'API backend
  endpoints: {
    signUp: '/auth/signup',
  },
};
