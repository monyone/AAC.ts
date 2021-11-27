import BinarySearchTree from './binary_search_tree';
import BitStream from './bitstream';
import { HCB } from './constant';
import ICSInfo from './ics_info';
import SectionData from './section_data'
import { HUFFMAN_SF, HUFFMAN_SF_FUNC } from './huffman';

export default class ScalefactorData {
  readonly scalefactor: number[][] = [];

  public constructor (global_gain: number, ics_info: ICSInfo, section_data: SectionData, stream: BitStream) {
    let scalefactor = global_gain;
    let noise: number | null = null;

    for (let g = 0; g < ics_info.num_window_groups; g++) {
      this.scalefactor.push([]);
      for (let sfb = 0; sfb < ics_info.max_sfb; sfb++) {
        if (section_data.sfb_cb[g][sfb] === HCB.ZERO_HCB) {
          this.scalefactor[g].push(0);
          continue;
        } else if (section_data.sfb_cb[g][sfb] === HCB.INTENSITY_HCB || section_data.sfb_cb[g][sfb] === HCB.INTENSITY_HCB2) {
          throw new Error('Not implemented yet.')
        } else if (section_data.sfb_cb[g][sfb] === HCB.NOISE_HCB) {
          if (noise == null) {
            noise = (stream.readBits(9) - 256) - (global_gain - 90);
          } else {
            let tree: BinarySearchTree | null = HUFFMAN_SF;
            while (tree && !tree.isLeaf) {
              tree = tree.select(stream.readBits(1));
            }
            if (!tree) { throw new Error('No Huffman Code Available!'); }

            const hcod_sf = HUFFMAN_SF_FUNC(tree.index!);
            noise += hcod_sf;
          }
          this.scalefactor[g].push(-Math.pow(2, noise / 4));
        } else {
          let tree: BinarySearchTree | null = HUFFMAN_SF;
          while (tree && !tree.isLeaf) {
            tree = tree.select(stream.readBits(1));
          }
          if (!tree) { throw new Error('No Huffman Code Available!'); }

          const hcod_sf = HUFFMAN_SF_FUNC(tree.index!);
          scalefactor += hcod_sf;
          this.scalefactor[g].push(Math.pow(2, (scalefactor - 100) / 4));
        }
      }
    }
  }
}
