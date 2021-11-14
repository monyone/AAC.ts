import BinarySearchTree from './binary_search_tree';
import BitStream from './bitstream';
import { HCB } from './constant';
import { 
  HUFFMAN_PAIRS,
  HUFFMAN_PAIRS_FUNC,
  HUFFMAN_QUADS,
  HUFFMAN_QUADS_FUNC,
} from './huffman';
import ICSInfo from './ics_info';
import ScalefactorData from './scalefactor_data';
import SectionData from './section_data';

const sign = (value: number) => {
  if (value > 0) { return  1; }
  if (value < 0) { return -1; }
  return 0;
}

const IQ = (value: number) => {
  return sign(value) * Math.pow(Math.abs(value), 4 / 3);
}

export default class SpectralData {
  readonly x_quant: number[] = [];

  public constructor(ics_info: ICSInfo, section_data: SectionData, scale_factor_data: ScalefactorData, stream: BitStream) {    
    for (let g = 0; g < ics_info.num_window_groups; g++) {
      for (let i = 0; i < section_data.num_sect[g]; i++) {
        for (let k = ics_info.sect_sfb_offset[g][section_data.sect_start[g][i]]; k < ics_info.sect_sfb_offset[g][section_data.sect_end[g][i]]; ) {
          if (section_data.sect_cb[g][i] === HCB.ZERO_HCB || section_data.sect_cb[g][i] === HCB.INTENSITY_HCB || section_data.sect_cb[g][i] === HCB.INTENSITY_HCB2) {
            this.x_quant.push(0);
            k++;
          } else if (section_data.sect_cb[g][i] === HCB.NOISE_HCB) {
            throw new Error('Not implemented yet.')
          } else if (section_data.sect_cb[g][i] < HCB.FIRST_PAIR_HCB) {
            const index = section_data.sect_cb[g][i] - 1;
  
            let tree: BinarySearchTree | null = HUFFMAN_QUADS[index];
            while (tree && !tree.isLeaf) {
              tree = tree.select(stream.readBits(1));
            }
            if (!tree) { throw new Error('No Huffman Code Available!'); }
  
            let { signed, w, x, y, z } = HUFFMAN_QUADS_FUNC[index](tree.index!);
            if (!signed) {
              if (w !== 0) {
                if (stream.readBool()) { w = -w; }
              }
              if (x !== 0) {
                if (stream.readBool()) { x = -x; }
              }
              if (y !== 0) {
                if (stream.readBool()) { y = -y; }
              }
              if (z !== 0) {
                if (stream.readBool()) { z = -z; }
              }
            }

            this.x_quant.push(IQ(w) * scale_factor_data.scalefactor[section_data.sect_start[g][i]]);
            this.x_quant.push(IQ(x) * scale_factor_data.scalefactor[section_data.sect_start[g][i]]);
            this.x_quant.push(IQ(y) * scale_factor_data.scalefactor[section_data.sect_start[g][i]]);
            this.x_quant.push(IQ(z) * scale_factor_data.scalefactor[section_data.sect_start[g][i]]);
  
            k += 4;
          } else {
            const index = section_data.sect_cb[g][i] - HCB.FIRST_PAIR_HCB;
  
            let tree: BinarySearchTree | null = HUFFMAN_PAIRS[index];
            while (tree && !tree.isLeaf) {
              tree = tree.select(stream.readBits(1));
            }
            if (!tree) { throw new Error('No Huffman Code Available!'); }
  
            let { signed, y, z } = HUFFMAN_PAIRS_FUNC[index](tree.index!);
  
            if (!signed) {
              if (y !== 0) {
                if (stream.readBool()) { y = -y; }
              }
              if (z !== 0) {
                if (stream.readBool()) { z = -z; }
              }
            }
  
            if (section_data.sect_cb[g][i] === HCB.ESC_HCB) {
              if (Math.abs(y) === 16) {
                  let count = 0;
                  while (true) {
                    if(!stream.readBool()) { break; }
                    count++;
                  }
                  const escape_word = stream.readBits(count + 4);
                  const escape_value = sign(y) * (2 ** (count + 4) + escape_word);
                  this.x_quant.push(IQ(escape_value) * scale_factor_data.scalefactor[section_data.sect_start[g][i]]);
              } else {
                this.x_quant.push(IQ(y) * scale_factor_data.scalefactor[section_data.sect_start[g][i]]);
              }
              if (Math.abs(z) === 16) {
                  let count = 0;
                  while (true) {
                    if(!stream.readBool()) { break; }
                    count++;
                  }
                  const escape_word = stream.readBits(count + 4);
                  const escape_value = sign(z) * (2 ** (count + 4) + escape_word);
                  this.x_quant.push(IQ(escape_value) * scale_factor_data.scalefactor[section_data.sect_start[g][i]]);
              } else {
                this.x_quant.push(IQ(z) * scale_factor_data.scalefactor[section_data.sect_start[g][i]]);
              }
            } else {
              this.x_quant.push(IQ(y) * scale_factor_data.scalefactor[section_data.sect_start[g][i]]);
              this.x_quant.push(IQ(z) * scale_factor_data.scalefactor[section_data.sect_start[g][i]]);
            }
  
            k += 2;
          }
        }
      }
    }
  }
}
