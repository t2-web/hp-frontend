import _ from 'lodash';
import { mapState, mapMutations } from 'vuex';
import backend from '@/utils/backend/index';
import nftUtil from '@/utils/contracts/nft';

export default {
  computed: {
    ...mapState({
      provider: state => {
        return state.wallet?.provider || null;
      },
      myAddress: state => {
        return state.wallet?.provider?.address || null;
      },
      minting: state => {
        return state.nft?.minting;
      },
      loading: state => {
        return state.nft?.loading;
      },
      nftData: state => {
        return state.nft;
      },
      currentMode: state => {
        return state.nft?.mode;
      },
      // wallet-chainId-mode
      dataKey: state => {
        if (state.wallet?.provider) {
          const wallet = state.wallet?.provider?.address;
          const chainId = state.wallet?.provider?.chainId;
          const mode = state.nft?.mode;
          return `${wallet}-${chainId}-${mode}`;
        }
        return null;
      },
      items(state) {
        if (!this.dataKey) return [];
        return state.nft?.data[this.dataKey] || [];
      },
    }),
  },
  watch: {
    dataKey(newValue) {
      if (this.provider && this.myAddress) {
        this.loadNFTs(
          this.myAddress,
          this.provider.chainId,
          this.currentMode,
          newValue,
        );
      }
    },
  },
  methods: {
    ...mapMutations({
      updateMinting: 'nft/UPDATE_MINTING',
      updateLoading: 'nft/UPDATE_LOADING',
      changeMode: 'nft/CHANGE_MODE',
      resetData: 'nft/RESET_STATE',
      updateNFTsData: 'nft/UPDATE_NFT_DATA',
    }),

    reloadData() {
      if (this.myAddress && this.provider && this.provider.chainId) {
        this.loadNFTs(
          this.myAddress,
          this.provider.chainId,
          this.currentMode,
          this.dataKey,
        );
      }
    },

    async loadNFTs(owner, chainId, mode, path) {
      if (!chainId || !path) return;

      console.log(`========loadNFTs: ${path}`);

      this.updateLoading(true);
      let items = [];
      try {
        items = await backend.nft.loadData(owner, chainId, mode);
      } catch (ex) {
        console.log(ex);
      } finally {
        this.updateLoading(false);
        this.updateNFTsData({ key: path, items });
      }
    },

    async sendNFT(toAddress, tokenId, quantity = 1) {
      let rs = null;
      if (this.currentMode === '1155') {
        rs = await nftUtil.transferERC1155(
          this.provider,
          this.myAddress,
          toAddress,
          tokenId,
          quantity,
        );
      } else {
        rs = await nftUtil.transferERC721(
          this.provider,
          this.myAddress,
          toAddress,
          tokenId,
        );
      }

      return rs;
    },

    async burnNFT(tokenId, quantity = 1) {
      let rs = null;
      if (this.currentMode === '1155') {
        rs = await nftUtil.burnERC1155(
          this.provider,
          this.myAddress,
          tokenId,
          quantity,
        );
      } else {
        rs = await nftUtil.burnERC721(this.provider, this.myAddress, tokenId);
      }

      return rs;
    },

    async mintNFT(name, vaultName, file, quantity, attributes = []) {
      this.updateMinting(true);

      try {
        const mode = this.currentMode;
        const data = new FormData();
        data.append('name', name);
        data.append('vaultName', vaultName);
        data.append(
          'attributes',
          JSON.stringify(
            (attributes || []).map(item => {
              return {
                type: item.type,
                name: item.name,
              };
            }),
          ),
        );
        data.append('file', file);

        const res = await backend.metadata.createMetadata(data);
        if (!res || _.isEmpty(res.ipfs_hash)) {
          throw Error('Cannot create assets');
        }

        let rs = null;
        if (mode === '1155') {
          rs = await nftUtil.mintERC1155(
            this.provider,
            this.myAddress,
            res.ipfs_hash,
            quantity || 1,
          );
        } else {
          rs = await nftUtil.mintERC721(
            this.provider,
            this.myAddress,
            res.ipfs_hash,
          );
        }

        console.log('NFT:', rs);
      } finally {
        this.updateMinting(false);
      }
    },
  },
};
