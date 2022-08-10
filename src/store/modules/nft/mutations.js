import { deepClone } from '@/utils/common.js';
import {
  UPDATE_MINTING,
  UPDATE_LOADING,
  RESET_STATE,
  CHANGE_MODE,
  UPDATE_NFT_DATA,
  UPDATE_NFT_METADATA,
} from './constants';

export default {
  [UPDATE_MINTING](state, payload) {
    state.minting = payload;
  },
  [UPDATE_LOADING](state, payload) {
    state.loading = payload;
  },
  [CHANGE_MODE](state, payload) {
    state.mode = payload;
  },
  [RESET_STATE](state) {
    state.loading = false;
    state.minting = false;
    state.data = {};
  },
  [UPDATE_NFT_DATA](state, payload) {
    state.data = deepClone({
      ...state.data,
      [payload.key]: payload.items,
    });
  },
  [UPDATE_NFT_METADATA](state, payload) {
    state.metadata = deepClone({
      ...state.metadata,
      [payload.tokenURI]: payload.data,
    });
  },
};
