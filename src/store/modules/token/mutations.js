import { deepClone } from '@/utils/common.js';
import {
  UPDATE_LOADING,
  UPDATE_SENDING,
  RESET_STATE,
  UPDATE_TOKEN_LIST,
  UPDATE_TOKEN_BALANCE,
} from './constants';

export default {
  [UPDATE_LOADING](state, payload) {
    state.loading = payload;
  },
  [UPDATE_SENDING](state, payload) {
    state.sending = payload;
  },
  [RESET_STATE](state) {
    state.loading = false;
    state.sending = false;
  },
  [UPDATE_TOKEN_LIST](state, payload) {
    state.data = deepClone({
      ...state.data,
      [payload.key]: payload.items,
    });
  },
  [UPDATE_TOKEN_BALANCE](state, payload) {
    const newBalance = deepClone({
      ...state.balance,
    });
    for (let i = 0; i < payload.tokens.length; i = i + 1) {
      newBalance[payload.tokens[i]] = payload.amounts[i];
    }
    state.balance = newBalance;
  },
};
