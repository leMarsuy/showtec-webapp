import { commonEnv } from './environment.common';

const env = {
  ENVIRONMENT_NAME: 'staging',
  PRODUCTION: false,
  API_URL: '',
};

export const environment = {
  ...commonEnv,
  ...env,
};
