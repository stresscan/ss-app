<template>
  <div>
    <a href="#" class="back-link" @click.prevent="onGoBack">
      <i class="ti-arrow-left"></i> Voltar
    </a>
    <div v-if="gettingTowerData" class="ss-inline-spinner mg-bt-md"></div>
    <h5 v-else>
      <span class="status online" v-if="!tower.disabled">online</span>
      <span class="status offline" v-else>offline</span>
      {{ tower.name }}
      <small class="d-block text-muted">{{ tower.id }}</small>
    </h5>
    <h3>Alertas</h3>
    <div v-if="gettingAlerts" class="ss-inline-spinner mg-bt-md"></div>
    <div v-else>
      <div class="row" v-if="tower.totalOfAlerts === 0">
        <div class="col-sm-12 mg-lf-sm mg-tp-sm text-info">
          <i class="fa fa-close"></i>
          <b>Nenhum alerta criado para essa torre</b>
        </div>
      </div>
      <div class="row" v-else>
        <paper-table :clickable="true" :showheaders="false" :toggleCheckbox="true" @click="onOpenEditForm" @toggleCheckbox="onToggleEnable" :data="alertsTable.data" :columns="alertsTable.columns" type="hover"></paper-table>
      </div>
    </div>
    <p-button type="success" class="mg-tp-md" round @click.native.prevent="onAddNewAlert">
      <i class="ti-plus "></i> Criar Alerta
    </p-button>

    <form v-if="showAlertForm" class="form-add-Alert pd-all-md" @submit.prevent="onAlertFormSubmit">
      <a href="#" @click.prevent="onHideAlertForm" class="close-modal">
        <i class="fa fa-close"></i>
      </a>

      <div class="row">
        <div class="col-12 text-center text-uppercase">
          <h5 v-if="!gettingAlertData">{{ alertForm.id ? 'Editar' : 'Criar' }} Alerta</h5>
          <div v-else class="ss-inline-spinner mg-bt-md el-center"></div>
        </div>
      </div>

      <div class="row">
        <div class="col-8 offset-2">
          <div class="row">
            <div class="col-12 col-sm-6">
              <div class="form-group">
                <select class="form-control" v-model="alertForm.metric">
                  <option disabled v-if="gettingAlertData" value="">Aguarde...</option>
                  <option value="temperature">Temperatura</option>
                  <option value="humidity">Umidade</option>
                </select>
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="form-group">
                <select class="form-control" v-model="alertForm.for">
                  <option disabled v-if="gettingAlertData" value="">Aguarde...</option>
                  <option value="environment">Ambiente</option>
                  <option value="ground">Planta</option>
                </select>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-sm-6">
              <div class="form-group">
                <select class="form-control" v-model="alertForm.when">
                  <option disabled v-if="gettingAlertData" value="">Aguarde...</option>
                  <option value="high">Maior que</option>
                  <option value="low">Menor que</option>
                </select>
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="form-group">
                <ss-fg-input :spinner="gettingAlertData" type="number" v-model="alertForm.value"></ss-fg-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12 text-center">
              <input type="hidden" name="" v-model="alertForm.id">
              <p-button :disabled="gettingAlertData" nativeType="submit" type="success" round>
                <template v-if="gettingAlertData">
                  <i class="fa fa-spinner fa-spin"></i>
                </template>
                <template v-else>
                  ok
                </template>
              </p-button>
              <a href="#" v-if="alertForm.id" class="mg-lf-sm text-danger" @click.prevent="onRemove(alertForm.id)">Excluir</a>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
// import firebase from "firebase/app";
// import "firebase/firestore";

import { mapState } from "vuex";
import basicPageMixin from "@/mixins/BasicPage";
import { notifyMixin } from "@/mixins/Notify";
import { PaperTable } from "@/components";
import logService from "@/services/LogService";
import placesService from "@/services/PlacesService";
import towersService from "@/services/TowersService";
import alertsService from "@/services/AlertsSevice";

export default {
  mixins: [basicPageMixin, notifyMixin],
  components: {
    PaperTable
  },
  data() {
    return {
      tower: {
        id: "",
        name: "",
        totalOfAlerts: ""
      },
      alertsTable: {
        title: "",
        columns: ["alert"],
        data: []
      },
      alertForm: {
        metric: "",
        for: "",
        when: "",
        value: ""
      },
      gettingTowerData: true,
      gettingAlertData: true,
      gettingAlerts: true,
      showAlertForm: false
    };
  },
  computed: {
    ...mapState({
      stateUid: state => state.users.user.uid
    })
  },
  async created() {
    // const getRealtimeAlertsList = (placeId, towerId) => {
    //   firebase
    //     .firestore()
    //     .collection("places")
    //     .doc(placeId)
    //     .collection("towers")
    //     .doc(towerId)
    //     .collection("alerts")
    //     .orderBy("datetime", "desc")
    //     .onSnapshot(querySnapshot => {
    //       this.gettingAlerts = false;

    //       querySnapshot.docChanges().forEach(change => {
    //         const data = change.doc.data();
    //         const itemChanged = {
    //           id: change.doc.id,
    //           enabled: data.enabled,
    //           alert: `${
    //             data.metric === "temperature" ? "Temperatura" : "Umidade"
    //           } ${data.for === "ground" ? "da planta" : "do ambiente"} ${
    //             data.when === "high" ? "maior" : "menor"
    //           } que ${data.value}`
    //         };

    //         if (change.type === "added") {
    //           this.alertsTable.data.unshift(itemChanged);
    //           this.tower.totalOfAlerts++;
    //         }

    //         if (change.type === "modified") {
    //           this.alertsTable.data = this.alertsTable.data.map(item => {
    //             if (item.id === change.doc.id) {
    //               return itemChanged;
    //             } else {
    //               return item;
    //             }
    //           });
    //         }

    //         if (change.type === "removed") {
    //           this.alertsTable.data = this.alertsTable.data.filter(
    //             item => item.id !== change.doc.id
    //           );

    //           this.tower.totalOfAlerts--;
    //         }
    //       });
    //     });
    // };

    try {
      const tower = await towersService.get(
        this.$route.params.placeId,
        this.$route.params.towerId
      );

      this.gettingTowerData = false;
      this.tower = Object.assign(this.tower, tower);
    } catch (e) {
      console.error(e.message);
    }

    // getRealtimeAlertsList(
    //   this.$route.params.placeId,
    //   this.$route.params.towerId
    // );

    try {
      const alertsList = await alertsService.list(
        this.$route.params.placeId,
        this.$route.params.towerId
      );

      Object.assign(this.tower, {
        totalOfAlerts: alertsList.length()
      });
    } catch (e) {
      console.error(e.message);
    }

    this.$nextTick(() => {
      document.querySelector(".main-panel").classList.remove("overflow-hidden");
    });
  },
  methods: {
    onGoBack() {
      this.$router.push("../../towers/list");
    },
    onAddNewAlert() {
      this.onShowAlertForm(true);
      this.gettingAlertData = false;
    },
    onShowAlertForm(resetForm) {
      this.showAlertForm = true;

      if (resetForm) {
        this.resetForm();
      }

      this.scrollTopFast();

      this.$nextTick(() => {
        document.querySelector(".main-panel").classList.add("overflow-hidden");
      });
    },
    onHideAlertForm() {
      this.showAlertForm = false;
      this.resetForm();
      this.$nextTick(() => {
        document
          .querySelector(".main-panel")
          .classList.remove("overflow-hidden");
      });
    },
    resetForm() {
      this.alertForm = {
        metric: "temperature",
        for: "ground",
        when: "high",
        value: 0
      };
    },
    async onAlertFormSubmit() {
      const placeId = this.$route.params.placeId;
      const towerId = this.$route.params.towerId;

      if (!this.alertForm.id) {
        try {
          await alertsService.create(
            placeId,
            towerId,
            Object.assign(this.alertForm, {
              datetime: Date.now(),
              enabled: true
            })
          );
          this.notifySuccess({
            msg: `Alerta criado com sucesso`
          });
        } catch (e) {
          this.notifyError({
            msg: `O alerta não pode ser criado: erro inesperado`
          });

          logService.logError(
            new Date().getTime(),
            `O alerta não pode ser criado: ${e.message}`,
            "createAlert",
            "create Alert",
            this.stateUid
          );
        }
      } else {
        this.updateAlert(placeId, towerId, this.alertForm);
      }

      this.onHideAlertForm();
    },
    async onOpenEditForm(id) {
      this.gettingAlertData = true;

      try {
        const alert = await alertsService.get(
          this.$route.params.placeId,
          this.$route.params.towerId,
          id
        );

        this.alertForm = alert;
        this.gettingAlertData = false;
      } catch (e) {
        console.error(e.message);
      }

      this.onShowAlertForm(false);
    },
    async onRemove(id) {
      try {
        await this.$dialog.confirm("Deseja realmente excluir esse alerta?");

        try {
          await alertsService.delete(
            this.$route.params.placeId,
            this.$route.params.towerId,
            id
          );

          this.onHideAlertForm();

          this.notifySuccess({
            msg: `Alerta excluído com sucesso`
          });
        } catch (e) {
          this.notifyError({
            msg: `O alerta não pode ser excluído: erro inesperado`
          });

          logService.logError(
            new Date().getTime(),
            `O alerta não pode ser excluído: ${e.message}`,
            "createUser",
            "create user account",
            this.stateUid
          );
        }
      } catch (e) {}
    },
    async updateAlert(alert) {
      try {
        await alertsService.update(
          this.$route.params.placeId,
          this.$route.params.towerId,
          alert
        );
      } catch (e) {
        this.notifyError({
          msg: `O alerta não pode ser editado: erro inesperado`
        });

        logService.logError(
          new Date().getTime(),
          `O alerta ${alert.id} da torre ${
            this.$route.params.towerId
          } do local ${this.$route.params.placeId} não pode ser editado: ${
            e.message
          }`,
          "createUser",
          "create user account",
          this.stateUid
        );
      }
    },
    onToggleEnable(alert) {
      this.updateAlert(alert);
    }
  }
};
</script>
<style>
.form-add-Alert {
  display: flex;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
}

.close-modal {
  display: block;
  border: solid;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: #333;
  position: absolute;
  top: 10px;
  left: 10px;
}

.close-modal:hover {
  color: white;
}

.close-modal i {
  font-size: 18px;
}
</style>
