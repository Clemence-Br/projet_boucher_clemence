import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { environment } from '../environments/environment';
import { mockBackendInterceptor } from './interceptors/mock-backend';

import { routes } from './app.routes';
import { provideStore } from '@ngxs/store';
import { AuthState } from './store/auth/auth.state';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors(
        environment.mock.users || environment.mock.pollutions ? [mockBackendInterceptor] : [],
      ),
    ),
    provideStore([AuthState], withNgxsStoragePlugin({ keys: ['auth'] })),
  ],
};
