<template>
  <div class="app-body">
    <h1 class="header">Create an NFT</h1>

    <div class="card">
      <div class="card-title">Select the NFT Type:</div>
      <div class="card-body">
        <div class="col-left">
          <div class="btn-wrapper">
            <Button
              title="Single"
              subTitle="Create an Unique NFT (ERC-721)"
              :iconUrl="require('@/assets/img/single.png')"
              :selected="currentMode == '721'"
              :disabled="minting || !isConnected"
              @click="() => handleChangeMode('721')"
            />
          </div>
        </div>
        <div class="col-right">
          <div class="btn-wrapper">
            <Button
              title="Multiple"
              subTitle="Create Multiple NFTs (ERC-1155)"
              :iconUrl="require('@/assets/img/multiple.png')"
              :selected="currentMode == '1155'"
              :disabled="minting || !isConnected"
              @click="() => handleChangeMode('1155')"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <ValidationObserver ref="validator" v-slot="{ invalid }">
        <a-form name="nft">
          <div class="card-title">Populate the Fields:</div>
          <div class="card-body">
            <div class="col-left">
              <div class="form-label">1. Select Your Files</div>

              <div class="dd-upload-container">
                <div class="dd-upload-wrapper">
                  <a-upload
                    name="file"
                    accept=".jpg,.jpeg,.png,.tif,.tiff,.gif"
                    class="photo-uploader"
                    list-type="picture-card"
                    :multiple="false"
                    :disabled="minting || !isConnected"
                    :show-upload-list="false"
                    :before-upload="beforeUpload"
                  >
                    <img
                      v-if="!hasFile"
                      class="icon-no-image"
                      :src="require('@/assets/img/no-image.png')"
                    />
                    <img
                      v-else-if="!formState.isTIFF"
                      class="image-thumb"
                      :src="photoThumbUrl"
                    />
                    <div v-else class="ant-upload-desc">
                      <a-icon type="paper-clip" /> {{ formState.file.name }}
                    </div>

                    <div v-if="!hasFile">
                      <div class="ant-upload-desc">
                        Supports JPG, PNG, TIF, GIF (Maximum 40MB)
                      </div>
                      <div class="ant-upload-row">
                        <div class="ant-upload-text">
                          {{ uploadButtonLabel }}
                        </div>
                      </div>
                    </div>

                    <div class="btn-remove-wrapper" v-if="hasFile">
                      <a-button
                        type="primary"
                        shape="circle"
                        @click="handleRemoveFile"
                      >
                        X
                      </a-button>
                    </div>
                  </a-upload>
                </div>
              </div>
            </div>
            <div class="col-right">
              <div class="form-label">2. NFT Name</div>
              <ValidationProvider
                name="name"
                rules="required|max:60"
                v-slot="{ errors }"
              >
                <div class="dd-input-wrapper">
                  <a-input
                    class="dd-input"
                    placeholder="Please enter a name"
                    :maxLength="60"
                    :disabled="minting || !isConnected"
                    v-model="formState.name"
                  />
                </div>
                <div v-if="errors[0]" class="error-mess">
                  {{ errors[0] }}
                </div>
              </ValidationProvider>
              <div class="form-label gutter-top">3. Vault Name</div>
              <div class="dd-input-wrapper">
                <a-input
                  class="dd-input"
                  placeholder="Please enter a vault name"
                  v-model="formState.vaultName"
                  :disabled="true"
                />
              </div>

              <div class="fade-in" v-if="currentMode === '1155'">
                <div class="form-label gutter-top">
                  4. Quantity (Optional)
                </div>
                <ValidationProvider
                  name="quantity"
                  :rules="quantityRule"
                  v-slot="{ errors }"
                >
                  <div class="dd-input-wrapper">
                    <a-input
                      class="dd-input"
                      :maxLength="60"
                      placeholder="Please enter a quantity"
                      :disabled="minting || !isConnected"
                      v-model="formState.quantity"
                    />
                  </div>
                  <div v-if="errors[0]" class="error-mess">
                    {{ errors[0] }}
                  </div>
                </ValidationProvider>
              </div>

              <div>
                <div class="form-label gutter-top">
                  {{ `${currentMode === '721' ? '4' : '5'}. Attributes` }}
                </div>
                <Attributes
                  :attributes="formState.attributes"
                  @onRemoveAttr="handleRemoveAttr"
                  @onAddMore="handleAddAttr"
                  @onChangeType="handleChangeAttrType"
                  @onChangeName="handleChangeAttrName"
                />
              </div>
            </div>
          </div>

          <div class="card-footer">
            <a-button
              :disabled="!hasFile || !isValid || invalid || !isConnected"
              :loading="minting"
              id="btn-confirm"
              class="btn-confirm"
              type="primary"
              @click="handleSubmit"
            >
              Confirm the Creation
            </a-button>
          </div>
        </a-form>
      </ValidationObserver>
    </div>

    <div v-if="isConnected">
      <h1 class="header">
        {{ currentMode === '721' ? 'My ERC-721 NFTs' : 'My ERC-1155 NFTs' }}
      </h1>
      <NFTList
        :key="dataKey"
        :items="items"
        :mode="currentMode"
        @onItemSend="handleSendItem"
        @onItemBurn="handleBurnItem"
      />
    </div>

    <SendModal
      :loading="sendingNFT"
      :visible="sendModalVisibled"
      :item="sendItem"
      :type="currentMode"
      :myAddress="myAddress"
      @onSubmit="handleSubmitSend"
      @onCancel="handleCancelSend"
    />
    <BurnModal
      :loading="burningNFT"
      :visible="burnModalVisibled"
      :item="burnItem"
      :type="currentMode"
      @onSubmit="handleSubmitBurn"
      @onCancel="handleCancelBurn"
    />
  </div>
</template>

<script>
import _ from 'lodash';

import { notification, message } from 'ant-design-vue';
import MixinMetamaskConnect from '@/mixins/metamask-connect.mixin';
import MixinNFT from '@/mixins/nft.mixin';
import Button from '@/components/Button';
import NFTList from '@/components/NFTList';
import SendModal from '@/components/SendModal';
import BurnModal from '@/components/BurnModal';
import Attributes from '@/components/Attributes';
import { sleep } from '@/utils/common';

const defaultFormState = {
  name: '',
  vaultName: 'T2WEB NFT',
  quantity: undefined,
  file: null,
  isTIFF: false,
  attributes: [{ type: '', name: '' }],
};

export default {
  mixins: [MixinMetamaskConnect, MixinNFT],
  components: {
    Button,
    NFTList,
    SendModal,
    BurnModal,
    Attributes,
  },
  data() {
    return {
      formState: {
        ...defaultFormState,
      },
      sendModalVisibled: false,
      burnModalVisibled: false,
      sendItem: null,
      burnItem: null,
      sendingNFT: false,
      burningNFT: false,
    };
  },
  computed: {
    quantityRule() {
      return {
        required: false,
        min_value: 1,
        integer: true,
      };
    },
    hasFile() {
      return !!this.formState.file;
    },
    isValid() {
      if (_.isEmpty(this.formState.name)) return false;
      return true;
    },
    photoThumbUrl() {
      if (!this.formState.file) return '';
      return URL.createObjectURL(this.formState.file);
    },
    uploadButtonLabel() {
      return !this.formState.file ? 'Select Your Files' : 'Change Your Files';
    },
  },
  mounted() {
    this.updateLoading(false);
    this.updateMinting(false);
    setTimeout(this.reloadData, 500);
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
    handleChangeMode(mode) {
      if (mode === '721') {
        this.formState.quantity = undefined;
      }
      this.changeMode(mode);
    },
    beforeUpload(file) {
      // 40MB
      if (file && file.size > 41943040) {
        this.formState.isTIFF = false;
        this.formState.file = null;
        message.error('Image must be smaller than 40MB bytes');
        return false;
      }

      let ext = '';
      if (file) {
        ext = _.last(file.name.split('.')).toLowerCase();
      }
      this.formState.isTIFF = ext === 'tif' || ext === 'tiff';
      this.formState.file = file;

      return false;
    },
    handleRemoveFile(e) {
      e.preventDefault();
      e.stopPropagation();
      this.formState.file = null;
    },
    resetData() {
      this.formState = {
        ...defaultFormState,
      };
      try {
        this.$refs.validator.reset();
      } catch (ex) {
        console.error(ex);
      }
    },
    async handleSubmit() {
      try {
        const attrs = this.formState.attributes.filter(
          item => !_.isEmpty(item.type) && !_.isEmpty(item.name),
        );
        await this.mintNFT(
          this.formState.name,
          this.formState.vaultName,
          this.formState.file,
          this.formState.quantity || 1,
          attrs,
        );
        await sleep(1000);
        this.showSuccessMessage('NFT created successfully');
        this.resetData();
        setTimeout(this.reloadData, 1000);
      } catch (ex) {
        console.log(ex);
        this.showErrorMessage(
          ex.message || 'An error has occurred please try again later',
        );
      } finally {
        this.updateMinting(false);
      }
    },
    handleSendItem(item) {
      this.sendItem = item;
      this.sendModalVisibled = true;
    },
    handleBurnItem(item) {
      this.burnItem = item;
      this.burnModalVisibled = true;
    },
    handleCancelSend() {
      this.sendModalVisibled = false;
    },
    handleCancelBurn() {
      this.burnModalVisibled = false;
    },
    async handleSubmitSend({ item, address, amount }) {
      try {
        this.sendingNFT = true;

        const rs = await this.sendNFT(address, item.tokenId, amount);
        console.log('send:', rs);

        await sleep(1200);
        this.handleCancelSend();
        setTimeout(this.reloadData, 1000);

        this.showSuccessMessage('NFT transferred successfully');
      } catch (ex) {
        console.error(ex);

        this.showErrorMessage(
          ex.message || 'An error has occurred please try again later',
        );
      } finally {
        this.sendingNFT = false;
      }
    },
    async handleSubmitBurn({ item, amount }) {
      try {
        this.burningNFT = true;

        const rs = await this.burnNFT(item.tokenId, amount);
        console.log('burn:', rs);

        await sleep(1200);
        this.handleCancelBurn();
        setTimeout(this.reloadData, 1000);

        this.showSuccessMessage('NFT burned successfully');
      } catch (ex) {
        console.error(ex);

        this.showErrorMessage(
          ex.message || 'An error has occurred please try again later',
        );
      } finally {
        this.burningNFT = false;
      }
    },
    handleRemoveAttr(idx) {
      this.formState.attributes = this.formState.attributes.filter(
        (_, i) => i != idx,
      );
    },
    handleAddAttr() {
      this.formState.attributes = [
        ...this.formState.attributes,
        { type: '', name: '' },
      ];
    },
    handleChangeAttrType(e, idx) {
      this.formState.attributes = this.formState.attributes.map((item, i) => {
        if (i === idx) {
          return {
            ...item,
            type: e.target.value,
          };
        }
        return {
          ...item,
        };
      });
    },
    handleChangeAttrName(e, idx) {
      this.formState.attributes = this.formState.attributes.map((item, i) => {
        if (i === idx) {
          return {
            ...item,
            name: e.target.value,
          };
        }
        return {
          ...item,
        };
      });
    },
  },
};
</script>

<style scoped lang="less">
.col-left {
  width: 340px;
  margin-right: 20px;
}
.col-right {
  flex-grow: 1;
}
.btn-wrapper {
  width: 340px;
}
.form-label {
  color: rgb(133, 133, 141);
  margin: 0px 0px 8px;
  font-size: 12px;
}
.gutter-top {
  margin-top: 20px !important;
}
.icon-no-image {
  width: 50px;
  height: 50px;
  margin-bottom: 20px;
}
.image-thumb {
  width: 100%;
  height: 340px;
  object-fit: cover;
}
.dd-upload-wrapper {
  color: #fff;
  position: relative;
  display: flex;
  width: 340px;
  height: 340px;
}
.ant-upload-row {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}
.ant-upload-desc {
  font-size: 12px;
  color: #fff;
}
.ant-upload-text {
  color: #fff;
  border-radius: 8px;
  background-color: rgb(55, 55, 57);
  font-weight: 500;
  width: 166px;
  height: 36px;
  line-height: 36px;
}
.btn-remove-wrapper {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0px;
  right: 0px;
  width: 60px;
  height: 60px;
}

// md
@media only screen and (max-width: 740px) {
  .col-left {
    margin-right: 0px;
    margin-bottom: 12px;
    flex: 1;
    width: 100%;
  }
  .col-right {
    flex: 1;
  }
  .btn-wrapper {
    width: 100%;
  }
  .dd-upload-container {
    align-items: center;
    display: flex;
    flex-direction: column;
  }
}
</style>
