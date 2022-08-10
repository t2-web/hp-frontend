import { env } from '@/constants';
import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import wallet from './modules/wallet';
import nft from './modules/nft';
import token from './modules/token';

Vue.use(Vuex);

const persistenceOptions = {
  key: ['vuex', env.app.name, env.app.version].join('-'),
  storage: window.localStorage,
};

export default new Vuex.Store({
  modules: {
    wallet,
    nft,
    token,
  },
  plugins: [new VuexPersistence(persistenceOptions).plugin],
});
