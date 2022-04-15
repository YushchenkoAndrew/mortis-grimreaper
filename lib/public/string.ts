export function CapitalizeString([first, ...rest]: string) {
  return first.toUpperCase() + rest.join("");
}

export function FormatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}
