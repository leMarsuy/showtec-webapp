import { User } from '@app/core/models/user.model';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectUser = () => createFeatureSelector<Readonly<User>>('user');
