import BitStream from './bitstream';
import GainControlData from './gain_control_data';
import ICSInfo from './ics_info';
import PulseData from './pulse_data';
import ScalefactorData from './scalefactor_data';
import SectionData from './section_data';
import SpectralData from './spectral_data';
import TNSData from './tns_data';

export default class IndividualChannelStream {
  readonly global_gain: number;
  readonly ics_info: ICSInfo;
  readonly section_data: SectionData;
  readonly scale_factor_data: ScalefactorData;
  readonly pulse_data?: PulseData;
  readonly tns_data?: TNSData;
  readonly gain_control_data?: GainControlData;
  readonly spectral_data: SpectralData;

  public constructor(freqency_index: number, common_window: ICSInfo | null, stream: BitStream) {
    this.global_gain = stream.readBits(8);
    
    if (common_window != null) {
      this.ics_info = common_window;
    } else {
      this.ics_info = new ICSInfo(freqency_index, stream);
    }
    this.section_data = new SectionData(this.ics_info, stream);
    this.scale_factor_data = new ScalefactorData(this.global_gain, this.ics_info, this.section_data, stream);

    const pulse_data_present = stream.readBool();
    if (pulse_data_present) {
      this.pulse_data = new PulseData(stream);
    }

    const tns_data_present = stream.readBool();
    if (tns_data_present) {
      this.tns_data = new TNSData(this.ics_info, stream);
    }

    const gain_control_data_present = stream.readBool();
    if (gain_control_data_present) {
      this.gain_control_data = new GainControlData(this.ics_info, stream);
    }

    this.spectral_data = new SpectralData(this.ics_info, this.section_data, this.scale_factor_data, stream);
  }
}
