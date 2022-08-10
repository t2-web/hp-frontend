<template>
  <div>
    <a-row type="flex" :gutter="[16, 16]">
      <a-col
        v-for="(item, idx) in data"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        :key="`${item.tokenId}-${item.tokenURI}-${idx}`"
      >
        <NFTCard
          :item="item"
          @send="handleItemSend(item, idx)"
          @burn="handleItemBurn(item, idx)"
          @imageClick="handleImageClick"
        />
      </a-col>
    </a-row>
    <div class="no-data" v-if="!data || data.length < 1">
      <p class="no-data-title">{{`There is no ERC-${mode} NFT in your wallet`}}</p>
    </div>
    <div class="pagination">
      <a-pagination
        hideOnSinglePage
        show-less-items
        v-model="page"
        :pageSize="pageSize"
        :total="total"
      />
    </div>
    <ImageModal
      :visible="imageModalVisible"
      :imgUrl="imageUrl"
      @cancel="hideImageModal"
    />
  </div>
</template>

<script>
import _ from 'lodash';
import NFTCard from './NFTCard';
import ImageModal from './ImageModal';

export default {
  props: {
    items: Array,
    mode: String,
  },
  components: {
    NFTCard,
    ImageModal,
  },
  data() {
    return {
      pageSize: 8,
      page: 1,
      imageModalVisible: false,
      imageUrl: null,
    };
  },
  computed: {
    total() {
      return this.items ? this.items.length : 0;
    },
    data() {
      const pageSize = this.pageSize;
      const total = this.items.length;
      const start = (this.page - 1) * pageSize;
      return _.slice(this.items, start, Math.min(start + pageSize, total));
    },
  },
  methods: {
    handleItemSend(item, idx) {
      this.$emit('onItemSend', item, idx);
    },
    handleItemBurn(item, idx) {
      this.$emit('onItemBurn', item, idx);
    },
    handleImageClick(imgUrl) {
      this.imageModalVisible = true;
      this.imageUrl = imgUrl;
    },
    hideImageModal() {
      this.imageModalVisible = false;
      this.imageUrl = null;
    },
  },
};
</script>

<style scoped>
.pagination {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.no-data-title {
  font-size: 16px;
}
</style>
