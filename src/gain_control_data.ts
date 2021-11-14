import BitStream from './bitstream';
import { WINDOW_SEQUENCES } from './constant';
import ICSInfo from './ics_info';

export default class GainControlData {
  readonly max_band: number;
  readonly adjust_num: number[][] = [];
  readonly alevcode: number[][][] = [];
  readonly aloccode: number[][][] = [];

  public constructor(ics_info: ICSInfo, stream: BitStream) {
    this.max_band = stream.readBits(2);

    if (ics_info.window_sequence === WINDOW_SEQUENCES.ONLY_LONG_SEQUENCE) {
      for (let bd = 0; bd <= this.max_band; bd++) {
        this.adjust_num.push([]);
        this.alevcode.push([]);
        this.aloccode.push([]);

        for (let wd = 0; wd < 1; wd++) {
          const adjust_num = stream.readBits(3);
          this.adjust_num[bd].push(adjust_num);
          this.alevcode[bd].push([]);
          this.aloccode[bd].push([]);

          for (let ad = 0; ad < adjust_num; ad++) {
            const alevcode = stream.readBits(4);
            this.alevcode[bd][wd].push(alevcode);

            const aloccode = stream.readBits(4);
            this.aloccode[bd][wd].push(aloccode);
          }
        }
      }
    } else if (ics_info.window_sequence === WINDOW_SEQUENCES.LONG_START_SEQUENCE) {
      for (let bd = 0; bd <= this.max_band; bd++) {
        this.adjust_num.push([]);
        this.alevcode.push([]);
        this.aloccode.push([]);

        for (let wd = 0; wd < 2; wd++) {
          const adjust_num = stream.readBits(3);
          this.adjust_num[bd].push(adjust_num);
          this.alevcode[bd].push([]);
          this.aloccode[bd].push([]);

          for (let ad = 0; ad < adjust_num; ad++) {
            const alevcode = stream.readBits(4);
            this.alevcode[bd][wd].push(alevcode);
            if (wd == 0){
              const aloccode = stream.readBits(4);
              this.aloccode[bd][wd].push(aloccode);
            } else {
              const aloccode = stream.readBits(2);
              this.aloccode[bd][wd].push(aloccode);
            }
          }
        }
      }
    } else if (ics_info.window_sequence === WINDOW_SEQUENCES.EIGHT_SHORT_SEQUENCE) {
      for (let bd = 0; bd <= this.max_band; bd++) {
        this.adjust_num.push([]);
        this.alevcode.push([]);
        this.aloccode.push([]);

        for (let wd = 0; wd < 1; wd++) {
          const adjust_num = stream.readBits(3);
          this.adjust_num[bd].push(adjust_num);
          this.alevcode[bd].push([]);
          this.aloccode[bd].push([]);

          for (let ad = 0; ad < adjust_num; ad++) {
            const alevcode = stream.readBits(4);
            this.alevcode[bd][wd].push(alevcode);

            const aloccode = stream.readBits(2);
            this.aloccode[bd][wd].push(aloccode);
          }
        }
      }
    } else if (ics_info.window_sequence === WINDOW_SEQUENCES.LONG_STOP_SEQUENCE) {
      for (let bd = 0; bd <= this.max_band; bd++) {
        this.adjust_num.push([]);
        this.alevcode.push([]);
        this.aloccode.push([]);

        for (let wd = 0; wd < 2; wd++) {
          const adjust_num = stream.readBits(3);
          this.adjust_num[bd].push(adjust_num);
          this.alevcode[bd].push([]);
          this.aloccode[bd].push([]);

          for (let ad = 0; ad < adjust_num; ad++) {
            const alevcode = stream.readBits(4);
            this.alevcode[bd][wd].push(alevcode);
            if (wd == 0){
              const aloccode = stream.readBits(4);
              this.aloccode[bd][wd].push(aloccode);
            } else {
              const aloccode = stream.readBits(5);
              this.aloccode[bd][wd].push(aloccode);
            }
          }
        }
      }
    }
  }
}