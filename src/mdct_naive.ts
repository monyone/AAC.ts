export const imdct = (frequencies: number[]) => {
  const n = frequencies.length;
  const samples: number[] = [];
  for (let i = 0; i < 2 * n; i++) { samples.push(0); }

  for (let i = 0; i < 2 * n; i++) {
    for (let k = 0; k < n; k++) {
      samples[i] += frequencies[k] * Math.cos(Math.PI / n * (i + (1 + n) / 2) * (k + 0.5));
    }
  }
  for (let i = 0; i < 2 * n; i++) { samples[i] /= n; }

  return samples;
}
