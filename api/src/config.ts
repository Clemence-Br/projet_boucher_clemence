export interface DatabaseConfig {
  host: string;
  port: string;
  user: string;
  password: string;
  bdname: string;
}

export interface AppConfig {
  BDD: DatabaseConfig;
}

export const config: AppConfig = {
  BDD: {
    host:
      process.env.DB_HOST ||
      "dpg-dbhl800n74is73ebjb20-a.oregon-postgres.render.com",
    port: process.env.DB_PORT || "5432",
    user: process.env.DB_USER || "pollution_user",
    password: process.env.DB_PASSWORD || "ro2spP6QyIAX9D5ppWjOaiPSsOzDFiU6",
    bdname: process.env.DB_NAME || "pollution_db_nnqz",
  },
};

export const { BDD } = config;
export default config;
