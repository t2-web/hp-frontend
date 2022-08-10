import { mapState, mapMutations } from 'vuex';
import { toWei } from '@/utils/contracts/web3';
import backend from '@/utils/backend/index';
import tokenUtil from '@/utils/contracts/token';

export default {
  computed: {
    ...mapState({
      provider: state => {
        return state.wallet?.provider || null;
      },
      myAddress: state => {
        return state.wallet?.provider?.address || null;
      },
      loading: state => {
        return state.token?.loading;
      },
      dataKey: state => {
        if (state.wallet?.provider) {
          const chainId = state.wallet?.provider?.chainId;
          return `${chainId}`;
        }
        return null;
      },
      items(state) {
        if (!this.dataKey) return [];
        return state.token?.data[this.dataKey] || [];
      },
      balanceData(state) {
        return state.token?.balance || {};
      },
    }),
  },
  methods: {
    ...mapMutations({
      updateLoading: 'token/UPDATE_LOADING',
      updateTokenData: 'token/UPDATE_TOKEN_LIST',
      updateTokenBalance: 'token/UPDATE_TOKEN_BALANCE',
    }),

    async loadBalance(tokens, decimals = []) {
      const provider = this.provider;
      const wallet = this.myAddress;

      const balances = await Promise.all(
        tokens.map(async (token, idx) => {
          const d = decimals ? decimals[idx] || 18 : 18;
          return {
            token,
            amount: await tokenUtil.getBalanceCoin(provider, wallet, token, d),
          };
        }),
      );

      this.updateTokenBalance({
        tokens: balances.map(b => b.token),
        amounts: balances.map(b => b.amount),
      });
    },

    addToken(token) {
      const newItems = [...(this.items || []), token];
      this.updateTokenData({ key: this.dataKey, items: newItems });
      this.loadAllBalance();
    },

    async loadAllBalance() {
      this.loadBalance(
        this.items.map(item => item.address),
        this.items.map(item => item.decimals),
      );
    },

    async loadTokenList(owner, chainId, path) {
      if (!chainId || !path) return;
      if (this.items && this.items.length > 0) {
        this.loadAllBalance();
        return;
      }

      console.log(`========loadTokenList: ${path}`);

      this.updateLoading(true);
      let items = [];
      try {
        items = await backend.token.getList(owner, chainId);
      } catch (ex) {
        console.log(ex);
      } finally {
        this.updateLoading(false);
        this.updateTokenData({ key: path, items });

        this.loadAllBalance();
      }
    },

    async getTokenInfo(token) {
      return await tokenUtil.getTokenInfo(this.provider, token);
    },

    async getAllowance(token, decimals = 18) {
      return await tokenUtil.getAllowance(
        this.provider,
        this.myAddress,
        token,
        decimals,
      );
    },

    async disperseToken(token, recipients, amounts, decimals = 18) {
      return await tokenUtil.disperseToken(
        this.provider,
        this.myAddress,
        token,
        recipients,
        amounts.map(a => toWei(`${a}`, decimals)),
      );
    },

    async approveERC20(token, amount, decimals = 18) {
      const convertedAmount = toWei(`${amount}`, decimals);
      console.log(`amount:${amount} - ${convertedAmount}`);
      return await tokenUtil.approveERC20(
        this.provider,
        this.myAddress,
        token,
        convertedAmount,
      );
    },
  },
};
