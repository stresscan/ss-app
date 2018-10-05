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
import { PaperTable } from "@/components";
import { notifyMixin } from "@/mixins/Notify";
import basicPageMixin from "@/mixins/BasicPage";
import usersProfileService from "@/services/UsersProfileService";

export default {
  mixins: [basicPageMixin, notifyMixin],
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
    this.table.data = await usersProfileService.list();
    this.dataLoaded = true;
  },
  mounted() {
    if (this.$route.query.edited == 1) {
      this.notifySuccess({
        msg: `Usuário atualizado com sucesso`
      });
    }

    if (this.$route.query.created == 1) {
      this.notifySuccess({
        msg: `Usuário criado com sucesso`
      });
    }
  },
  methods: {
    onNewUserClick() {
      this.$router.replace("create");
    },
    onEditUserData(uid) {
      this.$router.push(uid);
    }
  }
};
</script>
<style lang="scss" scoped>
.table-responsive {
  overflow-x: auto !important;
}
@media (min-width: 450px) {
  .table-responsive {
    overflow: hidden;
  }
}
</style>
