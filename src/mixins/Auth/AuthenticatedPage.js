import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      stateUid: state => state.users.user.uid
    })
  },
  created() {
    if (!this.stateUid) {
      this.$router.replace("/login");
    }
  }
};
