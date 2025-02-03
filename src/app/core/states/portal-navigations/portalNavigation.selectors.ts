import { Config } from '@app/core/models/config.model';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectPortalNavigationConfig = () =>
  createFeatureSelector<Readonly<Config>>('portalNavigation');
export const selectPortalNavigations = () =>
  createSelector(
    selectPortalNavigationConfig(),
    (state: Config) => state.data.navigations,
  );
