import BitStream from './bitstream';
import ICSInfo from './ics_info';
import IndividualChannelStream from './individual_channel_stream';

export default class ChannelPairElement {
  readonly element_instance_tag: number;
  readonly common_window: boolean;
  readonly ics_info?: ICSInfo;
  readonly ms_mask_present?: number;
  readonly ms_used?: boolean[][];
  readonly left: IndividualChannelStream;
  readonly right: IndividualChannelStream;

  public constructor(frequency_index: number, stream: BitStream) {    
    this.element_instance_tag = stream.readBits(4);
    this.common_window = stream.readBool();
    if (this.common_window) {
      this.ics_info = new ICSInfo(frequency_index, stream);
      this.ms_mask_present = stream.readBits(2);
      if (this.ms_mask_present === 1) {
        this.ms_used = [];
        for (let g = 0; g < this.ics_info.num_window_groups; g++) {
          this.ms_used.push([]);
          for (let sfb = 0; sfb < this.ics_info.max_sfb; sfb++) {
            this.ms_used[g].push(stream.readBool())
          }
        }
      }
    }
    this.left = new IndividualChannelStream(frequency_index, this.ics_info ?? null, stream);
    this.right = new IndividualChannelStream(frequency_index, this.ics_info ?? null, stream);
  }
}
