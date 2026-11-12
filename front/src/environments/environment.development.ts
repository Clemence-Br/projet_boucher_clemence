export const environment = {
  production: false,
  mock: {
    pollutions: false,
    users: false,
  },
  apiUrl: 'http://localhost:3000/api', // URL de l'API backend
  endpoints: {
    users: '/users',
    login: '/users/login',
    pollutions: '/pollutions',
  },
};
