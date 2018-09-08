<template>
  <div class="row">
    <div class="col-12">
      <card :title="table.title">
        <div slot="card-header-buttons">
          <p-button type="success" round @click.native.prevent="onNewUserClick">
            <i class="ti-plus"></i> Adicionar Novo Usuário
          </p-button>
        </div>
        <div slot="raw-content" class="table-responsive no-border">
          <div v-if="!dataLoaded" class="ss-inline-spinner el-center mg-tp-md mg-bt-md"></div>
          <paper-table :editButton="true" @editData="onEditUserData" v-if="dataLoaded" :data="table.data" :columns="table.columns"></paper-table>
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
  mounted() {
    if (this.$route.query.edited == 1) {
      this.notifyVue(
        "bottom",
        "right",
        "success",
        "Usuário atualizado com sucesso",
        "ti-thumb-up"
      );
    }

    if (this.$route.query.created == 1) {
      this.notifyVue(
        "bottom",
        "right",
        "success",
        "Usuário criado com sucesso",
        "ti-thumb-up"
      );
    }
  },
  methods: {
    onNewUserClick() {
      this.$router.replace("create");
    },
    onEditUserData(id) {
      this.$router.push(id);
    },
    notifyVue(verticalAlign, horizontalAlign, type, message, icon) {
      this.$notify({
        message,
        icon,
        horizontalAlign,
        verticalAlign,
        type
      });
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
