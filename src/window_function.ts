const bessi0 = (x: number) => {
  const abs = Math.abs(x);

  if (abs < 3.75) {
    const y = (x / 3.75) ** 2;
    return 1.0 + y * (3.51566229 + y * (3.0899424 + y * (1.2067492e-1 + y * (0.2659732 + y * (0.360758e-1 + y * 0.45813e-2)))));
  } else {
    const y = 3.75 / x;
    return (Math.exp(abs) / Math.sqrt(abs)) * (0.39894228 + y * (0.1328592e-1 + y * (0.225219e-2 + y * (-0.157565e-2 + y * (0.916281e-2 + y * (0.2057706e-1 + y * (0.2635537e-1 + y * (-0.1647633e-1 + y * 0.392377e-2))))))));
  }
}

export const kaiser_bessel_window_function = (n: number, N: number, alpha: number) => {
  return bessi0(Math.PI * alpha * Math.sqrt(1 - ((n - (N / 4)) / (N / 4)) ** 2))  / bessi0(Math.PI * alpha);
}

export const KBD_WINDOW = (n: number, alpha: number) => {
  const window: number[] = [];

  let denom = 0;
  for (let i = 0; i < n / 2; i++) { denom += kaiser_bessel_window_function(i, n, alpha); }

  {
    let nom = 0;
    for (let i = 0; i < n / 2; i++) {
      nom += kaiser_bessel_window_function(i, n, alpha);
      window.push(Math.sqrt(nom / denom));
    }
  }
  {
    for (let i = n / 2 - 1; i >= 0; i--) {
      window.push(window[i]);
    }
  }

  return window;
}

export const SIN_WINDOW = (n: number) => {
  const result: number[] = [];
  for (let i = 0; i < n; i++) {
    result.push(Math.sin(Math.PI / n * (i + 0.5)));
  }
  return result;
}
