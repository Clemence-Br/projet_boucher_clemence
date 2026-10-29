export const environment = {
  production: false,
  mock: {
    auth: true,
    pollutions: false,
  },
  apiUrl: 'http://localhost:3000/api', // URL de l'API backend
  endpoints: {
    signUp: '/auth/signup',
    pollutions: '/pollutions',
  },
};
