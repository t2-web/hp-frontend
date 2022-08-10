<template>
  <div>
    <a-modal
      :visible="visible"
      :title="title"
      :confirm-loading="loading"
      :closable="false"
      :maskClosable="false"
      :cancel-button-props="{ props: { disabled: loading } }"
      :ok-button-props="{ props: { disabled: !token } }"
      okText="Import"
      cancelText="Close"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div>
        <p class="title">{{ tokenName }} token address</p>
        <a-input
          allowClear
          :disabled="loading"
          :value="address"
          placeholder="Please enter a address"
          @change="onChangeAddress"
        />
        <p v-if="errorMessage" class="m-error-mess">
          {{ errorMessage }}
        </p>
        <p class="token" v-if="token">
          {{ `${token.name} (${token.symbol})` }}
        </p>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import tokenUtil from '@/utils/contracts/token';

export default {
  props: {
    visible: Boolean,
    provider: Object,
    items: Array,
  },
  data() {
    return {
      loading: false,
      address: '',
      token: null,
      errorMessage: '',
    };
  },
  computed: {
    ...mapState({}),
    title() {
      if (
        this.provider &&
        (this.provider.chainId === 97 || this.provider.chainId === 56)
      ) {
        return 'Import BEP20 Token';
      }
      return 'Import ERC20 Token';
    },
    tokenName() {
      if (
        this.provider &&
        (this.provider.chainId === 97 || this.provider.chainId === 56)
      ) {
        return 'BEP20';
      }
      return 'ERC20';
    },
  },
  watch: {
    visible(newValue, oldValue) {
      if (!newValue && oldValue) {
        this.resetData();
      }
    },
  },
  methods: {
    resetData() {
      this.errorMessage = '';
      this.address = '';
      this.token = null;
    },
    async checkTokenInfo(token) {
      if (this.provider) {
        const info = await tokenUtil.getTokenInfo(this.provider, token);
        console.log('checkTokenInfo:', info);
        this.token = info;
      }
    },
    onChangeAddress(e) {
      this.errorMessage = '';

      const v = e.target.value;
      this.address = v;
      if (v && v.length === 42) {
        const s = v.toLowerCase();
        let t = null;
        if (this.items) {
          t = this.items.find(item => item.address.toLowerCase() === s);
        }
        if (t) {
          this.token = null;
          this.errorMessage = 'Token has already been added';
        } else {
          this.checkTokenInfo(v);
        }
      }
    },
    handleOk() {
      if (this.loading) return;
      this.$emit('onSubmit', this.token);
    },
    handleCancel() {
      this.$emit('onCancel');
    },
  },
};
</script>

<style scoped>
.nft-name {
  font-weight: 700;
  margin-left: 10px;
}
.title {
  margin-bottom: 8px;
}
.amount-wrapper {
  margin-top: 16px;
}
.m-error-mess {
  color: rgb(255, 77, 79);
  font-size: 12px;
  margin: 6px 10px 0px 10px;
}
.token {
  padding: 0px 10px;
  margin-top: 12px;
  margin-bottom: 0px;
  color: #4caf50;
  font-size: 14px;
}
</style>
