// とりあえずこれを使ってる: https://github.com/redlily/training-webaudio-compression

const swap = (v: number[], a: number, b:number) => {
  const t = v[a];
  v[a] = v[b];
  v[b] = t;
}

const swapElements = (x: number[]) => {
  const n = x.length;
  const nh = n >> 1;
  const nh1 = nh + 1;
  const nq = n >> 2;
  for (let i = 0, j = 0; i < nh; i += 2) {
    swap(x, i + nh, j + 1);
    if (i < j) {
      swap(x, i + nh1, j + nh1);
      swap(x, i, j);
    }

    // ビットオーダを反転した変数としてインクリメント
    for (let k = nq; (j ^= k) < k; k >>= 1) {}
  }
}

const dctII = (x: number[]) => {
  // バタフライ演算
  const n = x.length;
  let rad = Math.PI / (n << 1);
  for (let m = n, mh = m >> 1; 1 < m; m = mh, mh >>= 1) {
    for (let i = 0; i < mh; i++) {
      let cs = 2.0 * Math.cos(rad * ((i << 1) + 1));
      for (let j = i, k = (m - 1) - i; j < n; j += m, k += m) {
        let x0 = x[j];
        let x1 = x[k];
        x[j] = x0 + x1;
        x[k] = (x0 - x1) * cs;
      }
    }
    rad *= 2.0;
  }

  // データの入れ替え
  swapElements(x);

  // 差分方程式
  for (let m = n, mh = m >> 1, mq = mh >> 1; 2 < m; m = mh, mh = mq, mq >>= 1) {
    for (let i = mq + mh; i < m; i++) {
      let xt = (x[i] = -x[i] - x[i - mh]);
      for (let j = i + mh; j < n; j += m) {
        let k = j + mh;
        xt = (x[j] -= xt);
        xt = (x[k] = -x[k] - xt);
      }
    }
  }

  // スケーリング
  for (let i = 1; i < n; ++i) {
    x[i] *= 0.5;
  }
}

export const imdct = (frequencies: number[]) => {
  const n = frequencies.length;
  const input = [];
  for (let i = 0; i < n; i++) { input.push(frequencies[i]); }
  const samples: number[] = [];
  for (let i = 0; i < 2 * n; i++) { samples.push(0); }

  // cos値の変換用係数を掛け合わせ
  let rad = Math.PI / (n << 2);
  for (let i = 0; i < n; ++i) {
    input[i] *= 2.0 * Math.cos(rad * ((i << 1) + 1));
  }

  // DCT-II
  dctII(input);

  // 差分方程式
  input[0] *= 0.5;
  let i = 0, j = 1;
  const nh = n >> 1;
  for (; i < nh; i = j++) {
    input[j] += (input[i] = -input[i]);
  }
  for (; j < n; i = j++) {
    input[j] -= input[i];
  }

  // スケーリング
  for (let j = 0; j < n; j++) {
    input[j] /= n;
  }

  // データを分離
  const ns1 = n - 1;            // n - 1
  const nd2 = n >> 1;           // n / 2
  const nm3d4 = n + nd2;        // n * 3 / 4
  const nm3d4s1 = nm3d4 - 1;    // n * 3 / 4 - 1
  for (let i = 0; i < nd2; i++) {
    samples[ns1 - i] = -(samples[i] = input[nd2 + i]);
    samples[nm3d4 + i] = (samples[nm3d4s1 - i] = input[i]);
  }

  return samples;
}
