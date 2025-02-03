import { Config } from '@app/core/models/config.model';
import { createActionGroup, props } from '@ngrx/store';

export const PortalNavigationActions = createActionGroup({
  source: 'Config',
  events: {
    'Set Portal Navigation Config': props<Config>(),
    'Remove Portal Navigation Config': props<Partial<Config>>(),
  },
});
