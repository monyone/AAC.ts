const dctII = (x: number[]) => {
  const n = x.length;
  if (n === 1) { return x; }

  const even: number[] = [], odd: number[] = [];
  for (let i = 0; i < n / 2; i++) {
    even.push((x[i] + x[(n - 1) - i]));
    odd.push((x[i] - x[(n - 1) - i]) / (2 * Math.cos(Math.PI * (2 * i + 1) / (2 * n))));
  }

  dctII(even);
  dctII(odd); odd.push(0);

  for (let i = 0; i < n / 2; i++) {
    x[i * 2 + 0] = even[i];
    x[i * 2 + 1] = odd[i + 0] + odd[i + 1];
  }
}

// 1st algorighm
const dctIV = (x: number[]) => {
  const n = x.length;

  for (let i = 0; i < n; i++) {
    x[i] *= (2 * Math.cos(Math.PI * (2 * i + 1) / (4 * n)));
  }

  dctII(x);

  x[0] /= 2;
  for (let i = 1; i < n; i++) {
    x[i] -= x[i - 1];
  }

  return x;
}

export const imdct = (frequencies: number[]) => {
  const n = frequencies.length;
  const output = dctIV([...frequencies]).map((elem, index) => ((index < n / 2) ? -elem : elem) / n);
  const samples: number[] = [];
  for (let i = 0; i < 2 * n; i++) { samples.push(0); }

  const ns1 = n - 1;            // n - 1
  const nd2 = n >> 1;           // n / 2
  const nm3d4 = n + nd2;        // n * 3 / 4
  const nm3d4s1 = nm3d4 - 1;    // n * 3 / 4 - 1
  for (let i = 0; i < nd2; i++) {
    samples[ns1 - i] = -(samples[i] = output[nd2 + i]);
    samples[nm3d4 + i] = (samples[nm3d4s1 - i] = output[i]);
  }

  return samples;
}

/* naive solution 
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
*/

