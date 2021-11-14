import BitStream from './bitstream';
import { WINDOW_SEQUENCES } from './constant';
import ICSInfo from './ics_info';

export default class SectionData {
  readonly sect_start: number[][] = [];
  readonly sect_end: number[][] = [];
  readonly sect_cb: number[][] = [];
  readonly num_sect: number[] = [];
  readonly sfb_cb: number[][] = [];

  public constructor (ics_info: ICSInfo, stream: BitStream) {
    const sect_esc_val = ics_info.window_sequence === WINDOW_SEQUENCES.EIGHT_SHORT_SEQUENCE ? ((1 << 3) - 1) : ((1 << 5) - 1);
  
    for (let g = 0; g < ics_info.num_window_groups; g++) {
      this.sect_start.push([]);
      this.sect_end.push([]);
      this.sect_cb.push([]);
      this.sfb_cb.push([]);
  
      let k = 0, i = 0;
      while (k < ics_info.max_sfb) {
        const sect_cb = stream.readBits(4);
        this.sect_cb[g].push(sect_cb);

        let sect_len = 0;
        while (true) {
          const sect_len_incr = stream.readBits(ics_info.window_sequence === WINDOW_SEQUENCES.EIGHT_SHORT_SEQUENCE ? 3 : 5);
          sect_len += sect_len_incr;
          if (sect_len_incr !== sect_esc_val) {
            break;
          }
        }
  
        this.sect_start[g].push(k);
        this.sect_end[g].push(k + sect_len);
        for (let sfb = k; sfb < k + sect_len; sfb++) {
          this.sfb_cb[g].push(sect_cb);
        }
  
        k += sect_len;
        i++;
      }
  
      this.num_sect.push(i);
    }
  }
}