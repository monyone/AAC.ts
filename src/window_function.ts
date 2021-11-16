export const KBD_WINDOW = (n: number) => {
  return [];
}

export const SIN_WINDOW = (n: number) => {
  const result: number[] = [];
  for (let i = 0; i < n; i++) {
    result.push(Math.sin(Math.PI / n * (i + 0.5)));
  }
  return result;
}
