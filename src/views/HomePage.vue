<template>
  <div>
    <div class="app-body">
      <div class="page-container">
        <div class="banner-container">
          <img
            class="banner-img"
            :src="require('@/assets/img/banner_bg.png')"
          />
          <div class="text-container">
            <div class="text-wrapper">
              <div class="title">Blockchain Tools</div>
              <div class="sub-title">- Use this for your own good -</div>
            </div>
          </div>
        </div>

        <a-row type="flex" :gutter="[24, 24]">
          <a-col :xs="24" :sm="12" :md="12" :lg="12">
            <router-link to="/createnft" custom v-slot="{ navigate, href }">
              <a :href="href" @click="navigate">
                <div class="button-container">
                  <img
                    class="button-img"
                    :src="require('@/assets/img/create_nft.png')"
                  />
                  <div class="button-text-container">
                    <div class="button-text-wrapper">
                      <div class="button-title">Create NFT</div>
                      <div class="button-sub-title">
                        NFT Mint Tool (ETH/Polygon/BSC/Aster)
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </router-link>
          </a-col>
          <a-col :xs="24" :sm="12" :md="12" :lg="12">
            <router-link to="/sendtoken" custom v-slot="{ navigate, href }">
              <a :href="href" @click="navigate">
                <div class="button-container">
                  <img
                    class="button-img"
                    :src="require('@/assets/img/send_token.png')"
                  />
                  <div class="button-text-container">
                    <div class="button-text-wrapper">
                      <div class="button-title">Send Token</div>
                      <div class="button-sub-title">
                        Multi Token Send Tool (ETH/Polygon/BSC/Aster)
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </router-link>
          </a-col>
          <a-col :xs="24" :sm="12" :md="12" :lg="12">
            <a :href="sendnftUrl">
              <div class="button-container">
                <img
                  class="button-img"
                  :src="require('@/assets/img/send_nft.png')"
                />
                <div class="button-text-container">
                  <div class="button-text-wrapper">
                    <div class="button-title">Send NFT</div>
                    <div class="button-sub-title">
                      Multi NFT Send Tool (ETH/Polygon/BSC/Aster)
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </a-col>
          <a-col :xs="24" :sm="12" :md="12" :lg="12">
            <div class="button-container">
              <img
                class="button-img"
                :src="require('@/assets/img/empty_rect.png')"
              />
              <div class="comingsoon-container">
                <div class="comingsoon-text">Coming soon</div>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>

    <div class="page-footer">
      <div class="page-footer-body">
        <div class="footer-text">
          ブロックチェーンのご相談など<br />
          お気軽にお問い合わせください。
        </div>
        <a href="https://t2web.co.jp/contact/">
          <a-button class="btn-footer" type="primary" ghost>
            お問い合わせ
          </a-button>
        </a>
      </div>
      <div class="page-footer-link page-footer-bottom">
        <div class="page-footer-link-content"></div>
        <div class="page-footer-link-content">
          <router-link to="/">
            <img class="footer-logo" src="@/assets/img/logo.png" />
          </router-link>
        </div>
        <div class="page-footer-link-content">
          <a href="https://github.com/t2-web">
            <img class="footer-git-logo" src="@/assets/img/github-icon.svg" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { env } from '@/constants';

export default {
  data() {
    return {
      sendnftUrl: env.app.sendnftUrl,
    };
  },
};
</script>

<style scoped>
.page-footer-link{
  display: flex;
  justify-content: flex-end;
}
.page-footer-link-content{
  margin: auto;
}
.page-container {
  max-width: 1124px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}
.banner-container {
  position: relative;
  margin-bottom: 24px;
  min-height: 212px;
}
.banner-img {
  width: 100%;
  min-height: 212px;
}
.title {
  font-style: normal;
  font-weight: 800;
  font-size: 40px;
  line-height: 1;
  color: #ffffff;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.45);
}
.sub-title {
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  padding-left: 16px;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.45);
}
.text-container {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
}
.text-wrapper {
  padding-left: 40px;
}
.button-container {
}
.button-img {
  width: 100%;
}

.button-title {
  font-style: normal;
  font-weight: 700;
  font-size: 40px;
  line-height: 1;
  color: #ffffff;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.45);
  margin-bottom: 6px;
}
.button-sub-title {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.45);
}
.button-text-container {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
}
.button-text-wrapper {
  padding-left: 40px;
}
.comingsoon-container {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}
.comingsoon-text {
  font-size: 22px;
  color: rgb(133, 133, 141);
}
.btn-footer {
  height: 50px;
  width: 300px;
  border-radius: 25px;
  line-height: 50px;
  font-size: 16px;
  font-weight: 600;
}
.btn-footer[disabled] {
  cursor: not-allowed;
  background: rgb(55, 55, 57);
  color: rgb(26, 26, 27);
  border-color: rgb(55, 55, 57);
}
.btn-footer[disabled]:hover {
  cursor: not-allowed;
  background: rgb(55, 55, 57);
  color: rgb(26, 26, 27);
  border-color: rgb(55, 55, 57);
}
.page-footer {
  /* width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center; */
}
.page-footer-body {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #151515;
  padding: 70px 0px;
}
.footer-text {
  text-align: center;
  margin-bottom: 30px;
}
.page-footer-bottom {
  padding: 15px 0px;
}
.footer-logo {
  height: 20px;
}
.footer-git-logo svg{
  height: 20px;
}

@media only screen and (max-width: 770px) {
  .title {
    font-size: 30px;
  }
  .sub-title {
    font-size: 18px;
    padding-left: 0px;
  }
  .text-wrapper {
    padding-left: 20px;
  }
  .button-title {
    font-size: 28px;
    margin-bottom: 4px;
  }
  .button-sub-title {
    font-size: 16px;
  }
  .button-text-wrapper {
    padding-left: 30px;
  }
  .comingsoon-text {
    font-size: 18px;
  }
}

@media only screen and (max-width: 480px) {
  .title {
    font-size: 22px;
  }
  .sub-title {
    font-size: 16px;
    padding-left: 0px;
  }
  .text-wrapper {
    padding-left: 20px;
  }
  .button-title {
    font-size: 22px;
    margin-bottom: 4px;
  }
  .button-sub-title {
    font-size: 14px;
  }
  .button-text-wrapper {
    padding-left: 30px;
  }
  .comingsoon-text {
    font-size: 18px;
  }
  .banner-container {
    margin-bottom: 16px;
  }
}
</style>
