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
          <td v-for="(column, index) in columns" :key="index" v-if="hasValue(item, column)">
            {{itemValue(item, column)}}
          </td>
          <td v-if="editButton || removeButton" class="action-buttons">
            <a v-if="editButton" href="#" @click.prevent="onEditData(item.id)" class="btn btn-sm btn-success mg-lf-xs">
              <i class="ti-pencil-alt"></i>
            </a>
            <a v-if="removeButton" href="#" @click.prevent="onRemoveData(item.id)" class="btn btn-sm btn-danger mg-lf-xs">
              <i class="ti-trash"></i>
            </a>
            <a v-if="toggleEnableCheckbox" href="#" @click.prevent="onToggleEnable(item.id)" class="btn btn-sm btn-info mg-lf-xs">
              <i class="ti-trash"></i>
            </a>
          </td>
        </slot>
      </tr>
    </tbody>
  </table>
</template>
<script>
export default {
  name: "paper-table",
  props: {
    editButton: false,
    removeButton: false,
    toggleEnableCheckbox: false,
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
    onEditData(id) {
      this.$emit("editData", id);
    },
    onRemoveData(id) {
      this.$emit("removeData", id);
    },
    onToggleEnable(id) {
      this.$emit("toggleEnable", id);
    }
  }
};
</script>
<style>
.action-buttons {
  text-align: right;
}
</style>
