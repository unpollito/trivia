import { Client } from "pg";

export interface RandomSortParams {
  random: true;
}

export abstract class BaseDao {
  constructor(protected client: Client) {}
}
