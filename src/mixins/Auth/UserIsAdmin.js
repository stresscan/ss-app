import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      stateIsAdmin: state => state.users.user.isAdmin
    })
  },
  methods: {
    isAdmin() {
      const isadmin = String(this.stateIsAdmin) == "true";
      return isadmin;
    }
  }
};
