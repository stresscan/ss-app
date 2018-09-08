<template>
  <div class="card" :class="{opaque: disabled}">
    <div class="card-image" v-if="$slots.image">
      <slot name="image"></slot>
    </div>
    <div class="card-header" v-if="$slots.header || title">
      <slot name="header">
        <h4 class="card-title" :class="{'text-center': centerTitle}">{{ title }}</h4>
        <p class="card-category" v-if="subTitle">{{ subTitle }}</p>
      </slot>
      <div class="card-header-buttons">
        <slot name="card-header-buttons"></slot>
      </div>
    </div>
    <div class="card-body" v-if="$slots.default" :class="{'card-body-negative-top': cardBodyNegativeTop}">
      <slot></slot>
    </div>
    <slot name="raw-content"></slot>
    <div class="card-footer" v-if="$slots.footer">
      <hr>
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "card",
  props: {
    title: String,
    subTitle: String,
    disabled: Boolean,
    centerTitle: Boolean,
    cardBodyNegativeTop: Boolean
  }
};
</script>
<style>
.opaque {
  background-color: rgba(248, 248, 248, 0.5) !important;
}

.card-header-buttons {
  margin: 10px 0;
}

.card-body-negative-top {
  margin-top: -30px;
}

.card-title {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
