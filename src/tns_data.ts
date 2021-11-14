import BitStream from './bitstream';
import { WINDOW_SEQUENCES } from './constant';
import ICSInfo from './ics_info';

export default class TNSData {
  readonly n_filt: number[] = [];
  readonly length: number[][] = [];
  readonly order: number[][] = [];
  readonly direction: number[][] = [];
  readonly coef_compress: number[][] = [];
  readonly coef: number[][][] = [];

  public constructor(ics_info: ICSInfo, stream: BitStream) {
    const num_windows = ics_info.window_sequence === WINDOW_SEQUENCES.EIGHT_SHORT_SEQUENCE ? 8 : 1;
    const n_filt_bits = ics_info.window_sequence === WINDOW_SEQUENCES.EIGHT_SHORT_SEQUENCE ? 1 : 2;
    const length_bits = ics_info.window_sequence === WINDOW_SEQUENCES.EIGHT_SHORT_SEQUENCE ? 4 : 6;
    const order_bits = ics_info.window_sequence === WINDOW_SEQUENCES.EIGHT_SHORT_SEQUENCE ? 3 : 5;

    for (let w = 0; w < num_windows; w++) {
      const n_filt = stream.readBits(n_filt_bits);
      this.n_filt.push(stream.readBits(n_filt_bits));
      
      this.length.push([]);
      this.order.push([]);
      this.direction.push([]);
      this.coef_compress.push([]);
      this.coef.push([]);

      let start_coef_bits = 3;
      if (n_filt) {
        const coef_res = stream.readBits(1);
        if (coef_res) { start_coef_bits = 4; }
      }
  
      for (let filt = 0; filt < n_filt; filt++) {
        const length = stream.readBits(length_bits);
        const order = stream.readBits(order_bits);
        this.length[w].push(length);
        this.order[w].push(order);

        if (order) {
          const direction = stream.readBits(1);
          const coef_compress = stream.readBool();
          this.direction[w].push(direction);
          this.coef_compress[w].push(w);
          this.coef[w].push([]);

          for (let i = 0; i < order; i++) {
            const coef = stream.readBits(start_coef_bits - (coef_compress ? 1 : 0));
            this.coef[w][filt].push(coef);
          }
        }
      }
    }
  }
};