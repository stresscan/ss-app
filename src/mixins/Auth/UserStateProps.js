import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      stateUsername: state => state.users.user.username,
      stateIsAdmin: state => state.users.user.isAdmin,
      stateUid: state => state.users.user.uid
    })
  }
};
