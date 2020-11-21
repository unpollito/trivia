import { Client } from "pg";

export const getDbClient = async () => {
  const client = new Client();
  await client.connect();
  return client;
};
