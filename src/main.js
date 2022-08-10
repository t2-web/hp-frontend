import _ from 'lodash';
import Vue from 'vue';
import App from './App.vue';
import i18n from '@/plugins/vue-i18n';
import Antd from 'ant-design-vue';
import router from './router';
import store from './store';
import globalMixin from '@/mixins/global.mixin.js';
import '@/plugins/vue-filter-truncate';

import './assets/css/index.less'; // variables to override above

// add moments
Vue.use(require('vue-moment'));

//add clipboard
import VueClipboard from 'vue-clipboard2';
Vue.use(VueClipboard);

// Vee-validate START
import * as rules from 'vee-validate/dist/rules';
import {
  configure,
  extend,
  ValidationObserver,
  ValidationProvider,
} from 'vee-validate';
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
configure({
  defaultMessage: (field, values) => {
    console.log(field, 'field');
    values._field_ = i18n.t(`fields.${field}`);
    if (values._field_.indexOf(`fields.`) !== -1) {
      values._field_ = values._field_.replace('fields.', '');
    }
    if (values._rule_ == 'decimal' && !values['0']) {
      values._rule_ = 'decimal_any';
    }
    console.log(values._rule_, 'values._rule_');

    // custom for wallet balance === 0
    if (values._rule_ === 'max_value' && values.max === 0) {
      return i18n.t(`Insufficient amount`);
    }
    return i18n.t(`messages.${values._rule_}`, values);
  },
});

Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule]);
});
extend('decimal', {
  validate: (value, [decimals = '*', separator = '.']) => {
    if (value === null || value === undefined || value === '') {
      return {
        valid: false,
      };
    }
    if (Number(decimals) === 0) {
      return {
        valid: /^-?\d*$/.test(value),
      };
    }
    const regexPart = decimals === '*' ? '+' : `{1,${decimals}}`;
    const regex = new RegExp(
      `^[-+]?\\d*(\\${separator}\\d${regexPart})?([eE]{1}[-]?\\d+)?$`,
    );

    return {
      valid: regex.test(value),
    };
  },
});
extend('send_myself', {
  validate: (value, [myAddress]) => {
    if (value && _.toLower(value) === _.toLower(myAddress)) {
      return {
        valid: false,
      };
    }
    return {
      valid: true,
    };
  },
});
// Vee-validate END

Vue.config.productionTip = false;

Vue.use(Antd);

// Vue.prototype.$http = http;

new Vue({
  mixins: [globalMixin],
  data: { loading: false },
  router,
  store,
  render: h => h(App),
}).$mount('#app');
