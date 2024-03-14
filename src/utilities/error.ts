export class ErrorResponse extends Error {
  status: number;
  testing: string;
  errorResults?: [any];

  constructor(message, status, errorResults = undefined) {
    super(message);
    this.status = status;
    this.errorResults = errorResults;
  }
}

export const getErrorMessage = (errors: object, errorKeys: string[]) => {
  const filteredKey = errorKeys.filter((key, index) => {
    if (errors[key]?.message) {
      return key;
    }
  })[0];

  return errors[filteredKey]?.message;
};
