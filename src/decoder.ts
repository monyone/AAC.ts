import { parseADTSHeader } from './atds';
import BitStream from './bitstream';
import { SyntaxticElementIdentification } from './constant';
import ProgramConfigElement from './program_config_element';
import FillElement from './fill_element';
import SingleChannelElement from './single_channel_element';
import ChannelPairElement from './channel_pair_element';

export default class Decoder {
  readonly overwrap: number[] = [];

  public decode(binary: ArrayBuffer) {
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
  }
}
