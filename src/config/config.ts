import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve(
    process.env.NODE_ENV === 'production' //
      ? '.env.production'
      : process.env.NODE_ENV === 'local_production'
      ? '.env.local_production'
      : '.env.development',
  ),
});

function required(key: string, defaultValue = ''): string {
  if (!process.env[key] && typeof defaultValue === 'undefined') {
    throw new Error('Missing required environment variable: ' + key);
  }
  return process.env[key] || defaultValue;
}

export const config = {
  NODE_ENV: required('NODE_ENV'),
  PORT: parseInt(required('PORT')),
  MYSQL: {
    HOST: required('MYSQL_HOST'),
    PORT: required('MYSQL_PORT'),
    USER: required('MYSQL_USER'),
    PASSWORD: required('MYSQL_PASSWORD'),
  },
  ADMIN_ACCESS_KEY: required('ADMIN_ACCESS_KEY'),
  JWT: {
    ACCESS_KEY: required('JWT_ACCESS_KEY'),
    ACCESS_KEY_EXPIRED_IN: required('JWT_ACCESS_KEY_EXPIRED_IN'),
    REFRESH_KEY: required('JWT_REFRESH_KEY'),
    REFRESH_KEY_EXPIRED_IN: required('JWT_REFRESH_KEY_EXPIRED_IN'),
  },
};
