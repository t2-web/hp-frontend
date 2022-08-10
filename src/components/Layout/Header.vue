<template>
  <a-layout-header>
    <div class="header-row">
      <div class="header-left">
        <router-link to="/">
          <img src="@/assets/img/logo.png" />
        </router-link>
      </div>
      <div class="header-right">
        <router-link to="/createnft" custom v-slot="{ navigate, href }">
          <a class="header-link" :href="href" @click="navigate">Create NFT</a>
        </router-link>
        <router-link to="/sendtoken" custom v-slot="{ navigate, href }">
          <a class="header-link" :href="href" @click="navigate"
            >Send Token</a
          >
        </router-link>

        <a class="header-link last" :href="sendnftUrl">Send NFT</a>

        <div class="user-avatar-btn">
          <img class="user-avatar" src="@/assets/img/p_icon.png" />
        </div>
        <div class="connect-wallet">
          <div :class="`dot${isConnected ? ' connected' : ''}`" />
          {{ networkName }}
        </div>
        <a-button
          ghost
          type="primary"
          shape="round"
          class="btn-connect"
          v-if="!isConnected"
          @click="$emit('connect')"
        >
          Connect to a wallet
        </a-button>
        <div v-else class="user-address">
          {{ userAddress | truncate(10, 6, 4) }}
        </div>
      </div>
    </div>
  </a-layout-header>
</template>

<script>
import { env } from '@/constants';
export default {
  props: {
    isConnected: Boolean,
    networkName: String,
    userAddress: String,
    connect: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      sendnftUrl: env.app.sendnftUrl,
    };
  },
};
</script>

<style scoped>
.header-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 1440px;
  margin: 0px auto;
  padding: 0;
}
.header-left {
  flex-grow: 1;
  line-height: 1;
}
.header-right {
  padding-left: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.connect-wallet {
  line-height: 1;
  height: 36px;
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  margin-right: -17px;
  padding-right: 23px;
  background-color: rgb(42, 42, 45);
  border-top-left-radius: 18px;
  border-bottom-left-radius: 18px;
  font-size: 14px;
  font-weight: 400;
  color: rgb(255, 255, 255);
}
.header-link {
  text-align: center;
  margin: 0px 12px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
}
.header-link:hover {
  color: rgb(29, 163, 194);
}
.user-avatar-btn {
  margin-left: 10px;
  margin-right: 20px;
}
.user-avatar {
  width: 45px;
}
.dot {
  width: 8px;
  height: 8px;
  padding: 2px;
  border-radius: 50%;
  margin-left: 14px;
  margin-right: 6px;
  background: rgba(255, 255, 255, 0.3);
}
.dot::before {
  content: '';
  display: block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgb(255, 255, 255);
}
.connected {
  background: rgb(29, 163, 194);
}
.network-title {
  font-size: 14px;
  font-weight: 400;
}
.btn-connect {
  height: 36px !important;
  background: rgb(26, 26, 27) !important;
  padding: 0 16px;
  font-size: 16px;
}
.user-address {
  line-height: 1;
  height: 36px;
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  padding-right: 20px;
  background-color: rgb(42, 42, 45);
  border-top-right-radius: 18px;
  border-bottom-right-radius: 18px;
  font-size: 14px;
  font-weight: 400;
  color: rgb(255, 255, 255);
}
.last {
  margin-right: 24px;
}
@media only screen and (max-width: 680px) {
  .ant-layout-header {
    line-height: 1.2 !important;
  }
}
@media only screen and (max-width: 520px) {
  .user-avatar-btn {
    display: none;
  }
  .header-left {
    display: none;
  }
  .ant-layout-header {
    line-height: 1.2 !important;
  }
}
</style>
