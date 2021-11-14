import BitStream from './bitstream';

const extension_payload = (cnt: number, stream: BitStream) => {
  const extension_type = stream.readBits(4);
  const EXT_FILL = 0b0000;
  const EXT_FILL_DATA = 0b0001;
  const EXT_DYNAMIC_RANGE = 0b1011;
  const EXT_SBR_DATA = 0b1101;
  const EXT_SBR_DATA_CRC = 0b1110;

  if(extension_type === EXT_FILL_DATA) {
    const fill_nibble = stream.readBits(4);
    for (let i = 0; i < cnt - 1; i++) {
      const fill_byte = stream.readBits(8);
    }
    return cnt;
  } else if(extension_type === EXT_DYNAMIC_RANGE) {
    throw new Error('Not implemented yet.')
  } else if(extension_type === EXT_SBR_DATA) {
    throw new Error('Not implemented yet.')
  } else if(extension_type === EXT_SBR_DATA_CRC) {
    throw new Error('Not implemented yet.')
  } else {
    for (let i = 0; i < 8 * (cnt - 1) + 4; i++) {
      const other_bits = stream.readBits(1);
    }
    return cnt;
  }
}

export default class FillElement {
  readonly cnt: number;

  public constructor(stream: BitStream) {
    this.cnt = stream.readBits(4);
    if (this.cnt == 15) {
      this.cnt += stream.readBits(8) - 1;
    }
    while (this.cnt > 0) {
      this.cnt -= extension_payload(this.cnt, stream);
    }
  }
}