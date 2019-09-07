// Resolve a value after a delay.
export const resolveAfter = (value: any, after: number): Promise<any> =>
  new Promise((resolve) => setTimeout(() => resolve(value), after));
