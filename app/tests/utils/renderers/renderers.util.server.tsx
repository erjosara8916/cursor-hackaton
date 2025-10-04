import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";

export const renderComponentWithRouter = (
  ...args: Parameters<typeof createRoutesStub>
) => {
  const user = userEvent.setup();

  const RoutesStub = createRoutesStub(...args);

  return {
    ...render(<RoutesStub />),
    user,
  };
};

export const renderComponent = (jsx: React.ReactNode) => {
  const user = userEvent.setup();

  return {
    ...render(jsx),
    user,
  };
};
