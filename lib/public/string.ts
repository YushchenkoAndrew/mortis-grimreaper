export function CapitalizeString([first, ...rest]: string) {
  return first.toUpperCase() + rest.join("");
}
