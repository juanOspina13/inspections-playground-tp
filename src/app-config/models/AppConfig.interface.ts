export interface IAppConfig {
  global: {
    version: number;
    production: boolean;
    api: string;
    basePath: string;
    inactivityAutoLogoutTime: number;
    inactivityWarningTime: number;
  };
}
