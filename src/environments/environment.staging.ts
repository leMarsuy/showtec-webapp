import { commonEnv } from './environment.common';

const env = {
  ENVIRONMENT_NAME: 'staging',
  PRODUCTION: false,
  API_URL: 'https://showtec-server-test-mlm5l.ondigitalocean.app/api/v1',
};

export const environment = {
  ...commonEnv,
  ...env,
};
