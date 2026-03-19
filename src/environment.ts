interface EnvironmentConfig {
  production: boolean;
  baseUrl: string;
}

const environments: Record<string, EnvironmentConfig> = {
  dev: {
    production: false,
    baseUrl: 'http://localhost:3000',
  },
  prod: {
    production: true,
    baseUrl: 'https://api.inspections.com',
  },
};

export const getEnvironment = (): EnvironmentConfig => {
  const env = import.meta.env.VITE_ENV || 'dev';
  return environments[env] || environments.dev;
};
