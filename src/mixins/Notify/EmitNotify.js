export const emitNotify = {
  methods: {
    emitNotify(payload) {
      console.log({ payload });
      console.log(`emitindo notify${payload.type} com msg '${payload.msg}'`);
      this.$emit(`notify${payload.type}`, payload);
    }
  }
};
