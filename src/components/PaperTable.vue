<template>
  <table class="table" :class="tableClass">
    <thead>
      <slot name="columns">
        <th v-for="column in columns" :key="column">{{column}}</th>
      </slot>
    </thead>
    <tbody>
      <tr v-for="(item, index) in data" :key="index">
        <slot :row="item">
          <td v-for="(column, index) in columns" :key="index" v-if="hasValue(item, column)">
            {{itemValue(item, column)}}
          </td>
          <td v-if="actionButtons">
            <a href="#" @click.prevent="onOpenData(item.id)" class="btn btn-sm btn-success">
              <i class="ti-pencil-alt"></i>
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
    actionButtons: false,
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
    }
  }
};
</script>
<style>
</style>
