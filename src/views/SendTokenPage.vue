<template>
  <div class="app-body">
    <h1 class="header">Send Token</h1>

    <div class="card">
      <div class="card-title">Select the Token:</div>
      <div class="card-body">
        <div class="col-left">
          <a-dropdown :trigger="['click']" v-model="dropDownVisible">
            <template #overlay>
              <TokenList
                :items="items"
                :provider="provider"
                @onItemClick="handleTokenItemClick"
                @onImportClick="onImportClick"
              />
            </template>
            <a-button class="dropdown-token-button">
              <div class="dropdown-token-button-content">
                <div class="dropdown-token-button-left">
                  <div class="token-icon">C</div>
                </div>
                <div class="dropdown-token-button-title">
                  {{
                    this.selectedToken
                      ? this.selectedToken.name
                      : 'Select a Token'
                  }}
                </div>
                <div class="dropdown-token-button-right">
                  <a-icon type="down" />
                </div>
              </div>
            </a-button>
          </a-dropdown>
        </div>
        <div class="col-right">
          <div class="balance-container">
            <div class="balance-label">
              Balance:
            </div>
            <div class="balance-value">
              {{ formatNumber(this.currentBalance) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Recipients and amounts:</div>
      <div class="card-body">
        <div class="col">
          <div>
            <div class="label">
              Enter one address and amount
              {{ tokenSymbol ? `in ${tokenSymbol}` : '' }} on each line.
              (Supports any format)
            </div>
            <div class="dd-textarea-wrapper">
              <a-textarea
                class="dd-textarea"
                placeholder="Please enter address and amount
address,000
address,000
..."
                :autoSize="{ minRows: 12, maxRows: 12 }"
                :value="recipients"
                @change="handleChangeRecipients"
              />
            </div>
          </div>

          <div v-if="recipientValues && recipientValues.length > 0">
            <div class="label gutter-top">
              Confirm
            </div>

            <div class="recipient-list">
              <div class="recipient-item-header">
                <div class="recipient-item-idx">No.</div>
                <div class="recipient-item-name">Address</div>
                <div class="recipient-item-amount">Amount</div>
              </div>

              <div
                class="recipient-item"
                v-for="(item, idx) in recipientValues"
                :key="`${idx}`"
              >
                <div class="recipient-item-idx">{{ idx + 1 }}</div>
                <div
                  :class="`recipient-item-name ${item ? 'success' : 'error'}`"
                >
                  {{ item ? item.address : 'Invalid' }}
                </div>
                <div class="recipient-item-amount">
                  {{ item ? formatNumber(item.amount, true) : '--' }}
                </div>
              </div>

              <div class="recipient-item-line" />

              <div class="recipient-item-footer">
                <div class="recipient-item-footer-name">Total</div>
                <div
                  :class="
                    `recipient-item-footer-amount ${
                      remaining < 0 ? 'error' : 'success'
                    }`
                  "
                >
                  {{ formatNumber(total, true) }}
                </div>
              </div>
              <div class="recipient-item-footer gray">
                <div class="recipient-item-footer-name">Remaining</div>
                <div class="recipient-item-footer-amount">
                  {{ formatNumber(remaining, true) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Allowance:</div>
      <div class="card-body">
        <div class="label">
          Allow smart contract to transfer tokens on your behalf.
        </div>
      </div>

      <div class="card-footer">
        <a-button
          :disabled="!isValid || sending"
          :loading="sending"
          id="btn-confirm"
          class="btn-confirm"
          type="primary"
          @click="handleSubmit"
        >
          {{ isApproved ? 'Send' : 'Approve' }}
        </a-button>
      </div>
    </div>

    <ImportTokenModal
      :visible="importModalVisible"
      :provider="provider"
      :items="items"
      @onSubmit="handleSubmitImport"
      @onCancel="handleCancelImport"
    />
  </div>
</template>

<script>
import _ from 'lodash';
import { notification } from 'ant-design-vue';
import { formatNumber as _formatNumber } from '@/utils/common';
import MixinMetamaskConnect from '@/mixins/metamask-connect.mixin';
import MixinToken from '@/mixins/token.mixin';
import TokenList from '@/components/TokenList';
import ImportTokenModal from '@/components/ImportTokenModal';

export default {
  mixins: [MixinMetamaskConnect, MixinToken],
  components: {
    TokenList,
    ImportTokenModal,
  },
  data() {
    return {
      recipients: '',
      recipientValues: [],
      total: 0,
      importModalVisible: false,
      dropDownVisible: false,
      selectedToken: null,
      sending: false,
      isApproved: false,
    };
  },
  computed: {
    isValid() {
      if (this.total <= 0) return false;
      if (!this.selectedToken) return false;
      if (this.remaining < 0) return false;
      if (!this.recipientValues || this.recipientValues.length <= 0)
        return false;
      return true;
    },
    currentBalance() {
      if (!this.selectedToken || !this.balanceData) return 0;
      return this.balanceData[this.selectedToken.address] || 0;
    },
    remaining() {
      return this.currentBalance - this.total;
    },
    tokenSymbol() {
      return this.selectedToken ? this.selectedToken.symbol : null;
    },
  },
  watch: {
    recipients(newValues) {
      this.buildRecipientValuesFromText(newValues);
    },
    async dataKey(newValue) {
      if (this.provider && this.myAddress) {
        await this.loadTokenList(
          this.myAddress,
          this.provider.chainId,
          newValue,
        );
      }
      setTimeout(this.initData, 100);
    },
    myAddress(newValue) {
      if (this.provider && newValue) {
        setTimeout(() => {
          this.loadTokenList(
            this.myAddress,
            this.provider.chainId,
            this.dataKey,
          );
        }, 100);
      }
    },
  },
  mounted() {
    this.updateLoading(false);

    if (this.provider && this.myAddress) {
      this.loadTokenList(this.myAddress, this.provider.chainId, this.dataKey);
    }

    setTimeout(this.initData, 100);
  },
  methods: {
    showSuccessMessage(msg) {
      notification['success']({
        message: 'Success',
        description: msg,
      });
    },
    showErrorMessage(msg) {
      notification['error']({
        message: 'Error',
        description: msg,
      });
    },
    resetData() {
      this.recipients = '';
      this.recipientValues = [];
      this.total = 0;
      this.sending = false;
      this.isApproved = false;
    },
    formatNumber(v, hasSuffix = false) {
      if (!hasSuffix || !this.selectedToken) return _formatNumber(v);

      return `${_formatNumber(v)} ${this.selectedToken.symbol}`;
    },
    initData() {
      if (this.items && this.items.length > 0) {
        this.selectedToken = this.items[0];
      } else {
        this.selectedToken = null;
      }
      this.buildRecipientValuesFromText(this.recipients);
    },
    buildRecipientValuesFromText(values) {
      if (!values || !_.trim(values)) {
        this.total = 0;
        this.recipientValues = [];
        return;
      }

      const lines = _.trim(values).split('\n');
      const items = lines.map(s => {
        if (_.isEmpty(_.trim(s))) return null;

        const pair = s.split(',');
        if (!pair || pair.length !== 2) return null;

        let address = _.trim(pair[0]);
        if (_.isEmpty(address) || address.length != 42) return null;

        let amount = 0;
        try {
          amount = parseFloat(_.trim(pair[1]));
        } catch (err) {
          amount = 0;
        }
        if (isNaN(amount)) return null;

        return {
          address,
          amount,
        };
      });
      this.total = (items || []).reduce((acc, item) => {
        return acc + (item ? item.amount : 0);
      }, 0);
      this.recipientValues = items;
    },
    async handleAddAddress(tokenAddress) {
      console.log('Check token:', tokenAddress);
      const info = await this.getTokenInfo(tokenAddress);
      console.log('Check token:', info);
    },
    onImportClick() {
      this.dropDownVisible = false;
      this.importModalVisible = true;
    },
    handleCancelImport() {
      this.importModalVisible = false;
    },
    handleSubmitImport(token) {
      this.addToken(token);
      this.selectedToken = token;
      this.importModalVisible = false;
    },
    handleChangeRecipients(e) {
      this.recipients = e.target.value;
    },
    handleTokenItemClick(item) {
      this.selectedToken = item;
      this.dropDownVisible = false;

      if (item) {
        this.loadBalance([item.address], [item.decimals]);
      }
    },
    async handleSubmit() {
      try {
        const token = this.selectedToken.address;
        const decimals = this.selectedToken.decimals || 18;
        const receivers = [];
        const amounts = [];
        let total = 0.0;

        for (let i = 0; i < this.recipientValues.length; i = i + 1) {
          const item = this.recipientValues[i];
          if (item) {
            receivers.push(item.address);
            amounts.push(item.amount);
            total = total + item.amount;
          }
        }
        if (total <= 0) return;

        this.sending = true;

        const allowance = await this.getAllowance(token, decimals);
        console.log(`allowance(${decimals}): ${allowance}`);

        let rs = null;
        if (allowance < total) {
          rs = await this.approveERC20(token, total, decimals);
          this.isApproved = true;
          this.showSuccessMessage('Approve token successfully');
        } else {
          rs = await this.disperseToken(token, receivers, amounts, decimals);
          this.showSuccessMessage('Send token successfully');
          this.resetData();
        }
        console.log('done', rs);
      } catch (err) {
        console.log('handleSubmit error', err);

        this.showErrorMessage(
          err.message || 'An error has occurred please try again later',
        );
      }

      this.sending = false;
    },
  },
};
</script>

<style scoped>
.gutter-top {
  margin-top: 20px !important;
}
.col-left {
  flex: 0.5;
}
.col-right {
  flex: 0.5;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}
.label {
  color: rgb(133, 133, 141);
  font-size: 14px;
  margin: 0px 0px 8px;
}
.col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.dropdown-token-button {
  height: 40px;
  width: 300px;
  padding: 0px;
  border-radius: 8px;
}
.dropdown-token-button-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.dropdown-token-button-left {
  height: 30px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dropdown-token-button-title {
  flex: 1;
  text-align: left;
  line-height: 20px;
  font-size: 16px;
  margin-left: 4px;
}
.dropdown-token-button-right {
  height: 30px;
  width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.token-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  line-height: 1;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: solid 1px #434343;
}
.balance-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 16px;
}
.balance-label {
  flex: 1;
}
.balance-value {
  min-width: 200px;
  text-align: right;
  padding: 0px 6px;
  margin-left: 12px;
  border-bottom: 1px solid #aaa;
}
.recipient-list {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.recipient-item-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
  margin-bottom: 8px;
  color: rgb(133, 133, 141);
}
.recipient-item-footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
  margin-top: 8px;
}
.recipient-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
}
.recipient-item-idx {
  width: 40px;
  text-align: center;
}
.recipient-item-name {
  flex: 1;
  padding: 0px 10px;
  align-items: left;
}
.recipient-item-amount {
  width: 200px;
  text-align: right;
  padding-right: 0px;
}
.recipient-item-footer-name {
  flex: 1;
  padding: 0px 10px;
  align-items: left;
}
.recipient-item-footer-amount {
  width: 200px;
  text-align: right;
  padding-right: 0px;
}
.recipient-item-line {
  margin-left: 8px;
  margin-top: 16px;
  width: calc(100% - 8px);
  height: 1px;
  background-color: #888;
}
.gray {
  color: #888;
}
.error {
  color: rgb(255, 77, 79);
}
.success {
  color: #fff;
}
</style>
