<template>
  <div>
    <ValidationObserver ref="validator" v-slot="{ invalid }">
      <a-modal
        :visible="visible"
        :title="title"
        :confirm-loading="loading"
        :closable="false"
        :maskClosable="false"
        :cancel-button-props="{ props: { disabled: loading } }"
        :ok-button-props="{ props: { disabled: invalid } }"
        :okText="loading ? 'Sending' : 'Send'"
        cancelText="Close"
        @ok="handleOk"
        @cancel="handleCancel"
      >
        <ValidationProvider
          name="address"
          :rules="addressRule"
          v-slot="{ errors }"
        >
          <p class="title">Receiver wallet address</p>
          <a-input
            allowClear
            :disabled="loading"
            :value="address"
            placeholder="Please enter a address"
            @change="onChangeAddress"
          />
          <p v-if="errors[0]" class="m-error-mess">
            {{ errors[0] }}
          </p>
        </ValidationProvider>

        <div v-if="type === '1155'" class="amount-wrapper">
          <ValidationProvider
            name="quantity"
            :rules="amountRule"
            v-slot="{ errors }"
          >
            <p class="title">
              {{ `Quantity (Maximum: ${item ? item.amount : 0})` }}
            </p>
            <a-input
              allowClear
              :disabled="loading"
              :value="amount"
              placeholder="Please enter a quantity"
              @change="onChangeAmount"
            />
            <p v-if="errors[0]" class="m-error-mess">
              {{ errors[0] }}
            </p>
          </ValidationProvider>
        </div>
      </a-modal>
    </ValidationObserver>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    visible: Boolean,
    loading: Boolean,
    item: Object,
    type: String,
    myAddress: String,
  },
  data() {
    return {
      address: '',
      amount: undefined,
    };
  },
  computed: {
    ...mapState({
      metadata(state) {
        if (!this.item) return null;
        return state.nft?.metadata[this.item.tokenURI] || null;
      },
    }),
    title() {
      return `Send ${this.type === '721' ? 'ERC-721 NFT' : 'ERC-1155 NFT'}: #${
        this.item ? this.item.tokenId : '--'
      }`;
    },
    addressRule() {
      return {
        required: true,
        max: 42,
        send_myself: this.myAddress,
      };
    },
    amountRule() {
      return {
        required: true,
        integer: true,
        min_value: 1,
        max_value: this.item ? this.item.amount : undefined,
      };
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
      this.address = '';
      this.amount = undefined;
      this.$refs.validator.reset();
    },
    onChangeAddress(e) {
      this.address = e.target.value;
    },
    onChangeAmount(e) {
      this.amount = e.target.value;
    },
    handleOk() {
      if (this.loading) return;
      this.$emit('onSubmit', {
        item: this.item,
        address: this.address,
        amount: parseInt(this.amount),
      });
    },
    handleCancel() {
      this.$emit('onCancel', this.item);
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
</style>
