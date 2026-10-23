export const environment = {
  production: true,
  useMock: true, // on utilise les mocks en attendant que le backend soit fait
  apiUrl: '', // URL de l'API backend
  endpoints: {
    signUp: '/auth/signup',
    pollutions: '/pollutions',
  },
};
