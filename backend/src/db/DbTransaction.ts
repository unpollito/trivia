import { Client } from "pg";

export class DbTransaction<T> {
  constructor(
    private client: Client,
    private transactionFunction: () => Promise<T>
  ) {}

  public async run(): Promise<T> {
    try {
      await this.client.query("BEGIN");
      const result = await this.transactionFunction();
      await this.client.query("COMMIT");
      return result;
    } catch (e) {
      this.client.query("ROLLBACK");
      throw e;
    }
  }
}
