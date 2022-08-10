<template>
  <div class="container">
    <img
      v-if="imgUrl && !isError && !isTIF"
      key="nft-image"
      class="nft-image"
      alt="NFT name"
      :src="imgUrl"
      @error="onError"
      @click="$emit('click', imgUrl, imageData)"
    />
    <canvas
      v-else-if="isTIF && !isError"
      ref="canvas"
      id="canvas"
      class="nft-canvas"
      @click="$emit('click', imgUrl, imageData)"
    />
    <img
      v-else
      key="no-image"
      class="nft-no-image"
      alt="NFT no image"
      :src="require('@/assets/img/no-image.png')"
    />
  </div>
</template>

<script>
import UTIF from 'utif';

export default {
  props: {
    imgUrl: String,
    click: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      isError: false,
      isTIF: false,
      imageData: null,
    };
  },
  methods: {
    onError() {
      if (!this.isTIF) {
        this.loadTIFIfNeeded();
      }
    },
    loadTIFIfNeeded() {
      this.isTIF = true;
      console.log('Load tiff');

      var xhr = new XMLHttpRequest();
      xhr.open('GET', this.imgUrl);
      xhr.responseType = 'arraybuffer';
      xhr.onload = e => {
        try {
          var ifds = UTIF.decode(e.target.response);
          UTIF.decodeImage(e.target.response, ifds[0]);
          var rgba = UTIF.toRGBA8(ifds[0]);

          const w = ifds[0].width;
          const h = ifds[0].height;
          const imageData = new ImageData(new Uint8ClampedArray(rgba), w, h);
          if (imageData) {
            this.imageData = imageData;
            if (this.$refs.canvas) {
              const ctx = this.$refs.canvas.getContext('2d');
              ctx.putImageData(imageData, 0, 0);
            }
          } else {
            throw new Error('Invalid image');
          }
        } catch (ex) {
          this.imageData = null;
          this.isError = true;
          console.log('img err:', this.imgUrl);
        }
      };
      xhr.onerror = () => {
        this.imageData = null;
        this.isError = true;
      };
      xhr.send();
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nft-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}
.nft-canvas {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}
.nft-no-image {
  opacity: 0.8;
  width: 70px;
  height: 70px;
  object-fit: cover;
}
</style>
