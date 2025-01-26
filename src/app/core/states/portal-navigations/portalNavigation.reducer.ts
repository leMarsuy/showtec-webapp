import { Config } from '@app/core/models/config.model';
import { createReducer, on } from '@ngrx/store';
import { PortalNavigationActions } from './portalNavigation.actions';

export const initialState: Readonly<Config> = {} as Config;

export const portalNavigationReducer = createReducer<any>(
  initialState,
  on(
    PortalNavigationActions.setPortalNavigationConfig,
    (_state, config): Config => ({ ..._state, ...config }),
  ),
  on(
    PortalNavigationActions.removePortalNavigationConfig,
    (): Config => ({}) as Config,
  ),
);
