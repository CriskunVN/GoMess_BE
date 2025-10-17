declare namespace NodeJS {
  interface ProcessEnv {
    JWT_SECRET_KEY: string;
    JWT_EXPIRES_IN?: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRES_IN?: string;
  }
}
