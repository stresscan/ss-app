<template>
  <table class="table" :class="tableClass">
    <thead>
      <slot name="columns" v-if="showheaders">
        <th v-for="column in columns" :key="column">{{column}}</th>
      </slot>
    </thead>
    <tbody>
      <tr v-for="(item, index) in data" :key="index">
        <slot :row="item">
          <td v-if="toggleCheckbox" class="custom-toggle-button">
            <toggle-button @change="onToggleCheckbox(item)" v-model="item.enabled" />
          </td>
          <td v-for="(column, index) in columns" :key="index" v-if="hasValue(item, column)" :class="{ clickable }" @click="onOpenData(item.id)">
            {{itemValue(item, column)}}
          </td>
          <td v-if="editButton || removeButton" class="action-buttons">
            <a v-if="editButton" href="#" @click.prevent="onEditData(item.id)" class="btn btn-sm btn-success mg-lf-xs">
              <i class="ti-pencil-alt"></i>
            </a>
            <a v-if="removeButton" href="#" @click.prevent="onRemoveData(item.id)" class="btn btn-sm btn-danger mg-lf-xs">
              <i class="ti-trash"></i>
            </a>
          </td>
        </slot>
      </tr>
    </tbody>
  </table>
</template>
<script>
import ToggleButton from "vue-js-toggle-button/src/Button";

export default {
  name: "paper-table",
  components: {
    ToggleButton
  },
  props: {
    editButton: {
      type: Boolean,
      default: false
    },
    removeButton: {
      type: Boolean,
      default: false
    },
    toggleCheckbox: {
      type: Boolean,
      default: false
    },
    columns: Array,
    data: Array,
    type: {
      type: String, // striped | hover
      default: "striped"
    },
    title: {
      type: String,
      default: ""
    },
    subTitle: {
      type: String,
      default: ""
    },
    showheaders: {
      type: Boolean,
      default: true
    },
    clickable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    tableClass() {
      return `table-${this.type}`;
    }
  },
  methods: {
    hasValue(item, column) {
      return item[column.toLowerCase()] !== "undefined";
    },
    itemValue(item, column) {
      return item[column.toLowerCase()];
    },
    onOpenData(id) {
      this.$emit("openData", id);
    },
    onEditData(id) {
      this.$emit("editData", id);
    },
    onRemoveData(id) {
      this.$emit("removeData", id);
    },
    onToggleCheckbox(item) {
      this.$emit("toggleCheckbox", item);
    }
  }
};
</script>
<style>
.clickable {
  cursor: pointer;
}

.action-buttons {
  text-align: right;
}

.custom-toggle-button {
  padding-top: 23px !important;
  padding-right: 0 !important;
}
</style>
