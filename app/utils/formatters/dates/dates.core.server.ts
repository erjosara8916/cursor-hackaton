import { format, setDefaultOptions } from "date-fns";
import { es } from "date-fns/locale";

setDefaultOptions({
  locale: es,
  // ??? I want to handle this in a better way that allows me to localize the
  // app according to the user's IP location initially
});

type FormattedDatePattern = "dd MMM, yyyy";

const dateFormatter = (date: Date, pattern: FormattedDatePattern) =>
  format(date, pattern);

export const datesFormatter = {
  dates: dateFormatter,
};
