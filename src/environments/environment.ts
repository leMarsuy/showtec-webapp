import { commonEnv } from './environment.common';

const env = {
  ENVIRONMENT_NAME: 'development',
  PRODUCTION: false,
  API_URL: 'http://localhost:3500/api/v1',
};

export const enviroment = {
  ...commonEnv,
  ...env,
};
