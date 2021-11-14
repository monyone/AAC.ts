import BitStream from './bitstream';

export default class PulseData {
  readonly number_pulse: number;
  readonly pulse_start_sfb: number;
  readonly pulse_offset: number[] = [];
  readonly pulse_amp: number[] = [];

  public constructor(stream: BitStream) {
    this.number_pulse = stream.readBits(2);
    this.pulse_start_sfb = stream.readBits(6);

    for (let i = 0; i < this.number_pulse + 1; i++) {
      this.pulse_offset.push(stream.readBits(5));
      this.pulse_amp.push(stream.readBits(4));
    }
  }
}