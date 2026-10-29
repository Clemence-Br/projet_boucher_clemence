export const environment = {
  production: true,
  mock: {
    auth: true,
    pollutions: false,
  },
  apiUrl: 'https://pollution-api-immg.onrender.com', // URL de l'API backend
  endpoints: {
    signUp: '/auth/signup',
    pollutions: '/pollutions',
  },
};
