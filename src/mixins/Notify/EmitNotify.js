export const emitNotify = {
  methods: {
    emitNotify(payload) {
      this.$emit(`notify${payload.type}`, payload);
    }
  }
};
