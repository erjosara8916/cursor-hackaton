export class ErrorWithCode<TErrorCode extends string> extends Error {
  public override readonly name = "ErrorWithCode";
  public readonly code: TErrorCode;

  constructor(message: string, code: TErrorCode) {
    super(message);

    this.code = code;
  }
}

const isValidInstanceOfErrorWithCode = <TErrorCode extends string>(
  error: unknown,
): error is ErrorWithCode<TErrorCode> => {
  return error instanceof ErrorWithCode;
};

export const isInstanceOfErrorWithCode = <TErrorCode extends string>(
  error: unknown,
  errorCodes: TErrorCode[],
): error is ErrorWithCode<TErrorCode> => {
  if (!isValidInstanceOfErrorWithCode<TErrorCode>(error)) return false;

  return errorCodes.includes(error.code);
};
