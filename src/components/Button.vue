<template>
  <div
    :class="selected ? 'container selected' : 'container'"
    @click="$emit('click')"
  >
    <div class="left"><img :src="iconUrl" /></div>
    <div class="right">
      <div class="title">{{ title }}</div>
      <div>{{ subTitle }}</div>
    </div>

    <div class="stick-overlay" v-if="selected">
      <svg height="10" width="12" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M1 4.369l3.536 3.535 6.363-6.364"
          fill="none"
          stroke="#1a1a1b"
          stroke-width="2.5"
        ></path>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    subTitle: String,
    iconUrl: String,
    selected: Boolean,
    click: {
      type: Function,
      default: () => {},
    },
  },
};
</script>

<style scoped>
.container {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 25px 20px;
  margin: 0;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  color: rgb(133, 133, 141);
  background-color: rgb(42, 42, 45);
  border: 1px solid rgb(55, 55, 57);
}
.left {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}
.right {
  display: flex;
  flex-direction: column;
}
.title {
  color: #fff;
  font-size: 16px;
  font-weight: 700;
}
.stick-overlay {
  position: absolute;
  top: -1.5px;
  right: -1.5px;
  width: 32px;
  height: 32px;
  overflow: hidden;
  background-color: rgb(29, 163, 194);
  clip-path: polygon(0% 0%, 100% 100%, 100% 0%);
  -webkit-clip-path: polygon(0% 0%, 100% 100%, 100% 0%);
}
.stick-overlay svg {
  margin-left: auto;
  margin-right: 5px;
  margin-top: 5px;
  z-index: 1;
  display: block;
}
.selected {
  border: 1px solid rgb(29, 163, 194);
}
</style>
