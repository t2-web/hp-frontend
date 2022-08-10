<template>
  <a-input
    :id="inputId"
    :disabled="disabled"
    :placeholder="placeholder"
    :maxLength="maxlength"
    :type="inputType"
    :class="classCs"
    :value="value"
    v-on:input="$emit('input', $event.target.value)"
    @blur="$emit('blur', $event.target.value)"
    @focus="$emit('focus', $event.target.value)"
  >
  </a-input>
</template>
<script>
export default {
  props: {
    id: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [String, Number],
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    error: {
      type: String,
      default: '',
    },
    classCs: {
      type: String,
      default: '',
    },
    maxlength: {
      type: Number,
      default: 99999,
    },
    inputType: {
      type: String,
      default: 'text',
      validator: function(switchValue) {
        return ['text', 'password', 'number'].indexOf(switchValue) !== -1;
      },
    },
  },
  data() {
    return {
      inputId: '',
    };
  },
  components: {},
  mounted() {
    if (this.id != '') {
      this.inputId = this.id;
      return;
    }

    let id = this.label
      .trim()
      .split(/ +/)
      .reduce((res, curr) => res + curr[0].toUpperCase() + curr.slice(1));

    this.inputId = id;
  },
};
</script>
<style lang="less"></style>
