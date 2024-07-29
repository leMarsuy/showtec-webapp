import { commonEnv } from './environment.common';

const env = {
  ENVIRONMENT_NAME: 'development',
  PRODUCTION: false,
  API_URL: 'https://sea-turtle-app-jwxg7.ondigitalocean.app/api/v1',
};

export const enviroment = {
  ...commonEnv,
  ...env,
};
