import { parseADTSHeader } from './adts';
import BitStream from './bitstream';
import { WINDOW_SEQUENCES, SyntaxticElementIdentification } from './constant';
import { imdct } from './mdct';
import ProgramConfigElement from './program_config_element';
import FillElement from './fill_element';
import SingleChannelElement from './single_channel_element';
import ChannelPairElement from './channel_pair_element';
import { SIN_WINDOW, KBD_WINDOW } from './window_function';

export default class Decoder {
  private overlap: number[] | null = null;

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
      let samples = [];
      if (sce1.single.ics_info.window_sequence === WINDOW_SEQUENCES.EIGHT_SHORT_SEQUENCE) { 
         let short_samples: number[][] = [];
         for (let g = sce1.single.ics_info.num_window_groups; g < 8; g++) {
           short_samples.push([]);
         }
         for (let g = 0; g < sce1.single.ics_info.num_window_groups; g++) {
           short_samples[g] = [...sce1.single.spectral_data.x_quant[g]];
         }
         for (let g = 0; g < 8; g++) {
           while (short_samples[g].length < 128) { short_samples[g].push(0); }
           samples.push(...imdct(short_samples[g]));
         }
      } else {
        const frequencies = [...sce1.single.spectral_data.x_quant[0]]
        for (let i = frequencies.length; i < 1024; i++) { frequencies.push(0); }
        samples = imdct(frequencies);
      }

      const window = SIN_WINDOW(samples.length);
      //const window = KBD_WINDOW(samples.length, 4);
      for (let i = 0; i < samples.length; i++) { samples[i] *= window[i]; }

      if (this.overlap !== null) {
        for (let i = 0; i < samples.length / 2; i++) {
          samples[i] += this.overlap[i];
        }
      }
      this.overlap = samples.slice(1024);

      return samples.slice(0, 1024);
    } else if (sce2) {
      return null;
    } else {
      return null;
    }
  }
}
