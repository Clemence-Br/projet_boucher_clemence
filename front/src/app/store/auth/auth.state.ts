import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AuthStateModel, UserProfile } from './auth.model';
import { Login, Logout } from './auth.actions';

const DEFAULTS: AuthStateModel = {
  user: null,
  isAuthenticated: false,
};

@State<AuthStateModel>({
  name: 'auth',
  defaults: DEFAULTS,
})
@Injectable()
export class AuthState {
  @Selector()
  static user(state: AuthStateModel): UserProfile | null {
    return state.user;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return state.isAuthenticated;
  }

  @Selector()
  static username(state: AuthStateModel): string {
    return state.user?.nom ?? '';
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, { payload }: Login): void {
    ctx.patchState({
      user: { id: Date.now(), email: payload.email, nom: payload.nom, role: 'user' },
      isAuthenticated: true,
    });
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>): void {
    ctx.setState(DEFAULTS);
  }
}
