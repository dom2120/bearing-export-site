export const appConfig = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  databaseUrl: process.env.DATABASE_URL || '',
  adminToken: process.env.ADMIN_TOKEN || 'admin123',
  nodeEnv: (process.env.NODE_ENV as 'development' | 'production') || 'development',
};
