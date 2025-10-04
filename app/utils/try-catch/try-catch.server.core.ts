import { DrizzleQueryError } from "drizzle-orm/errors";

const ERROR_KINDS = {
  DatabaseError: "database_error",
  RuntimeError: "runtime_error",
} as const;

export const tryCatch = async <TResult>(
  asyncOperation: (() => Promise<TResult>) | Promise<TResult>,
) => {
  try {
    const data = await (typeof asyncOperation === "function"
      ? asyncOperation()
      : asyncOperation);

    const successResponse = {
      ok: true,
      data,
    } as const;

    return successResponse;
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      const databaseErrorResponse = {
        error,
        kind: ERROR_KINDS.DatabaseError,
        ok: false,
      } as const;

      return databaseErrorResponse;
    }

    const handledError =
      error instanceof Error
        ? error
        : new Error("An unknown error occurred.", {
            cause: error,
          });

    const runtimeErrorResponse = {
      error: handledError,
      kind: ERROR_KINDS.RuntimeError,
      ok: false,
    } as const;

    return runtimeErrorResponse;
  }
};
