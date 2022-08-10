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
        :okText="loading ? 'Burning' : 'Burn'"
        cancelText="Close"
        @ok="handleOk"
        @cancel="handleCancel"
      >
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
        <div v-else>
          <p class="title">
            Are you sure to burn this NFT?
          </p>
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
  },
  data() {
    return {
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
      return `Burn ${this.type === '721' ? 'ERC-721 NFT' : 'ERC-1155 NFT'}: #${
        this.item ? this.item.tokenId : '--'
      }`;
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
      this.amount = undefined;
      this.$refs.validator.reset();
    },
    onChangeAmount(e) {
      this.amount = e.target.value;
    },
    handleOk() {
      if (this.loading) return;
      this.$emit('onSubmit', {
        item: this.item,
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
.title {
  margin-bottom: 8px;
}
.m-error-mess {
  color: rgb(255, 77, 79);
  font-size: 12px;
  margin: 6px 10px 0px 10px;
}
</style>
