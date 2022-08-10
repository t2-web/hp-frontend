<template>
  <a-modal
    id="nft-image-modal"
    centered
    maskClosable
    class="image-modal-container"
    wrapClassName="image-wrapper"
    dialogClass="image-dialog"
    :bodyStyle="{ padding: 0 }"
    :closable="false"
    :visible="visible"
    :footer="null"
    :width="'100%'"
    :maskStyle="{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }"
    @cancel="$emit('cancel')"
  >
    <div class="modal-container" @click="$emit('cancel')">
      <div v-if="visible && imgUrl" class="container">
        <img
          v-if="imgUrl && !isError && !isTIF"
          key="modal-nft-image"
          class="modal-nft-image"
          alt="NFT name"
          :src="imgUrl"
          @error="onError"
        />
        <canvas v-else-if="isTIF && !isError" ref="canvas" />
        <img
          v-else
          key="no-image"
          class="modal-nft-no-image"
          alt="NFT no image"
          :src="require('@/assets/img/no-image.png')"
        />
      </div>
    </div>
  </a-modal>
</template>

<script>
import UTIF from 'utif';

export default {
  props: {
    visible: Boolean,
    imgUrl: String,
  },
  data() {
    return {
      isError: false,
      isTIF: false,
    };
  },
  watch: {
    visible(newValue, oldValue) {
      if (!newValue && oldValue) {
        this.resetData();
      }
    },
  },
  methods: {
    onError() {
      if (!this.isTIF) {
        this.loadTIFIfNeeded();
      }
    },
    resetData() {
      this.isError = false;
      this.isTIF = false;
    },
    loadTIFIfNeeded() {
      this.isTIF = true;
      console.log('Load tiff');

      var xhr = new XMLHttpRequest();
      xhr.open('GET', this.imgUrl);
      xhr.responseType = 'arraybuffer';
      xhr.onload = e => {
        try {
          const canvas = this.$refs.canvas;
          if (canvas) {
            var ifds = UTIF.decode(e.target.response);
            UTIF.decodeImage(e.target.response, ifds[0]);
            var rgba = UTIF.toRGBA8(ifds[0]);

            const w = ifds[0].width;
            const h = ifds[0].height;
            canvas.width = Math.min(document.body.clientWidth - 48, w);
            canvas.height = Math.min(document.body.clientHeight - 24, h);

            const imageData = new ImageData(new Uint8ClampedArray(rgba), w, h);
            if (imageData) {
              const ctx = canvas.getContext('2d');
              ctx.putImageData(imageData, 0, 0);
            } else {
              throw new Error('Invalid image');
            }
          }
        } catch (ex) {
          this.isError = true;
          console.log('img err:', this.imgUrl);
        }
      };
      xhr.onerror = () => {
        this.isError = true;
      };
      xhr.send();
    },
  },
};
</script>

<style>
#nft-image-modal
  > div.ant-modal-wrap.ant-modal-centered.image-wrapper
  > div
  > div.ant-modal-content {
  background-color: transparent !important;
  box-shadow: none;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.modal-container {
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  padding: 0px !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.container {
  width: calc(100% - 48px);
  height: calc(100% - 24px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
}
.modal-nft-image {
  object-fit: contain;
  max-width: 100%;
  max-height: 100%;
}
.modal-nft-no-image {
  opacity: 0.8;
  width: 70px;
  height: 70px;
  object-fit: cover;
}

@media only screen and (max-width: 600px) {
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
  }
}
</style>
