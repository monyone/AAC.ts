import { 
  WINDOW_SEQUENCES,
  UPPER_SPECTRAL_LIMIT_FOR_PREDICTION,
  WINDOW_SEQUENCES_TO_NUM_WINDOWS,
  SCALEFACTOR_BANDS,
} from './constant';
import BitStream from './bitstream';

export default class ICSInfo {
  readonly window_sequence: number;
  readonly window_shape: number;
  readonly max_sfb: number;
  readonly scale_factor_grouping: number;
  readonly predictor_data_present: boolean;
  readonly predictor_reset?: boolean;
  readonly predictor_reset_group_number?: number;
  readonly prediction_used?: boolean[];
  
  // other widely used value declared here
  readonly num_windows: number = 1;
  readonly num_window_groups: number = 1;
  readonly window_group_length: number[] = [1];
  readonly sect_sfb_offset: number[][] = [];

  public constructor (frequency_index: number, stream: BitStream) {
    stream.readBits(1); // ics_reserved_bit (1)
    this.window_sequence = stream.readBits(2);
    this.window_shape = stream.readBits(1);

    if (this.window_sequence === WINDOW_SEQUENCES.EIGHT_SHORT_SEQUENCE) {
      this.max_sfb = stream.readBits(4);
      this.scale_factor_grouping = stream.readBits(7);
      this.predictor_data_present = false;
    } else {
      this.max_sfb = stream.readBits(6);
      this.scale_factor_grouping = 0; // fill value
      this.predictor_data_present = stream.readBool();
      if (this.predictor_data_present) {
        this.predictor_reset = stream.readBool();
        if (this.predictor_reset) {
          this.predictor_reset_group_number = stream.readBits(6);
        }

        const Pred_SFB_MAX = UPPER_SPECTRAL_LIMIT_FOR_PREDICTION[frequency_index].Pred_SFB_MAX;
        this.prediction_used = [];
        for (let sfb = 0; sfb < Math.min(this.max_sfb, Pred_SFB_MAX); sfb++) {
          this.prediction_used.push(stream.readBool())
        }
      }
    }

    // other widely used value definision
    this.num_windows = WINDOW_SEQUENCES_TO_NUM_WINDOWS[this.window_sequence];
    if (this.window_sequence === WINDOW_SEQUENCES.EIGHT_SHORT_SEQUENCE) {
      for (let i = 0; i < 7; i++) {
        if ((this.scale_factor_grouping & (1 << (6 - i))) === 0) {
          this.num_window_groups += 1;
          this.window_group_length.push(1);
        } else {
          this.window_group_length[this.window_group_length.length - 1]++;
        }
      }

      for (let g = 0; g < this.num_window_groups; g++) {
        this.sect_sfb_offset.push([]);
        for (let i = 0; i < this.max_sfb + 1; i++) {
          this.sect_sfb_offset[g].push(SCALEFACTOR_BANDS[frequency_index].swb_offset_short_window[i]);
        }
      }
    } else {
      this.sect_sfb_offset.push([]);
      for (let i = 0; i < this.max_sfb + 1; i++) {
        this.sect_sfb_offset[0].push(SCALEFACTOR_BANDS[frequency_index].swb_offset_long_window[i]);
      }
    }
  }
}
