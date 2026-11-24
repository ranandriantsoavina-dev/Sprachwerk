import type { Question } from '../../types/domain';
import { QUESTIONS_A1_01_MC_GF } from './a1_01_mc_gf';
import { QUESTIONS_A1_01_SC_TR } from './a1_01_sc_tr';
import { QUESTIONS_A1_01_MA_TF } from './a1_01_ma_tf';
import { QUESTIONS_A1_01_YN_EC } from './a1_01_yn_ec';

export const QUESTIONS_A1_01: Question[] = [
  ...QUESTIONS_A1_01_MC_GF,
  ...QUESTIONS_A1_01_SC_TR,
  ...QUESTIONS_A1_01_MA_TF,
  ...QUESTIONS_A1_01_YN_EC,
];
