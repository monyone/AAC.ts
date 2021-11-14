import BitStream from './bitstream';
import IndividualChannelStream from './individual_channel_stream';

export default class SingleChannelElement {
  readonly element_instance_tag: number;
  readonly single: IndividualChannelStream;

  public constructor(frequency_index: number, stream: BitStream) {    
    this.element_instance_tag = stream.readBits(4);
    this.single = new IndividualChannelStream(frequency_index, null, stream);
  }
}
