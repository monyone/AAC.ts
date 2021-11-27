import { parseADTSHeader } from './adts';
import BitStream from './bitstream';
import {
  TRANSFORM_WINDOWS,
  WINDOW_SEQUENCES,
  SyntaxticElementIdentification,
  WINDOW_SEQUENCES_TO_TRANSFORM_MODE,
} from './constant';
import { imdct } from './mdct';
import ProgramConfigElement from './program_config_element';
import FillElement from './fill_element';
import SingleChannelElement from './single_channel_element';
import ChannelPairElement from './channel_pair_element';
import { SIN_WINDOW, KBD_WINDOW } from './window_function';

export default class Decoder {
  private overlap: (number[] | null)[] = [null];
  private prev_window_shape: (number | null)[] = [null];

  public decode(binary: ArrayBuffer): number[] | null {
    const {
      syncword,
      mpeg_version,
      layer,
      protection,
      profile,
      frequency_index,
      private_bit,
      channel_configuration,
      originality,
      home,
      copyrighted,
      copyright,
      frame_length,
      buffer_fullness,
      frames,
    } = parseADTSHeader(binary);
    
    const begin = (protection ? 9 : 7) + 2 * frames;
    const end = Math.min(binary.byteLength, frame_length + 2 * frames);
    const stream = new BitStream(binary.slice(begin, end));

    if (
      channel_configuration !== 0 &&
      channel_configuration !== 1 &&
      channel_configuration !== 2
    ) {
      throw new Error('Not implemented yet.')
    }

    let sce1: SingleChannelElement | null = null;
    let sce2: SingleChannelElement | null = null;
    let cpe1: ChannelPairElement | null = null;

    while (!stream.isEmpty()) {
      const id_syn_ele = stream.readBits(3);
      //console.log(stream.remains(), '/', frame_length, '=>', id_syn_ele)
      switch (id_syn_ele) {
        case SyntaxticElementIdentification.ID_SCE: {
          stream.consumeClear();
          const sce = new SingleChannelElement(frequency_index, stream);
          if (sce1 == null) {
            sce1 = sce;
          } else if (sce2 == null) {
            sce2 = sce;
          }
          //const element = stream.consumeArray();
          stream.consumeClear();
          break;
        }
        case SyntaxticElementIdentification.ID_CPE: {
          stream.consumeClear();
          const cpe = new ChannelPairElement(frequency_index, stream);
          if (cpe1 == null) {
            cpe1 = cpe;
          }
          //const element = stream.consumeArray();
          stream.consumeClear();
          break;
        }
        case SyntaxticElementIdentification.ID_PCE:
          const pce = new ProgramConfigElement(stream);
          stream.consumeClear();
          break;
        case SyntaxticElementIdentification.ID_FIL:
          const fill = new FillElement(stream);
          stream.consumeClear();
          break;
        case SyntaxticElementIdentification.ID_END:
          stream.consumeClear();
          break;
        default:
          throw new Error('Not implemented yet.')
          stream.consumeClear();
          break;
      }
      if (id_syn_ele === SyntaxticElementIdentification.ID_END) { break; }
    }

    if (sce1) {
      if (sce1.single.ics_info.window_sequence === WINDOW_SEQUENCES.ONLY_LONG_SEQUENCE) {
        const coeff = WINDOW_SEQUENCES_TO_TRANSFORM_MODE[sce1.single.ics_info.window_sequence].coeffs;

        const frequencies = [...sce1.single.spectral_data.x_quant[0]]
        for (let i = frequencies.length; i < coeff; i++) { frequencies.push(0); }
        const samples: number[] = imdct(frequencies);

        const curr_window = (this.prev_window_shape[0] ?? sce1.single.ics_info.window_shape) == 0 ? SIN_WINDOW(coeff * 2) : KBD_WINDOW(coeff * 2, 4);
        const next_window = sce1.single.ics_info.window_shape == 0 ? SIN_WINDOW(coeff * 2) : KBD_WINDOW(coeff * 2, 4);
        for (let i =     0; i < coeff    ; i++) { samples[i] *= curr_window[i]; }
        for (let i = coeff; i < coeff * 2; i++) { samples[i] *= next_window[i]; }

        if (this.overlap[0] != null) {
          for (let i = 0; i < coeff; i++) { samples[i] += this.overlap[0][i]; }
        }

        this.overlap[0] = samples.slice(coeff, coeff * 2);
        this.prev_window_shape[0] = sce1.single.ics_info.window_shape;

        return samples.slice(0, coeff);
      } else if (sce1.single.ics_info.window_sequence === WINDOW_SEQUENCES.LONG_START_SEQUENCE) {
        const coeff = WINDOW_SEQUENCES_TO_TRANSFORM_MODE[sce1.single.ics_info.window_sequence].coeffs;
        const curr_coeff = coeff;
        const next_coeff = WINDOW_SEQUENCES_TO_TRANSFORM_MODE[WINDOW_SEQUENCES.EIGHT_SHORT_SEQUENCE].coeffs;

        const frequencies = [...sce1.single.spectral_data.x_quant[0]]
        for (let i = frequencies.length; i < coeff; i++) { frequencies.push(0); }
        const samples: number[] = imdct(frequencies);

        const curr_window = (this.prev_window_shape[0] ?? sce1.single.ics_info.window_shape) == 0 ? SIN_WINDOW(curr_coeff * 2) : KBD_WINDOW(curr_coeff * 2, 4);
        const next_window = sce1.single.ics_info.window_shape == 0 ? SIN_WINDOW(next_coeff * 2) : KBD_WINDOW(next_coeff * 2, 6);

        for (let i = 0; i < coeff; i++) {
          samples[i] *= curr_window[i];
        }
        for (let i = coeff; i < coeff * 2; i++) {
          if (i < (coeff + (coeff - next_coeff) / 2)) {
            samples[i] *= 1;
          } else if(i < (coeff + ((coeff - next_coeff) / 2)) + next_coeff) {
            samples[i] *= next_window[i - (coeff + ((coeff - next_coeff) / 2)) + next_coeff];
          } else {
            samples[i] *= 0;
          }
        }

        if (this.overlap[0] != null) {
          for (let i = 0; i < coeff; i++) { samples[i] += this.overlap[0][i]; }
        }

        this.overlap[0] = samples.slice(coeff, coeff * 2);
        this.prev_window_shape[0] = sce1.single.ics_info.window_shape;

        return samples.slice(0, coeff);
      } else if (sce1.single.ics_info.window_sequence === WINDOW_SEQUENCES.EIGHT_SHORT_SEQUENCE) { 
        const coeff = WINDOW_SEQUENCES_TO_TRANSFORM_MODE[sce1.single.ics_info.window_sequence].coeffs;
        const short_coeff = coeff;
        const long_coeff = WINDOW_SEQUENCES_TO_TRANSFORM_MODE[WINDOW_SEQUENCES.ONLY_LONG_SEQUENCE].coeffs;

        const short_samples: number[][] = [];

        const curr_window = (this.prev_window_shape[0] ?? sce1.single.ics_info.window_shape) == 0 ? SIN_WINDOW(coeff * 2) : KBD_WINDOW(coeff * 2, 6);
        const next_window = sce1.single.ics_info.window_shape == 0 ? SIN_WINDOW(coeff * 2) : KBD_WINDOW(coeff * 2, 6);

        for (let w = 0; w < sce1.single.ics_info.num_windows; w++) {
          const frequencies = [...sce1.single.spectral_data.x_quant[w]];
          while (frequencies.length < coeff) { frequencies.push(0); }
          short_samples.push(imdct(frequencies));
        }

        const samples: number[] = [];
        for (let i = 0; i < (long_coeff - short_coeff) / 2; i++) { samples.push(this.overlap[0] != null ? this.overlap[0][i] : 0); }
        for (let w = 0; w < sce1.single.ics_info.num_windows; w++) {
          for (let i = 0; i < short_coeff; i++) {
            if (w === 0) {
              samples.push((short_samples[w][i] * curr_window[i]) + (this.overlap[0] != null ? this.overlap[0][(long_coeff - short_coeff) / 2 + i] : 0));
            } else {
              const index = (long_coeff - short_coeff) / 2 + (w * coeff) + i;
              samples[index] += short_samples[w][i] * next_window[i];
            }
          }
          for (let i = short_coeff; i < short_coeff * 2; i++) {
            samples.push(short_samples[w][i] * next_window[i]);
          }
        }
        while (samples.length < long_coeff * 2) { samples.push(0); }

        this.overlap[0] = samples.slice(long_coeff, long_coeff * 2);
        this.prev_window_shape[0] = sce1.single.ics_info.window_shape;

        return samples.slice(0, long_coeff);
      } else if (sce1.single.ics_info.window_sequence === WINDOW_SEQUENCES.LONG_STOP_SEQUENCE) {
        const coeff = WINDOW_SEQUENCES_TO_TRANSFORM_MODE[sce1.single.ics_info.window_sequence].coeffs;
        const curr_coeff = WINDOW_SEQUENCES_TO_TRANSFORM_MODE[WINDOW_SEQUENCES.EIGHT_SHORT_SEQUENCE].coeffs;
        const next_coeff = coeff;

        const frequencies = [...sce1.single.spectral_data.x_quant[0]]
        for (let i = frequencies.length; i < coeff; i++) { frequencies.push(0); }
        const samples: number[] = imdct(frequencies);

        const curr_window = (this.prev_window_shape[0] ?? sce1.single.ics_info.window_shape) == 0 ? SIN_WINDOW(curr_coeff * 2) : KBD_WINDOW(curr_coeff * 2, 6);
        const next_window = sce1.single.ics_info.window_shape == 0 ? SIN_WINDOW(next_coeff * 2) : KBD_WINDOW(next_coeff * 2, 4);

        for (let i = 0; i < coeff; i++) {
          if (i < (coeff - curr_coeff) / 2) {
            samples[i] *= 0;
          } else if(i < ((coeff - curr_coeff) / 2) + curr_coeff) {
            samples[i] *= curr_window[i - ((coeff - curr_coeff) / 2)];
          } else {
            samples[i] *= 1;
          }
        }
        for (let i = coeff; i < coeff * 2; i++) {
          samples[i] *= next_window[i];
        }

        if (this.overlap[0] != null) {
          for (let i = 0; i < coeff; i++) { samples[i] += this.overlap[0][i]; }
        }

        this.overlap[0] = samples.slice(coeff, coeff * 2);
        this.prev_window_shape[0] = sce1.single.ics_info.window_shape;

        return samples.slice(0, coeff);
      } else {
        throw Error('Not Implemented Yet!');
      }
    } else if (sce2) {
      return null;
    } else {
      return null;
    }
  }
}
