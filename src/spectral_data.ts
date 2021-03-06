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
  readonly x_quant: number[][] = [];

  public constructor(ics_info: ICSInfo, section_data: SectionData, scale_factor_data: ScalefactorData, stream: BitStream) {    
    for (let w = 0; w < ics_info.num_windows; w++) {
      this.x_quant.push([]);
    }

    let window_offset = 0;
    for (let g = 0, window_offset = 0; g < ics_info.num_window_groups; window_offset += ics_info.window_group_length[g++]) {
      for (let i = 0; i < section_data.num_sect[g]; i++) {
        for (let sfb = section_data.sect_start[g][i]; sfb < section_data.sect_end[g][i]; sfb++) {
          for (let window = window_offset; window < window_offset + ics_info.window_group_length[g]; window++) {
            for (let k = ics_info.sect_sfb_offset[g][sfb]; k < ics_info.sect_sfb_offset[g][sfb + 1]; ) {
              if (section_data.sect_cb[g][i] === HCB.ZERO_HCB || section_data.sect_cb[g][i] === HCB.INTENSITY_HCB || section_data.sect_cb[g][i] === HCB.INTENSITY_HCB2) {
                this.x_quant[window].push(0);
                k++;
              } else if (section_data.sect_cb[g][i] === HCB.NOISE_HCB) {
                this.x_quant[window].push(Math.random() * scale_factor_data.scalefactor[g][sfb]);
                k++;
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

                this.x_quant[window].push(IQ(w) * scale_factor_data.scalefactor[g][sfb]);
                this.x_quant[window].push(IQ(x) * scale_factor_data.scalefactor[g][sfb]);
                this.x_quant[window].push(IQ(y) * scale_factor_data.scalefactor[g][sfb]);
                this.x_quant[window].push(IQ(z) * scale_factor_data.scalefactor[g][sfb]);
  
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
                      this.x_quant[window].push(IQ(escape_value) * scale_factor_data.scalefactor[g][sfb]);
                  } else {
                    this.x_quant[window].push(IQ(y) * scale_factor_data.scalefactor[g][sfb]);
                  }
                  if (Math.abs(z) === 16) {
                    let count = 0;
                    while (true) {
                      if(!stream.readBool()) { break; }
                      count++;
                    }
                    const escape_word = stream.readBits(count + 4);
                    const escape_value = sign(z) * (2 ** (count + 4) + escape_word);
                    this.x_quant[window].push(IQ(escape_value) * scale_factor_data.scalefactor[g][sfb]);
                  } else {
                    this.x_quant[window].push(IQ(z) * scale_factor_data.scalefactor[g][sfb]);
                  }
                } else {
                  this.x_quant[window].push(IQ(y) * scale_factor_data.scalefactor[g][sfb]);
                  this.x_quant[window].push(IQ(z) * scale_factor_data.scalefactor[g][sfb]);
                }
  
                k += 2;
              }
            }
          }
        }
      }
    }
  }
}
