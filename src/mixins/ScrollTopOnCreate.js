export const scrollTopMixin = {
  created() {
    this.scrollTop("#wrapper");
  },
  methods: {
    scrollTop() {
      this.$scrollTo("#wrapper");
    },
    scrollTopFast() {
      this.$scrollTo("#wrapper", { duration: 25 });
    }
  }
};
