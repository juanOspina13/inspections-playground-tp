import type { IAppConfig } from './models/AppConfig.interface';
import configDev from './config-files/config.dev.json';
import configProd from './config-files/config.prod.json';

const configFilesMap = new Map<string, IAppConfig>([
  ['dev', configDev as unknown as IAppConfig],
  ['prod', configProd as unknown as IAppConfig],
]);

export const getConfigFile = (): IAppConfig => {
  const envKey = import.meta.env.VITE_CONFIG_KEY || 'dev';
  return configFilesMap.get(envKey) || (configDev as unknown as IAppConfig);
};

export const appConfig = getConfigFile();
