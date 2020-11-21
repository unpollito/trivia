export class NoResultFoundException extends Error {
  constructor(message = "") {
    super(message);
    this.name = "NoResultFoundException";
  }
}

export const isNoResultFoundException = (error: Error) => {
  return error.name === "NoResultFoundException";
};
