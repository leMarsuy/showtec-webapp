import { commonEnv } from './environment.common';

const env = {
  ENVIRONMENT_NAME: 'production',
  PRODUCTION: true,
  API_URL: 'https://sea-turtle-app-jwxg7.ondigitalocean.app/api/v1',
};

export const environment = {
  ...commonEnv,
  ...env,
};
