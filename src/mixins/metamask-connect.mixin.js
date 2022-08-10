import _ from 'lodash';
import Web3 from 'web3';
import web3Modal from '@/plugins/web3modal';
import { mapState, mapMutations } from 'vuex';
import { metamask, env } from '@/constants';
import { message } from 'ant-design-vue';
import { getNetworkCode } from '@/utils/contracts/nft';

const metamaskConstant = metamask;
const SUPPORTED_CHAIN_ID_LIST = env.app.rpcMetamask.chainIds;

export default {
  data() {
    return {
      visibleModal: false,
      web3Modal: web3Modal,
      numberConnet: 0,
    };
  },
  computed: {
    ...mapState({
      walletProvider: state => state.wallet?.provider || null,
    }),
    isConnected() {
      if (!this.walletProvider) return false;
      return !_.isEmpty(this.walletProvider.address);
    },
    userAddress() {
      if (!this.walletProvider) return null;
      return this.walletProvider.address;
    },
    networkName() {
      const chainId = this.walletProvider ? this.walletProvider.chainId : 0;
      return _.toUpper(getNetworkCode(chainId) || '--');
    },
  },
  methods: {
    ...mapMutations({
      updateWallet: 'wallet/UPDATE_WALLET',
      resetStore: 'wallet/RESET_STATE',
      updateLoading: 'wallet/UPDATE_LOADING',
    }),
    hideModalWrongNetwork() {
      this.visibleModal = false;
    },
    async handleConnect(connectorId = 'injected', skipSwitch = false) {
      try {
        this.updateLoading(true);
        connectorId = connectorId ? connectorId : 'injected';
        this.hideMobileLink();

        let provider;
        if (window.ethereum && window.ethereum.isSafePal) {
          provider = window.ethereum;
        } else {
          provider = await web3Modal.connectTo(connectorId);
        }
        console.log('===>provider: ', provider);
        const isMatchChain = await this.isMatchChain(provider);
        console.log('===>isMatchChain: ', isMatchChain);

        if (isMatchChain) {
          return this.connect(provider, connectorId);
        }

        if (!provider.isMetaMask) {
          this.resetApp(provider);
          this.visibleModal = true;
          message.error('Wrong Network!');
        } else if (!skipSwitch) {
          this.switchOrAddChain(provider, connectorId);
        }
      } catch (error) {
        console.log('Could not get a wallet connection', error);
      } finally {
        this.updateLoading(false);
      }
    },
    async connect(provider, connectorId) {
      console.log('---->connectorId: ', connectorId);
      this.numberConnet = this.numberConnet + 1;
      this.subscriber(provider, this.numberConnet);
      const web3 = this.initWeb3(provider);
      const address = await this.getAccounts(web3);
      const chainId = await web3.eth.net.getId();
      if (!address) {
        this.handleErrorAddress(provider);
      }
      const dataUpdate = {
        isMetaMask: provider.isMetaMask ? provider.isMetaMask : false,
        chainId: chainId,
        address: address,
        type: connectorId,
      };
      this._handelLogin(web3, dataUpdate);

      window.wallet = web3;
      if (provider.isWalletConnect) {
        delete window.wallet.currentProvider.__proto__.request;
        Object.hasOwnProperty.call(window.wallet.currentProvider, 'request') &&
          delete window.wallet.currentProvider.request;
      }
    },
    async switchOrAddChain(provider, connectorId) {
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: metamaskConstant.chainId }],
        });

        const isMatchChain = await this.isMatchChain(provider);
        if (!isMatchChain) {
          this.resetApp(provider);
          return;
        }
        return this.connect(provider, connectorId);
      } catch (error) {
        console.log('-->error');
      }
    },
    async isMatchChain(provider) {
      const web3 = this.initWeb3(provider);
      const chainId = await web3.eth.net.getId();
      return SUPPORTED_CHAIN_ID_LIST.includes(chainId);
    },
    async subscriber(provider, numberConnet) {
      if (!provider.on) {
        return;
      }
      provider.on('accountsChanged', async accounts => {
        console.log('--->accounts: ', accounts);
        if (this.numberConnet != numberConnet) return;
        if (accounts && accounts.length !== 0) {
          if (accounts[0] == this.walletProvider.address) {
            return;
          }
          this.handelChangeAccount(accounts[0]);
        } else {
          this.resetApp();
        }

        this.$root.$emit('wallet-change-account');
      });
      provider.on('chainChanged', async chainId => {
        if (this.numberConnet != numberConnet) return;
        const networkId = parseInt(chainId);
        console.log(`--->chainChanged:${networkId}`);
        if (!SUPPORTED_CHAIN_ID_LIST.includes(networkId)) {
          console.log('===chainChanged: resetApp');
          this.visibleModal = true;
          this.resetApp();
        } else if (window.ethereum) {
          this.handleConnect('injected', true);
        }
      });
      /*provider.on('networkChanged', async networkId => {
        console.log(`===numberConnet:${numberConnet}`)
        const chainId = parseInt(networkId);
        console.log(`==networkChanged:${chainId}`);
        if (networkId && !SUPPORTED_CHAIN_ID_LIST.includes(chainId)) {
          this.visibleModal = true;
          this.resetApp();
        } else if (window.ethereum) {
          await this.resetApp();
          this.connect(window.ethereum, 'injected');
        }
      });*/
      provider.on('disconnect', async error => {
        if (this.numberConnet != numberConnet) return;
        if (error) {
          await this.web3Modal.clearCachedProvider();
          this.resetStore();
          throw error;
        }
      });
    },
    initWeb3(provider) {
      const web3 = new Web3(provider);
      web3.eth.extend({
        methods: [
          {
            name: 'chainId',
            call: 'eth_chainId',
            outputFormatter: web3.utils.hexToNumber,
          },
        ],
      });

      return web3;
    },
    handleErrorAddress(provider) {
      this.resetApp(provider);
    },
    async getAccounts(web3) {
      try {
        const accounts = await web3.eth.getAccounts();
        return Web3.utils.isAddress(accounts[0]) ? accounts[0] : null;
      } catch (error) {
        return null;
      }
    },
    async resetApp(provider) {
      try {
        // let provider = null;
        this.numberConnet = this.numberConnet + 1;
        if (!provider) {
          if (this.walletProvider && this.walletProvider.isMetaMask) {
            provider = window.ethereum;
          } else {
            if (!window.wallet) {
              this.resetStore();
              return;
            }
            provider = window.wallet.currentProvider;
          }
        }
        const web3 = this.initWeb3(provider);
        if (web3 && web3.currentProvider && web3.currentProvider.close) {
          await web3.currentProvider.close();
          if (window.wallet) {
            window.wallet.currentProvider.close();
          }
        }
        await this.web3Modal.clearCachedProvider();
      } catch (error) {
        console.log('resetApp--------->err: ', error);
      }
      this.resetStore();
    },
    hideMobileLink() {
      setTimeout(() => {
        try {
          let modalMobile = document.getElementById('walletconnect-wrapper');
          console.log(modalMobile, 'modalMobile');
          if (modalMobile) {
            let tab = modalMobile.querySelector(
              '.walletconnect-modal__header + div',
            );
            let tabQR = Array.from(tab.querySelectorAll('a')).find(
              el => el.textContent === 'QR Code',
            );
            console.log(tabQR, 'tabQR');
            if (tabQR) {
              tabQR.click();
            }
          }
        } catch (error) {
          console.log('hideMobileLink', error);
        }
      }, 100);
    },
    async personalSignWithNonce({ web3, nonce, address }) {
      const signMessage = `I am signing my one-time nonce: ${nonce}`;
      const signature = await web3.eth.personal.sign(
        signMessage,
        address,
        '', // MetaMask/WC will ignore the password argument here
      );
      return signature;
    },
    async handelChangeAccount(address) {
      if (!window.wallet) {
        this.resetStore();
        return;
      }
      let provider = window.wallet.currentProvider;
      if (this.walletProvider && this.walletProvider.isMetaMask) {
        provider = window.ethereum;
      }
      const web3 = this.initWeb3(provider);
      this._handelLogin(web3, { address });
    },
    _handelLogin(_, dataWallet) {
      try {
        const address = dataWallet.address.toLowerCase();
        this.updateWallet({
          provider: { ...dataWallet, address: address },
        });
        this.updateLoading(false);
      } catch (error) {
        console.log('====>error', error);
        this.resetApp();
      }
    },
  },
  mounted() {
    if (web3Modal.cachedProvider) {
      this.handleConnect(this.walletProvider.type);
    } else {
      this.resetApp();
    }
    // this.$root.$on('btn-wallet-disconnect', () => {
    //   this.resetApp();
    // });
    this.$root.$on('btn-wallet-connect', type => {
      this.handleConnect(type);
    });
    this.$root.$on('btn-change-connect', type => {
      this.resetApp();
      this.handleConnect(type);
    });
  },
  beforeDestroy() {
    this.$root.$off('btn-wallet-connect');
    // this.$root.$off('btn-wallet-disconnect');
    this.$root.$off('btn-change-connect');
  },
};
