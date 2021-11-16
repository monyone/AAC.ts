import { parseADTSHeader } from './atds';
import BitStream from './bitstream';
import { SyntaxticElementIdentification } from './constant';
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
      //console.log(stream.remains(), '/',  aac.length, frame_length, '=>', id_syn_ele)
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
      const x_quant = sce1.single.spectral_data.x_quant;
      for (let i = x_quant.length; i < 1024; i++) { x_quant.push(0); }
      
      const samples = imdct(x_quant);
      const window = SIN_WINDOW(samples.length);
      //const window = KBD_WINDOW(samples.length, 4);
      for (let i = 0; i < samples.length; i++) { samples[i] *= window[i]; }

      /*      
      if (this.overlap !== null) {
        for (let i = 0; i < samples.length / 2; i++) {
          samples[i] += this.overlap[i + samples.length / 2];
        }
      }
      this.overlap = samples;
      */

      return samples;
    } else if (sce2) {
      const samples = imdct(sce2.single.spectral_data.x_quant);
      return SIN_WINDOW(samples.length).map((elem, index) => {
        return samples[index] * elem;
      });
    } else {
      return null;
    }
  }
}
