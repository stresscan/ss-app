<template>
  <div class="row">
    <div class="col-12">
      <card :title="table.title">
        <div slot="card-header-buttons">
          <p-button type="success" round @click.native.prevent="onCreateUser">
            <i class="ti-user"></i> Novo
          </p-button>
        </div>
        <div slot="raw-content" class="table-responsive no-border">
          <div style="padding: 10px" v-if="!dataLoaded">Carregando...</div>
          <paper-table :actionButtons="true" @open-data="onOpenUserData" v-if="dataLoaded" :data="table.data" :columns="table.columns">

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
      dataLoaded: false,
      table: {
        title: "Usuários Cadastrados no Sistema",
        columns: ["Nome", "Username", "Nivel"],
        data: []
      }
    };
  },
  methods: {
    onOpenUserData() {
      console.log("doing something");
    }
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
                id: docSnapshot.id,
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
    this.dataLoaded = true;
  },
  methods: {
    onCreateUser() {
      this.$router.replace("create");
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
