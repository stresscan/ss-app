<template>
  <div class="row">
    <div class="col-12">
      <card :title="table.title">
        <div slot="card-header-buttons">
          <p-button type="success" round @click.native.prevent="onNewUser">
            <i class="ti-user"></i> Novo
          </p-button>
        </div>
        <div slot="raw-content" class="table-responsive no-border">
          <paper-table :data="table.data" :columns="table.columns">

          </paper-table>
        </div>
      </card>
    </div>
  </div>
</template>
<script>
import firebase from "firebase";
import { PaperTable } from "@/components";

export default {
  components: {
    PaperTable
  },
  data() {
    return {
      table: {
        title: "Usuários Cadastrados no Sistema",
        columns: ["Nome", "Username", "Nivel"],
        data: []
      }
    };
  },
  async created() {
    const getUsers = () => {
      return new Promise(resolve => {
        firebase
          .firestore()
          .collection("users_profile")
          .get()
          .then(querySnapshot => {
            let users = [];
            querySnapshot.forEach(docSnapshot => {
              users.push({
                uid: docSnapshot.id,
                nome: `${docSnapshot.data().name} ${
                  docSnapshot.data().surname
                }`,
                nivel: docSnapshot.data().isAdmin ? "admin" : "cliente",
                username: docSnapshot.data().username,
                status: docSnapshot.data().disabled ? "desativado" : "ativado"
              });
            });

            resolve(users);
          });
      });
    };

    this.table.data = await getUsers();
  },
  methods: {
    onNewUser() {
      this.$router.replace("new");
    }
  }
};
</script>
<style lang="scss" scoped>
@media (min-width: 450px) {
  .table-responsive {
    overflow: hidden;
  }
}
</style>
