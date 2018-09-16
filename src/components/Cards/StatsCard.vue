<template>
  <card :disabled="disabled" :title="title" :sub-title="subtitle" :centerTitle="centerTitle">
    <slot name="raw-content" />
    <div class="row inside-card" v-if="$slots.header || $slots.content">
      <div class="col-3" v-if="$slots.header">
        <slot name="header"></slot>
      </div>
      <div class="col-9" v-if="$slots.content">
        <slot name="content"></slot>
      </div>
    </div>
    <div v-if="$slots.footer">
      <hr/>
      <slot name="footer"></slot>
    </div>
  </card>
</template>
<script>
import Card from "./Card.vue";

export default {
  name: "stats-card",
  props: {
    title: String,
    subtitle: String,
    centerTitle: Boolean,
    disabled: Boolean
  },
  components: {
    Card
  }
};
</script>

<style lang="scss">
.small-info {
  font-size: 0.3em;

  @media (min-width: 280px) {
    font-size: 0.4em;
  }

  @media (min-width: 890px) {
    font-size: x-small;
  }
}

.big-info {
  font-size: 2em;
}

.row.inside-card {
  padding: 0;

  @media (min-width: 376px) {
    padding: 3px 34px;
  }

  @media (min-width: 480px) {
    padding: 3px 64px;
  }

  @media (min-width: 575px) {
    padding: 0;
  }

  .card-icon {
    padding-top: 18px;
  }

  .card-icon-tower {
    font-size: 12px;
    position: relative;
    top: -16px;
    left: -15px;
    border-radius: 38%;
    padding: 5px;
    color: #666;
  }
}
</style>
