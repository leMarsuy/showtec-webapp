import { User } from '@app/core/models/user.model';
import { createActionGroup, props } from '@ngrx/store';

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    'Set User': props<User>(),
    'Remove User': props<Partial<User>>(),
  },
});
