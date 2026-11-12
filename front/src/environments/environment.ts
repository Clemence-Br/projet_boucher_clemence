export const environment = {
  production: true,
  mock: {
    pollutions: false,
    users: false,
  },
  apiUrl: 'https://pollution-api-immg.onrender.com/api', // URL de l'API backend
  endpoints: {
    users: '/users',
    login: '/users/login',
    pollutions: '/pollutions',
  },
};
