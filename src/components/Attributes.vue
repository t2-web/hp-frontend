<template>
  <div class="container">
    <div class="attr-item" v-for="(item, idx) in attributes" :key="`${idx}`">
      <div
        class="attr-item-action-button"
        @click="onRemoveAttr(idx)"
        v-if="attributes.length > 0 && idx < attributes.length - 1"
      >
        X
      </div>
      <div class="attr-item-action" v-else />

      <div class="attr-item-content">
        <div class="item-input-wrapper-left">
          <a-input
            class="item-input"
            placeholder="Type"
            :maxLength="60"
            :value="item.type"
            :disabled="idx < attributes.length - 1"
            @change="e => $emit('onChangeType', e, idx)"
          />
        </div>
        <div class="space" />
        <div class="item-input-wrapper-right">
          <a-input
            class="item-input"
            placeholder="Name"
            :maxLength="60"
            :value="item.name"
            :disabled="idx < attributes.length - 1"
            @change="e => $emit('onChangeName', e, idx)"
          />
        </div>
      </div>
    </div>
    <div class="footer">
      <a-button type="primary" :disabled="!isValid" @click="onAddMore"
        >Add more</a-button
      >
    </div>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  props: {
    attributes: Array,
  },
  computed: {
    isValid() {
      const last = _.last(this.attributes);
      if (
        last &&
        !_.isEmpty(_.trim(last.type)) &&
        !_.isEmpty(_.trim(last.name))
      )
        return true;
      return false;
    },
  },
  methods: {
    onRemoveAttr(idx) {
      this.$emit('onRemoveAttr', idx);
    },
    onAddMore() {
      this.$emit('onAddMore');
    },
  },
};
</script>

<style scoped lang="less">
@item-border-color: rgb(67, 67, 67);
@bg-color: rgb(42, 42, 45);

.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.attr-item {
  display: flex;
  flex-direction: row;
  height: 48px;
  margin: 2px 0px;
}
.attr-item-label {
  display: flex;
  flex-direction: row;
  padding: 8px 0px;
}
.attr-item-action-label {
  width: 48px;
}
.item-input-wrapper-left-label {
  flex: 1;
  padding: 0 16px;
  margin-top: 12px;
  color: rgb(133, 133, 141);
  font-size: 12px;
  font-weight: 700;
}
.item-input-wrapper-right-label {
  flex: 1;
  padding: 0 16px;
  margin-top: 12px;
  color: rgb(133, 133, 141);
  font-size: 12px;
  font-weight: 700;
}

.attr-item-content {
  display: flex;
  flex-direction: row;
  flex: 1;
}
.attr-item-action {
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  background-color: @bg-color;

  border-left-width: 1px;
  border-left-style: solid;
  border-left-color: @item-border-color;

  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: @item-border-color;

  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: @item-border-color;
}
.attr-item-action-button {
  cursor: pointer;
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  background-color: @bg-color;

  border-left-width: 1px;
  border-left-style: solid;
  border-left-color: @item-border-color;

  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: @item-border-color;

  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: @item-border-color;
}
.attr-item-action-button:hover {
  color: rgb(29, 163, 194);
  transition: color 0.4s;
}
.item-input-wrapper-left {
  flex: 1;
  background-color: @bg-color;
  border-color: transparent;
  border-radius: 0px;
  border-style: solid;
  border-width: 1px;
  display: flex;
  padding: 0 16px;
  overflow: hidden;
  flex-direction: column;
  align-items: stretch;

  border-left-width: 1px;
  border-left-style: solid;
  border-left-color: @item-border-color;

  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: @item-border-color;

  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: @item-border-color;
}
.item-input-wrapper-right {
  flex: 1;
  background-color: @bg-color;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-style: solid;
  border-width: 1px;
  border-color: transparent;
  display: flex;
  padding: 0 16px;
  overflow: hidden;
  flex-direction: column;
  align-items: stretch;

  border-right-width: 1px;
  border-right-style: solid;
  border-right-color: @item-border-color;

  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: @item-border-color;

  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: @item-border-color;
}
.item-input {
  width: 100%;
  height: 48px;
  line-height: 48px;
  border-radius: 0px;
  border: none;
  font-size: 14px;
  outline: none;
  margin: 0;
  padding: 0px;
  box-shadow: none;
  color: #fff;
  background-color: @bg-color;
}
.space-label {
  width: 1px;
}
.space {
  width: 1px;
  background-color: @item-border-color;
}
.footer {
  margin-top: 8px;
}
</style>
