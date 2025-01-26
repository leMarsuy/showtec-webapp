import { portalNavigationReducer } from './portal-navigations';
import { userReducer } from './user/user.reducer';

export const appState = {
  user: userReducer,
  portalNavigation: portalNavigationReducer,
};
