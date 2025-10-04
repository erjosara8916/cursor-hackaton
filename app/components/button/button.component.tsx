import { Button as AriaButton } from "react-aria-components";

import { Spinner } from "#/components/spinner/spinner.component";
import { cn } from "#/utils/classnames/classnames.core";

type ButtonProps = React.ComponentProps<typeof AriaButton>;

export const Button = (props: ButtonProps) => {
  const { children, className } = props;

  const buttonClasses = cn("btn", className);

  return (
    <AriaButton {...props} className={buttonClasses}>
      {(renderProps) => (
        <>
          {renderProps.isPending ? <Spinner /> : null}

          {typeof children === "function" ? children(renderProps) : children}
        </>
      )}
    </AriaButton>
  );
};
