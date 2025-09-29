export const envConfig = () => ({
  app: {
    port: parseInt(process.env.APP_PORT || '3000', 10),
    env: process.env.NODE_ENV || 'development',
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'authuser',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'user-login-db',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expiration: process.env.JWT_EXPIRATION || '24h',
  },
  bcrypt: {
    saltRounds: parseInt(process.env.SALT_ROUNDS || '10', 10),
  },
});