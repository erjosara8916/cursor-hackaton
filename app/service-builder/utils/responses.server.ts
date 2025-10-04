import type { z } from "zod/mini";

const SERVICE_STATUS_CODES = {
  Error: "ERROR",
  Success: "SUCCESS",
} as const;

const SERVICE_ERROR_CODES = {
  InvalidInputs: "INVALID_INPUTS",
  InvalidOutput: "INVALID_OUTPUT",
  RuntimeError: "RUNTIME_ERROR",
} as const;

type ServiceErrorCode =
  (typeof SERVICE_ERROR_CODES)[keyof typeof SERVICE_ERROR_CODES];

// Successful responses ========================================================
export const createSuccessfulServiceResponse = <TServiceOutput>(
  data: TServiceOutput,
) => {
  return {
    data,
    status: SERVICE_STATUS_CODES.Success,
  } as const;
};

// Error responses =============================================================
const baseErrorResponse = <
  TServiceErrorCode extends ServiceErrorCode,
  TErrorContext extends Record<string, unknown>,
>(
  code: TServiceErrorCode,
  errorContext: TErrorContext,
) => {
  return {
    ...errorContext,
    code,
    status: SERVICE_STATUS_CODES.Error,
  } as const;
};

export const createInvalidInputsServiceResponse = <TInputs>(
  invalidInputs: z.core.$ZodError<TInputs>,
) => {
  return baseErrorResponse(SERVICE_ERROR_CODES.InvalidInputs, {
    inputs: invalidInputs,
  });
};

export const createInvalidOutputServiceResponse = <TOutput>(
  invalidOutput: z.core.$ZodError<TOutput>,
) => {
  return baseErrorResponse(SERVICE_ERROR_CODES.InvalidOutput, {
    response: invalidOutput,
  });
};

export const createRuntimeErrorServiceResponse = (error: Error) => {
  return baseErrorResponse(SERVICE_ERROR_CODES.RuntimeError, {
    error,
  });
};
