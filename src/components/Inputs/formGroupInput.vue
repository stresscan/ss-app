<template>
  <div class="form-group" :class="{'input-group': hasIcon}">
    <slot name="label">
      <label v-if="label" class="control-label">
        {{label}}
      </label>
    </slot>
    <slot name="addonLeft">
      <span v-if="addonLeftIcon" class="input-group-prepend">
        <i :class="addonLeftIcon" class="input-group-text"></i>
      </span>
    </slot>
    <input :class="{ uppercase }" :value="value" @input="$emit('input',$event.target.value)" v-bind="$attrs" class="form-control" aria-describedby="addon-right addon-left">
    <div v-if="spinner" class="spinner"></div>
    <slot></slot>
    <slot name="addonRight">
      <span v-if="addonRightIcon" class="input-group-append">
        <i :class="addonRightIcon" class="input-group-text"></i>
      </span>
    </slot>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  name: "ss-fg-input",
  props: {
    label: String,
    value: [String, Number],
    addonRightIcon: String,
    addonLeftIcon: String,
    spinner: Boolean,
    uppercase: Boolean
  },
  computed: {
    hasIcon() {
      const { addonRight, addonLeft } = this.$slots;
      return (
        addonRight !== undefined ||
        addonLeft !== undefined ||
        this.addonRightIcon !== undefined ||
        this.addonLeftIcon !== undefined
      );
    }
  }
};
</script>
<style lang="scss">
.uppercase {
  text-transform: uppercase;
}
.spinner {
  animation: spinnerRotate 1s linear infinite;
  border: solid 3px transparent;
  border-top: solid 3px #4db6ac;
  border-radius: 100%;
  width: 25px;
  height: 25px;
  margin-top: -34px;
  float: right;
  margin-right: 10px;
}

@keyframes spinnerRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
