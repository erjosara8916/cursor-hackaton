import { z } from "zod/mini";

import type {
  MutationServiceArgs,
  QueryServiceArgs,
} from "./service-builder.types.server";
import {
  createInvalidInputsServiceResponse,
  createInvalidOutputServiceResponse,
  createRuntimeErrorServiceResponse,
  createSuccessfulServiceResponse,
} from "./utils/responses.server";

export const QUERY_SERVICE = async <TSuccessResponse>(
  args: QueryServiceArgs<TSuccessResponse>,
) => {
  const { getData, responseSchema } = args;

  try {
    const unsafeResponse = await getData();

    const validatedResponse = z.safeParse(responseSchema, unsafeResponse);

    if (!validatedResponse.success) {
      return createInvalidOutputServiceResponse(validatedResponse.error);
    }

    return createSuccessfulServiceResponse(validatedResponse.data);
  } catch (error) {
    const handledError =
      error instanceof Error
        ? error
        : new Error(
            "An unknown error occurred while trying to create a service.",
            {
              cause: error,
            },
          );

    return createRuntimeErrorServiceResponse(handledError);
  }
};

export const MUTATION_SERVICE = async <TSuccessResponse, TInputs>(
  args: MutationServiceArgs<TSuccessResponse, TInputs>,
) => {
  const { getData, inputs: unsafeInputs, inputsSchema, responseSchema } = args;

  try {
    const validatedInputs = z.safeParse(inputsSchema, unsafeInputs);

    if (!validatedInputs.success) {
      return createInvalidInputsServiceResponse(validatedInputs.error);
    }

    const unsafeResponse = await getData(validatedInputs.data);

    const validatedResponse = z.safeParse(responseSchema, unsafeResponse);

    if (!validatedResponse.success) {
      return createInvalidOutputServiceResponse(validatedResponse.error);
    }

    return createSuccessfulServiceResponse(validatedResponse.data);
  } catch (error) {
    const handledError =
      error instanceof Error
        ? error
        : new Error(
            "An unknown error occurred while trying to create a service.",
            {
              cause: error,
            },
          );

    return createRuntimeErrorServiceResponse(handledError);
  }
};
