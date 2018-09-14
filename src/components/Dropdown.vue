<template>
  <component :is="tag" class="dropdown" :class="{show:isOpen}" @click="toggleDropDown" v-click-outside="closeDropDown">
    <a class="dropdown-toggle btn-rotate" :class="titleClasses" data-toggle="dropdown">
      <slot name="title">
        <i :class="icon"></i>
        <span class="notification">{{title}}
          <b class="caret"></b>
        </span>
      </slot>
    </a>
    <ul class="dropdown-menu" :class="{show:isOpen, 'dropdown-notifications': isNotifications}">
      <div class="dropdown-menu-wrapper">
        <slot></slot>
      </div>
    </ul>
  </component>
</template>
<script>
export default {
  props: {
    tag: {
      type: String,
      default: "li"
    },
    isNotifications: {
      type: Boolean,
      default: false
    },
    title: String,
    icon: String,
    titleClasses: [String, Object, Array]
  },
  data() {
    return {
      isOpen: false
    };
  },
  methods: {
    toggleDropDown() {
      this.isOpen = !this.isOpen;
      this.$emit("change", this.isOpen);
    },
    closeDropDown() {
      this.isOpen = false;
      this.$emit("change", false);
    }
  }
};
</script>
<style>
.dropdown-notifications {
  left: -76px !important;
  width: 280px !important;
  top: -10px;
}

@media (min-width: 992px) {
  .navbar-nav > li > .dropdown-menu.dropdown-notifications:after {
    right: 59px !important;
  }
}

.dropdown .dropdown-menu.dropdown-notifications .dropdown-item {
  padding: 10px;
  white-space: initial;
}

.dropdown-menu.dropdown-notifications > .dropdown-menu-wrapper {
  overflow-y: auto;
  max-height: 400px;
}
</style>

