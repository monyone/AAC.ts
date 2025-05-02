export const SyntaxticElementIdentification  = {
  ID_SCE: 0x00,
  ID_CPE: 0x01,
  ID_PCE: 0x05,
  ID_FIL: 0x06,
  ID_END: 0x07,
} as const;

export const TRANSFORM_WINDOWS = {
  LONG_WINDOW: { num_swb: 49, coeffs: 1024 },
  SHORT_WINDOW: { num_swb: 14, coeffs: 128 },
  LONG_START_WINDOW: { num_swb: 49, coeffs: 1024 },
  LONG_STOP_WINDOW: { num_swb: 49, coeffs: 1024 },
} as const;

export const WINDOW_SEQUENCES = {
  ONLY_LONG_SEQUENCE: 0,
  LONG_START_SEQUENCE: 1,
  EIGHT_SHORT_SEQUENCE: 2,
  LONG_STOP_SEQUENCE: 3,
} as const;

export const WINDOW_SEQUENCES_TO_NUM_WINDOWS = [
  1,
  1,
  8,
  1,
] as const;

export const WINDOW_SEQUENCES_TO_TRANSFORM_MODE = [
  TRANSFORM_WINDOWS.LONG_WINDOW,
  TRANSFORM_WINDOWS.LONG_START_WINDOW,
  TRANSFORM_WINDOWS.SHORT_WINDOW,
  TRANSFORM_WINDOWS.LONG_STOP_WINDOW,
] as const;

export const UPPER_SPECTRAL_LIMIT_FOR_PREDICTION = [
  { Pred_SFB_MAX: 33, NumberOfPredictors: 512, MaximumFrequencyUsingPrediction: 24000.00 }, // 96000
  { Pred_SFB_MAX: 33, NumberOfPredictors: 512, MaximumFrequencyUsingPrediction: 22050.00 }, // 88200
  { Pred_SFB_MAX: 38, NumberOfPredictors: 664, MaximumFrequencyUsingPrediction: 20750.00 }, // 64000
  { Pred_SFB_MAX: 40, NumberOfPredictors: 672, MaximumFrequencyUsingPrediction: 15750.00 }, // 48000
  { Pred_SFB_MAX: 40, NumberOfPredictors: 672, MaximumFrequencyUsingPrediction: 14470.31 }, // 44100
  { Pred_SFB_MAX: 40, NumberOfPredictors: 672, MaximumFrequencyUsingPrediction: 10500.00 }, // 32000
  { Pred_SFB_MAX: 41, NumberOfPredictors: 652, MaximumFrequencyUsingPrediction: 7640.63 },  // 24000
  { Pred_SFB_MAX: 41, NumberOfPredictors: 652, MaximumFrequencyUsingPrediction: 7019.82 },  // 22050
  { Pred_SFB_MAX: 37, NumberOfPredictors: 664, MaximumFrequencyUsingPrediction: 5187.50 },  // 16000
  { Pred_SFB_MAX: 37, NumberOfPredictors: 664, MaximumFrequencyUsingPrediction: 3890.63 },  // 12000
  { Pred_SFB_MAX: 37, NumberOfPredictors: 664, MaximumFrequencyUsingPrediction: 3574.51 },  // 11025
  { Pred_SFB_MAX: 34, NumberOfPredictors: 664, MaximumFrequencyUsingPrediction: 2593.75 },  // 8000
] as const;

export const HCB = {
  ZERO_HCB: 0,
  FIRST_PAIR_HCB: 5,
  ESC_HCB: 11,
  NOISE_HCB: 13,
  INTENSITY_HCB2: 14,
  INTENSITY_HCB: 15,
} as const;

export const SCALEFACTOR_BANDS = [
  {
    // 96000
    num_swb_long_window: 41,
    swb_offset_long_window: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 64, 72, 80, 88, 96, 108, 120, 132, 144, 156, 172, 188, 212, 240, 276, 320, 384, 448, 512, 576, 640, 704, 768, 832, 896, 960, 1024],
    num_swb_short_window: 12,
    swb_offset_short_window: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 92, 128],
  },
  {
    // 88200
    num_swb_long_window: 41,
    swb_offset_long_window: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 64, 72, 80, 88, 96, 108, 120, 132, 144, 156, 172, 188, 212, 240, 276, 320, 384, 448, 512, 576, 640, 704, 768, 832, 896, 960, 1024],
    num_swb_short_window: 12,
    swb_offset_short_window: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 92, 128],
  },
  {
    // 64000
    num_swb_long_window: 47,
    swb_offset_long_window: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 64, 72, 80, 88, 100, 112, 124, 140, 156, 172, 192, 216, 240, 268, 304, 344, 384, 424, 464, 504, 544, 584, 624, 664, 704, 744, 784, 824, 864, 904, 944, 984, 1024],
    num_swb_short_window: 12,
    swb_offset_short_window: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 92, 128],
  },
  { // 48000 (OK)
    num_swb_long_window: 49,
    swb_offset_long_window: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 88, 96, 108, 120, 132, 144, 160, 176, 196, 216, 240, 264, 292, 320, 352, 384, 416, 448, 480, 512, 544, 576, 608, 640, 672, 704, 736, 768, 800, 832, 864, 896, 928, 1024],
    num_swb_short_window: 14,
    swb_offset_short_window: [0, 4, 8, 12, 16, 20, 28, 36, 44, 56, 68, 80, 96, 112, 128],
  },
  { // 44100 (OK)
    num_swb_long_window: 49,
    swb_offset_long_window: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 88, 96, 108, 120, 132, 144, 160, 176, 196, 216, 240, 264, 292, 320, 352, 384, 416, 448, 480, 512, 544, 576, 608, 640, 672, 704, 736, 768, 800, 832, 864, 896, 928, 1024],
    num_swb_short_window: 14,
    swb_offset_short_window: [0, 4, 8, 12, 16, 20, 28, 36, 44, 56, 68, 80, 96, 112, 128],
  },
  {
    // 32000
    num_swb_long_window: 51,
    swb_offset_long_window: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 88, 96, 108, 120, 132, 144, 160, 176, 196, 216, 240, 264, 292, 320, 352, 384, 416, 448, 480, 512, 544, 576, 608, 640, 672, 704, 736, 768, 800, 832, 864, 896, 928, 960, 992, 1024],
    num_swb_short_window: 14,
    swb_offset_short_window: [0, 4, 8, 12, 16, 20, 28, 36, 44, 56, 68, 80, 96, 112, 128],
  },
  {
    // 24000
    num_swb_long_window: 47,
    swb_offset_long_window: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 52, 60, 68, 76, 84, 92, 100, 108, 116, 124, 136, 148, 160, 172, 188, 204, 220, 240, 260, 284, 308, 336, 364, 396, 432, 468, 508, 552, 600, 652, 704, 768, 832, 896, 960, 1024],
    num_swb_short_window: 15,
    swb_offset_short_window: [0, 4, 8, 12, 16, 20, 24, 28, 36, 44, 52, 64, 76, 92, 108, 128],
  },
  {
    // 22050
    num_swb_long_window: 47,
    swb_offset_long_window: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 52, 60, 68, 76, 84, 92, 100, 108, 116, 124, 136, 148, 160, 172, 188, 204, 220, 240, 260, 284, 308, 336, 364, 396, 432, 468, 508, 552, 600, 652, 704, 768, 832, 896, 960, 1024],
    num_swb_short_window: 15,
    swb_offset_short_window: [0, 4, 8, 12, 16, 20, 24, 28, 36, 44, 52, 64, 76, 92, 108, 128],
  },
  {
    // 16000
    num_swb_long_window: 43,
    swb_offset_long_window: [0, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 100, 112, 124, 136, 148, 160, 172, 184, 196, 212, 228, 244, 260, 280, 300, 320, 344, 368, 396, 424, 456, 492, 532, 572, 616, 664, 716, 772, 832, 896, 960, 1024],
    num_swb_short_window: 15,
    swb_offset_short_window: [0, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 60, 72, 88, 108, 128],
  },
  {
    // 12000
    num_swb_long_window: 43,
    swb_offset_long_window: [0, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 100, 112, 124, 136, 148, 160, 172, 184, 196, 212, 228, 244, 260, 280, 300, 320, 344, 368, 396, 424, 456, 492, 532, 572, 616, 664, 716, 772, 832, 896, 960, 1024],
    num_swb_short_window: 15,
    swb_offset_short_window: [0, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 60, 72, 88, 108, 128],
  },
  {
    // 11025
    num_swb_long_window: 43,
    swb_offset_long_window: [0, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 100, 112, 124, 136, 148, 160, 172, 184, 196, 212, 228, 244, 260, 280, 300, 320, 344, 368, 396, 424, 456, 492, 532, 572, 616, 664, 716, 772, 832, 896, 960, 1024],
    num_swb_short_window: 15,
    swb_offset_short_window: [0, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 60, 72, 88, 108, 128],
  },
  {
    // 8000
    num_swb_long_window: 40,
    swb_offset_long_window: [0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144, 156, 172, 188, 204, 220, 236, 252, 268, 288, 308, 328, 348, 372, 396, 420, 448, 476, 508, 544, 580, 620, 664, 712, 764, 820, 880, 944, 1024],
    num_swb_short_window: 15,
    swb_offset_short_window: [0, 4, 8, 12, 16, 20, 24, 28, 36, 44, 52, 60, 72, 88, 108, 128],
  },
] as const;
