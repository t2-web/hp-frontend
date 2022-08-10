<template>
  <div class="token-list-container">
    <div class="token-list-header">
      <div class="token-list-header-title">Select a Token</div>
    </div>
    <div class="token-list-content">
      <div class="token-list-search-wrapper">
        <a-input
          allowClear
          placeholder="Search name or paste address"
          @change="onTextChange"
        />
      </div>

      <a-menu
        v-if="data && data.length > 0"
        :selectable="false"
        class="token-list-menu"
      >
        <a-menu-item
          class="token-item-menu"
          v-for="(item, idx) in data"
          :key="`${idx}`"
          @click="onItemClick(item, idx)"
        >
          <div class="token-item-menu-row">
            <div>
              {{ item.name }}
              <span class="token-item-menu-sub">{{ item.symbol }}</span>
            </div>
            <div class="token-item-menu-value">
              {{ formatNumber(balanceData[item.address] || 0) || '--' }}
            </div>
          </div>
        </a-menu-item>
      </a-menu>
      <div class="no-data" v-else>
        No token
      </div>
    </div>
    <div class="token-list-footer">
      <a-button type="link" @click="$emit('onImportClick')">
        Manage Tokens
      </a-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { formatNumber } from '@/utils/common';

export default {
  props: {
    items: Array,
  },
  data() {
    return {
      keyword: '',
      data: this.items,
    };
  },
  computed: {
    ...mapState({
      balanceData(state) {
        return state.token?.balance || {};
      },
    }),
    itemsAndKeywordChanged() {
      return [this.items, this.keyword];
    },
  },
  watch: {
    itemsAndKeywordChanged(newValues) {
      const [newItems, newKeyword] = newValues;
      this.filterByKeyword(newItems, newKeyword);
    },
  },
  methods: {
    formatNumber(v) {
      return formatNumber(v);
    },
    async filterByKeyword(items, keyword) {
      if (!keyword) {
        this.data = [...items];
      } else {
        const s = keyword.toLowerCase();
        this.data = items.filter(item => {
          if (item.name.toLowerCase().indexOf(s) >= 0) {
            return true;
          }
          if (item.address.toLowerCase() === s) {
            return true;
          }
          return false;
        });
      }
    },
    onTextChange(e) {
      this.keyword = e.target.value;
    },
    onItemClick(item, idx) {
      this.$emit('onItemClick', item, idx);
    },
  },
};
</script>

<style scoped>
.token-list-container {
  border-radius: 8px;
  border: 1px solid #434343;
  background-color: #1f1f1f;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 3px 6px -4px rgb(0 0 0 /28%), 0 6px 16px 0 rgb(0 0 0 / 12%),
    0 9px 28px 8px rgb(0 0 0 / 5%);
}
.token-list-header {
  height: 44px;
  border-bottom: 1px solid #434343;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: flex-start;
}
.token-list-header-title {
  text-align: left;
  font-size: 16px;
  padding: 0px 10px;
}
.token-list-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.token-list-search-wrapper {
  padding: 10px 10px;
}
.token-list-footer {
  height: 44px;
  border-top: 1px solid #434343;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.token-list-menu {
  border-radius: 8px;
  border: 0px solid transparent;
  background-color: transparent;
}
.token-item-menu {
  height: 32px;
  line-height: 32px;
  margin: 4px 0px !important;
  padding: 0px 12px;
}
.token-item-menu-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.token-item-menu-title {
  font-size: 14px;
  font-weight: 500px;
}
.token-item-menu-sub {
  color: #888;
  font-size: 13px;
}
.token-item-menu-value {
  margin-left: auto;
  font-size: 14px;
}
.no-data {
  padding: 10px 20px;
  word-wrap: break-word;
  text-align: center;
  font-size:14px;
  color:#888;
}
</style>
