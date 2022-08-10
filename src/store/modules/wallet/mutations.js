import { UPDATE_WALLET, UPDATE_LOADING, RESET_STATE } from './constants';
import { deepClone } from '@/utils/common.js';

export default {
  [UPDATE_WALLET](state, { provider }) {
    state.provider = deepClone({ ...state.provider, ...provider });
  },
  [UPDATE_LOADING](state, payload) {
    state.loading = payload;
  },
  [RESET_STATE](state) {
    state.loading = false;
    state.provider = {
      isMetaMask: false,
      chainId: '',
      address: '',
      balance: 0,
    };
  },
};
