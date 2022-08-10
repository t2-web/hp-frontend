<template>
  <a-layout id="app" :class="{ 'light-mode': isDarkMode === false }">
    <Header
      :isConnected="isConnected"
      :userAddress="userAddress"
      :networkName="networkName"
      @connect="handleConnectClick"
    />
    <a-layout-content>
      <div id="app-contents">
        <router-view :key="$route.fullPath"></router-view>
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script>
import Header from '@/components/Layout/Header';
import MixinMetamaskConnect from '@/mixins/metamask-connect.mixin';

export default {
  mixins: [MixinMetamaskConnect],
  components: {
    Header,
  },
  data() {
    return {
      startApp: false,
      isDarkMode: true,
    };
  },
  created() {},
  mounted() {},
  methods: {
    handleConnectClick() {
      this.$root.$emit('btn-wallet-connect');
    },
  },
};
</script>
