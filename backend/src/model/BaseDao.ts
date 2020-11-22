import { Client } from "pg";

export interface RandomSortParams {
  random: true;
}

export interface CustomSortParams<T> {
  random: false;
  fields: { name: keyof T; isAscending: boolean }[];
}

export type QuerySortParams<T> = RandomSortParams | CustomSortParams<T>;

export abstract class BaseDao<T> {
  constructor(protected client: Client) {}

  protected getOrderByString(sort: QuerySortParams<T>): string {
    let orderBy = "ORDER BY RANDOM()";
    if (!sort.random) {
      if (sort.fields.length > 0) {
        const orderByFieldString = sort.fields
          .map((field) => {
            return field.isAscending
              ? field.name
              : `${field.name as string} DESC`;
          })
          .join(", ");
        orderBy = `ORDER BY ${orderByFieldString}`;
      } else {
        orderBy = "";
      }
    }
    return orderBy;
  }
}
