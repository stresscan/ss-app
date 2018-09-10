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
        <paper-table :clickable="true" @openData="onEdit" :showheaders="false" :toggleEnableCheckbox="true" @click="onEdit" @toggleEnable="onToggleEnable" :data="alertsTable.data" :columns="alertsTable.columns" type="hover"></paper-table>
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
          <h5>{{ alertForm.id ? 'Editar' : 'Criar' }} Alerta</h5>
        </div>
      </div>

      <div class="row">
        <div class="col-8 offset-2">
          <div class="row">
            <div class="col-12 col-sm-6">
              <div class="form-group">
                <select class="form-control" v-model="alertForm.metric">
                  <option disabled v-if="gettingAlertData" value="">Aguarde...</option>
                  <option value="temperatura">Temperatura</option>
                  <option value="umidade">Umidade</option>
                </select>
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="form-group">
                <select class="form-control" v-model="alertForm.for">
                  <option disabled v-if="gettingAlertData" value="">Aguarde...</option>
                  <option value="ambiente">Ambiente</option>
                  <option value="planta">Planta</option>
                </select>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-sm-6">
              <div class="form-group">
                <select class="form-control" v-model="alertForm.when">
                  <option disabled v-if="gettingAlertData" value="">Aguarde...</option>
                  <option value="maior">Maior</option>
                  <option value="menor">Menor</option>
                </select>
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="form-group">
                <ss-fg-input :spinner="gettingAlertData" type="number" v-model="alertForm.parameter"></ss-fg-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12 text-center">
              <input type="hidden" name="" v-model="alertForm.id">
              <p-button :disabled="gettingAlertData" nativeType="submit" type="success" round>
                <template v-if="gettingAlertData">
                  <i class="fa fa-spinner"></i>
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
import firebase from "firebase";
import { mapState } from "vuex";
import basePage from "@/mixins/BasePage.js";
import logService from "@/services/LogService.js";
import { PaperTable } from "@/components";
import placesService from "@/services/PlacesService.js";
import alertsService from "@/services/AlertsSevice.js";

export default {
  mixins: [basePage],
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
        parameter: ""
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
  created() {
    const getTotalOfAlerts = (placeId, towerId) => {
      const ref = firebase
        .firestore()
        .collection("places")
        .doc(placeId)
        .collection("towers")
        .doc(towerId)
        .collection("alerts");

      return new Promise(resolve => {
        ref.get().then(alertsList => {
          resolve(alertsList.size);
        });
      });
    };

    const getAlertsList = (placeId, towerId) => {
      firebase
        .firestore()
        .collection("places")
        .doc(placeId)
        .collection("towers")
        .doc(towerId)
        .collection("alerts")
        .orderBy("datetime", "desc")
        .onSnapshot(snapshot => {
          this.gettingAlerts = false;

          snapshot.docChanges().forEach(change => {
            if (change.type === "added") {
              this.alertsTable.data.unshift({
                id: change.doc.id,
                alert: `${change.doc.data().metric}: ${change.doc.data().for} ${
                  change.doc.data().when
                } que ${change.doc.data().parameter}`
              });
              this.tower.totalOfAlerts++;
            }
            if (change.type === "modified") {
              this.alertsTable.data = this.alertsTable.data.map(item => {
                if (item.id === change.doc.id) {
                  return {
                    id: change.doc.id,
                    alert: `${change.doc.data().metric}: ${
                      change.doc.data().for
                    } ${change.doc.data().when} que ${
                      change.doc.data().parameter
                    }`
                  };
                } else {
                  return item;
                }
              });
            }
            if (change.type === "removed") {
              this.alertsTable.data = this.alertsTable.data.filter(
                item => item.id !== change.doc.id
              );

              this.tower.totalOfAlerts--;
            }
          });
        });
    };

    placesService
      .getTowerData(this.$route.params.placeId, this.$route.params.towerId)
      .then(data => {
        this.gettingTowerData = false;
        this.tower = Object.assign(this.tower, data);
      });

    getAlertsList(this.$route.params.placeId, this.$route.params.towerId);

    getTotalOfAlerts(
      this.$route.params.placeId,
      this.$route.params.towerId
    ).then(qnt => {
      Object.assign(this.tower, {
        totalOfAlerts: qnt
      });
    });

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
        metric: "temperatura",
        for: "planta",
        when: "maior",
        parameter: 0
      };
    },
    onAlertFormSubmit() {
      const ref = firebase
        .firestore()
        .collection("places")
        .doc(this.$route.params.placeId)
        .collection("towers")
        .doc(this.$route.params.towerId)
        .collection("alerts");

      if (!this.alertForm.id) {
        ref
          .add(
            Object.assign(this.alertForm, {
              datetime: Date.now()
            })
          )
          .then(doc => {
            this.notifyVue(
              "bottom",
              "right",
              "success",
              "Notificação criada com sucesso",
              "ti-thumb-up"
            );
          })
          .catch(e => {
            this.notifyVue(
              "bottom",
              "right",
              "danger",
              "A Notificação não pode ser criada: erro inesperado",
              "ti-thumb-down"
            );

            logService.logError(
              new Date().getTime(),
              `A Notificação não pode ser criada: ${e.message}`,
              "createAlert",
              "create Alert",
              this.stateUid
            );
          });
      } else {
        ref
          .doc(this.alertForm.id)
          .update({
            metric: this.alertForm.metric,
            for: this.alertForm.for,
            when: this.alertForm.when,
            parameter: this.alertForm.parameter
          })
          .catch(e => {
            this.notifyVue(
              "bottom",
              "right",
              "danger",
              "A Notificação não pode ser editada: erro inesperado",
              "ti-thumb-down"
            );

            logService.logError(
              new Date().getTime(),
              `A Notificação não pode ser editada: ${e.message}`,
              "createUser",
              "create user account",
              this.stateUid
            );
          });
      }

      this.onHideAlertForm();
    },
    onEdit(id) {
      this.gettingAlertData = true;

      alertsService
        .getAlertData(
          this.$route.params.placeId,
          this.$route.params.towerId,
          id
        )
        .then(data => {
          this.alertForm = data;
          this.gettingAlertData = false;
        });

      this.onShowAlertForm(false);
    },
    onRemove(id) {
      this.$dialog
        .confirm("Deseja realmente excluir essa notificação?")
        .then(dialog => {
          firebase
            .firestore()
            .collection("places")
            .doc(this.$route.params.placeId)
            .collection("towers")
            .doc(this.$route.params.towerId)
            .collection("alerts")
            .doc(id)
            .delete()
            .then(() => {
              this.onHideAlertForm();

              this.notifyVue(
                "bottom",
                "right",
                "success",
                "Notificação excluida com sucesso",
                "ti-thumb-up"
              );
            })
            .catch(e => {
              this.notifyVue(
                "bottom",
                "right",
                "danger",
                "A Notificação não pode ser excluída: erro inesperado",
                "ti-thumb-down"
              );

              logService.logError(
                new Date().getTime(),
                `A Notificação não pode ser excluída: ${e.message}`,
                "createUser",
                "create user account",
                this.stateUid
              );
            });
        });
    },
    onToggleEnable(id) {
      console.log("onToggleEnable", id);
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
