<template>
  <a-card
    :bordered="false"
    class="nft-item-card"
    :bodyStyle="{ padding: '12px 12px' }"
  >
    <template #cover>
      <div class="nft-image-wrapper">
        <NFTImage
          :imgUrl="metadata ? getAssetsUrl(metadata.image) : null"
          @click="(url, data) => $emit('imageClick', url, data)"
        />
      </div>
    </template>

    <template class="ant-card-actions" #actions>
      <span @click="$emit('send')"><a-icon type="gift" /> Send</span>
      <span @click="$emit('burn')"><a-icon type="fire" /> Burn</span>
    </template>

    <a-skeleton
      active
      :loading="loading"
      :title="{ width: '40%' }"
      :paragraph="{ rows: 2, width: '100%' }"
    >
      <div class="meta-desc-row">
        <div class="card-token-id">
          <a target="_blank" :href="item ? item.explorerUrl : '#'">{{
            item ? `#${item.tokenId}` : '--'
          }}</a>
        </div>
        <div v-if="item && item.amount" class="meta-desc-right">
          {{ item.amount }}
        </div>
      </div>
      <a-card-meta :title="metadata ? metadata.name : '--'">
        <template #description>
          {{ metadata ? metadata.vaultName : '--' }}
        </template>
      </a-card-meta>
    </a-skeleton>
  </a-card>
</template>

<script>
import { env } from '@/constants';
import backend from '@/utils/backend/index';
import { sleep } from '@/utils/common';
import { mapState, mapMutations } from 'vuex';
import NFTImage from './NFTImage';

export default {
  components: {
    NFTImage,
  },
  props: {
    item: Object,
    send: {
      type: Function,
      default: () => {},
    },
    burn: {
      type: Function,
      default: () => {},
    },
    imageClick: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    ...mapState({
      metadata(state) {
        if (!this.item) return null;
        return state.nft?.metadata[this.item.tokenURI] || null;
      },
    }),
  },
  data() {
    return {
      loading: false,
    };
  },
  mounted() {
    if (!this.metadata) {
      this.loadData();
    }
  },
  methods: {
    ...mapMutations({
      updateMetadata: 'nft/UPDATE_NFT_METADATA',
    }),
    getAssetsUrl(uri) {
      if (uri.startsWith('ipfs://'))
        return uri.replace('ipfs://', env.app.ipfsGateway);
      return uri;
    },
    async loadData() {
      try {
        this.loading = true;
        const res = await backend.metadata.loadMetadata(
          this.getAssetsUrl(this.item.tokenURI),
        );
        const payload = {
          tokenURI: this.item.tokenURI,
          data: {
            name: res.name,
            vaultName: res.vaultName,
            image: res.image,
            attributes: res.attributes,
          },
        };
        this.updateMetadata(payload);
      } catch (ex) {
        console.log(ex);
      } finally {
        await sleep(1000);
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="less">
@card-primary-color: rgba(255, 255, 255, 0.95);
@card-text-color: rgb(133, 133, 141);
@card-bg-color: rgb(42, 42, 45);
@card-border-color: rgb(55, 55, 57);

.nft-item-card {
  border-radius: 10px;
  overflow: hidden;
  color: @card-text-color;
  background-color: @card-bg-color;
  border: 1px solid @card-bg-color;
}

.nft-item-card:hover {
  transform: translateY(-5px);
}

.card-token-id {
  max-width: 50px;
  color: @card-primary-color;
  font-size: 12px;
  font-weight: 400;
  padding: 0px;
  display: flex;
  margin-bottom: 8px;
  flex: 1;
}
.ant-card-meta-title {
  color: @card-primary-color;
  font-weight: 500;
  font-size: 15px;
  margin-bottom: 0px !important;
}
.ant-card-meta-description {
  color: @card-text-color;
  font-size: 12px;
  font-weight: 400;
}
.meta-desc-row {
  display: flex;
  flex-direction: row;
}
.meta-desc-left {
  color: @card-text-color;
  font-size: 12px;
  font-weight: 400;
  flex: 1;
}
.meta-desc-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex: 1;
  color: @card-text-color;
  font-size: 12px;
  font-weight: 400;
}
.ant-card-actions {
  color: @card-primary-color;
  background-color: @card-bg-color;
  border-top: 1px solid @card-border-color;
}
.ant-card-actions > li {
  color: @card-primary-color;
}
.ant-card-actions > li:not(:last-child) {
  border-right: 1px solid @card-border-color;
}
.ant-skeleton-title {
  margin: 0px 0px 7px 0px !important;
}
.ant-skeleton-paragraph {
  margin: 0px 0px 0px 0px !important;
}
.ant-skeleton-content .ant-skeleton-paragraph > li + li {
  margin: 3.5px 0px 0px 0px !important;
}
.nft-image-wrapper {
  width: 100%;
  height: 260px;
  overflow: hidden;
  background-color: @card-bg-color;
  border-bottom: 1px solid @card-border-color;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
