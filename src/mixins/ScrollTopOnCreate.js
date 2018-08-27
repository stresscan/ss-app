export const scrollTopMixin = {
  created() {
    this.$scrollTo("#wrapper");
  },
  methods: {
    scrollTop() {
      this.$scrollTo("#wrapper");
    }
  }
};
