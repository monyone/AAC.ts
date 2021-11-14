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

// TODO: FILL DATA
export const SCALEFACTOR_BANDS = [
  {
    // 96000
    num_swb_long_window: 41,
    swb_offset_long_window: [],
    num_swb_short_winodw: 12,
    swb_offset_short_window: [],
  },
  {
    // 88200
    num_swb_long_window: 41,
    swb_offset_long_window: [],
    num_swb_short_winodw: 12,
    swb_offset_short_window: [],
  },
  {
    // 64000
    num_swb_long_window: 47,
    swb_offset_long_window: [],
    num_swb_short_winodw: 12,
    swb_offset_short_window: [],
  },
  { // 48000 (OK)
    num_swb_long_window: 49,
    swb_offset_long_window: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 88, 96, 108, 120, 132, 144, 160, 176, 196, 216, 240, 264, 292, 320, 352, 384, 416, 448, 480, 512, 544, 576, 608, 640, 672, 704, 736, 768, 800, 832, 864, 896, 928, 1024],
    num_swb_short_winodw: 14,
    swb_offset_short_window: [0, 4, 8, 12, 16, 20, 28, 36, 44, 56, 68, 80, 96, 112, 128],
  },
  { // 44100 (OK)
    num_swb_long_window: 49,
    swb_offset_long_window: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 88, 96, 108, 120, 132, 144, 160, 176, 196, 216, 240, 264, 292, 320, 352, 384, 416, 448, 480, 512, 544, 576, 608, 640, 672, 704, 736, 768, 800, 832, 864, 896, 928, 1024],
    num_swb_short_winodw: 14,
    swb_offset_short_window: [0, 4, 8, 12, 16, 20, 28, 36, 44, 56, 68, 80, 96, 112, 128],
  },
  {
    // 32000
    num_swb_long_window: 51,
    swb_offset_long_window: [],
    num_swb_short_winodw: 14,
    swb_offset_short_window: [],
  },
  {
    // 24000
    num_swb_long_window: 47,
    swb_offset_long_window: [],
    num_swb_short_winodw: 15,
    swb_offset_short_window: [],
  },
  {
    // 22050
    num_swb_long_window: 47,
    swb_offset_long_window: [],
    num_swb_short_winodw: 15,
    swb_offset_short_window: [],
  },
  {
    // 16000
    num_swb_long_window: 43,
    swb_offset_long_window: [],
    num_swb_short_winodw: 15,
    swb_offset_short_window: [],
  },
  {
    // 12000
    num_swb_long_window: 43,
    swb_offset_long_window: [],
    num_swb_short_winodw: 15,
    swb_offset_short_window: [],
  },
  {
    // 11025
    num_swb_long_window: 43,
    swb_offset_long_window: [],
    num_swb_short_winodw: 15,
    swb_offset_short_window: [],
  },
  {
    // 8000
    num_swb_long_window: 49,
    swb_offset_long_window: [],
    num_swb_short_winodw: 15,
    swb_offset_short_window: [],
  },
] as const;