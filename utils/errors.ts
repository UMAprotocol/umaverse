export function errorFilter(value: unknown | Error): boolean {
  if (value instanceof Error) {
    // TODO: Have a proper error reporting mechanism
    console.log(`Errored at`);
    console.log(value);
    return false;
  }
  return true;
}
