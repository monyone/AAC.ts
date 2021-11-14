import BitStream from './bitstream';

export default class ProgramConfigElement {
  readonly element_instance_tag: number;
  readonly profile: number;
  readonly sampling_frequency_index: number;
  readonly num_front_channel_elements: number;
  readonly num_side_channel_elements: number;
  readonly num_back_channel_elements: number;
  readonly num_lfe_channel_elements: number;
  readonly num_assoc_data_elements: number;
  readonly num_valid_cc_elements: number;
  readonly mono_mixdown_present: boolean;
  readonly mono_mixdown_element_number?: number;
  readonly stereo_mixdown_present: boolean;
  readonly stereo_mixdown_element_number?: number;
  readonly matrix_mixdown_idx_present: boolean;
  readonly matrix_mixdown_idx?: number;
  readonly pseudo_surround_enable?: boolean;
  readonly front_element_is_cpe: boolean[] = [];
  readonly front_element_tag_select: number[] = [];
  readonly side_element_is_cpe: boolean[] = [];
  readonly side_element_tag_select: number[] = [];
  readonly back_element_is_cpe: boolean[] = [];
  readonly back_element_tag_select: number[] = [];
  readonly lfe_element_tag_select: number[] = [];
  readonly assoc_data_element_tag_select: number[] = [];
  readonly cc_element_is_ind_sw: boolean[] = [];
  readonly valid_cc_element_tag_select: number[] = [];
  readonly comment_field_bytes: number;
  readonly comment_field_data: number[] = [];

  public constructor(stream: BitStream) {    
    this.element_instance_tag = stream.readBits(4);
    this.profile = stream.readBits(2);
    this.sampling_frequency_index = stream.readBits(4);
    this.num_front_channel_elements = stream.readBits(4);
    this.num_side_channel_elements = stream.readBits(4);
    this.num_back_channel_elements = stream.readBits(4);
    this.num_lfe_channel_elements = stream.readBits(2);
    this.num_assoc_data_elements = stream.readBits(3);
    this.num_valid_cc_elements = stream.readBits(4);
    this.mono_mixdown_present = stream.readBool();
    if (this.mono_mixdown_present) {
      this.mono_mixdown_element_number = stream.readBits(4);
    }
    this.stereo_mixdown_present = stream.readBool();
    if (this.stereo_mixdown_present) {
      this.stereo_mixdown_element_number = stream.readBits(4);
    }
    this.matrix_mixdown_idx_present = stream.readBool();
    if (this.matrix_mixdown_idx_present) {
      this.matrix_mixdown_idx = stream.readBits(2);
      this.pseudo_surround_enable = stream.readBool();
    }
    for (let i = 0; i < this.num_front_channel_elements; i++) {
      const front_element_is_cpe = stream.readBool();
      const front_element_tag_select = stream.readBits(4);
      this.front_element_is_cpe.push(front_element_is_cpe);
      this.front_element_tag_select.push(front_element_tag_select);
    }
    for (let i = 0; i < this.num_side_channel_elements; i++) {
      const side_element_is_cpe = stream.readBool();
      const side_element_tag_select = stream.readBits(4);
      this.side_element_is_cpe.push(side_element_is_cpe);
      this.side_element_tag_select.push(side_element_tag_select);
    }
    for (let i = 0; i < this.num_back_channel_elements; i++) {
      const back_element_is_cpe = stream.readBool();
      const back_element_tag_select = stream.readBits(4);
      this.back_element_is_cpe.push(back_element_is_cpe);
      this.back_element_tag_select.push(back_element_tag_select);
    }
    for (let i = 0; i < this.num_lfe_channel_elements; i++) {
      const lfe_element_tag_select = stream.readBits(4);
      this.lfe_element_tag_select.push(lfe_element_tag_select);
    }
    for (let i = 0; i < this.num_assoc_data_elements; i++) {
      const assoc_data_element_tag_select = stream.readBits(4);
      this.assoc_data_element_tag_select.push(assoc_data_element_tag_select);
    }
    for (let i = 0; i < this.num_valid_cc_elements; i++) {
      const cc_element_is_ind_sw = stream.readBool();
      const valid_cc_element_tag_select = stream.readBits(4);
      this.cc_element_is_ind_sw.push(cc_element_is_ind_sw);
      this.valid_cc_element_tag_select.push(valid_cc_element_tag_select);
    }

    stream.byteAlign();
    
    this.comment_field_bytes = stream.readBits(8);
    for (let i = 0; i < this.comment_field_bytes; i++) {
      const comment_field_data = stream.readBits(8);
      this.comment_field_data.push(comment_field_data);
    }
  }
}
