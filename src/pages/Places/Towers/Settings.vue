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
    <h3>Notificações</h3>
    <div v-if="gettingNotifications" class="ss-inline-spinner mg-bt-md"></div>
    <div v-else>
      <div class="row" v-if="tower.totalOfNotifications === 0">
        <div class="col-sm-12 mg-lf-sm mg-tp-sm text-info">
          <i class="fa fa-close"></i>
          <b>Nenhuma notificação cadastrada para essa torre</b>
        </div>
      </div>
      <div class="row" v-else>
        <paper-table :showheaders="false" :editButton="true" :removeButton="true" :toggleEnableCheckbox="true" @editData="onEdit" @removeData="onRemove" @toggleEnable="onToggleEnable" :data="notificationsTable.data" :columns="notificationsTable.columns" type="hover"></paper-table>
      </div>
    </div>
    <p-button type="success" class="mg-tp-md" round @click.native.prevent="onShowNotificationForm(true)">
      <i class="ti-plus "></i> Criar Notificação
    </p-button>

    <form v-if="showNotificationForm" class="form-add-notification pd-all-md" @submit.prevent="onNotificationFormSubmit">
      <a href="#" @click.prevent="onHideNotificationForm" class="close-modal">
        <i class="fa fa-close"></i>
      </a>

      <div class="row">
        <div class="col-12 text-center text-uppercase">
          <h5>Criar Notificação</h5>
        </div>
      </div>

      <div class="row">
        <div class="col-8 offset-2">
          <div class="row">
            <div class="col-12 col-sm-6">
              <div class="form-group">
                <select class="form-control" v-model="notificationForm.metric">
                  <option value="temperatura">Temperatura</option>
                  <option value="umidade">Umidade</option>
                </select>
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="form-group">
                <select class="form-control" v-model="notificationForm.for">
                  <option value="ambiente">Ambiente</option>
                  <option value="planta">Planta</option>
                </select>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-sm-6">
              <div class="form-group">
                <select class="form-control" v-model="notificationForm.when">
                  <option value="maior">Maior</option>
                  <option value="menor">Menor</option>
                </select>
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="form-group">
                <ss-fg-input type="number" v-model="notificationForm.parameter"></ss-fg-input>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12 text-center">
              <input type="hidden" name="" v-model="notificationForm.id">
              <p-button nativeType="submit" type="success" round>
                {{ notificationForm.id ? 'Editar' : 'Criar' }}
              </p-button>
              <a href="#" class="mg-lf-sm" @click.prevent="onHideNotificationForm">Cancelar</a>
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
import notificationsService from "@/services/NotificationsSevice.js";

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
        totalOfNotifications: ""
      },
      notificationsTable: {
        title: "",
        columns: ["notification"],
        data: []
      },
      notificationForm: {
        metric: "temperatura",
        for: "planta",
        when: "maior",
        parameter: 0
      },
      gettingTowerData: true,
      gettingNotifications: true,
      showNotificationForm: false
    };
  },
  computed: {
    ...mapState({
      stateUid: state => state.users.user.uid
    })
  },
  created() {
    const getTotalOfNotifications = (placeId, towerId) => {
      const ref = firebase
        .firestore()
        .collection("places")
        .doc(placeId)
        .collection("towers")
        .doc(towerId)
        .collection("notifications");

      return new Promise(resolve => {
        ref.get().then(notificationsList => {
          resolve(notificationsList.size);
        });
      });
    };

    const getNotificationsList = (placeId, towerId) => {
      firebase
        .firestore()
        .collection("places")
        .doc(placeId)
        .collection("towers")
        .doc(towerId)
        .collection("notifications")
        .orderBy("datetime", "desc")
        .onSnapshot(snapshot => {
          this.gettingNotifications = false;

          snapshot.docChanges().forEach(change => {
            if (change.type === "added") {
              this.notificationsTable.data.unshift({
                id: change.doc.id,
                notification: `${change.doc.data().metric} - ${
                  change.doc.data().for
                } - ${change.doc.data().when} - ${change.doc.data().parameter}`
              });
              this.tower.totalOfNotifications++;
            }
            if (change.type === "modified") {
              this.notificationsTable.data = this.notificationsTable.data.map(
                item => {
                  if (item.id === change.doc.id) {
                    return {
                      id: change.doc.id,
                      notification: `${change.doc.data().metric} - ${
                        change.doc.data().for
                      } - ${change.doc.data().when} - ${
                        change.doc.data().parameter
                      }`
                    };
                  } else {
                    return item;
                  }
                }
              );
            }
            if (change.type === "removed") {
              this.notificationsTable.data = this.notificationsTable.data.filter(
                item => item.id !== change.doc.id
              );

              this.tower.totalOfNotifications--;
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

    getNotificationsList(
      this.$route.params.placeId,
      this.$route.params.towerId
    );

    getTotalOfNotifications(
      this.$route.params.placeId,
      this.$route.params.towerId
    ).then(qnt => {
      Object.assign(this.tower, {
        totalOfNotifications: qnt
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
    onShowNotificationForm(resetForm) {
      this.showNotificationForm = true;

      if (resetForm) {
        this.resetForm();
      }

      this.scrollTopFast();
      this.$nextTick(() => {
        document.querySelector(".main-panel").classList.add("overflow-hidden");
      });
    },
    onHideNotificationForm() {
      this.showNotificationForm = false;
      this.resetForm();
      this.$nextTick(() => {
        document
          .querySelector(".main-panel")
          .classList.remove("overflow-hidden");
      });
    },
    resetForm() {
      this.notificationForm = {
        metric: "temperatura",
        for: "planta",
        when: "maior",
        parameter: 0
      };
    },
    onNotificationFormSubmit() {
      const ref = firebase
        .firestore()
        .collection("places")
        .doc(this.$route.params.placeId)
        .collection("towers")
        .doc(this.$route.params.towerId)
        .collection("notifications");

      if (!this.notificationForm.id) {
        ref
          .add(
            Object.assign(this.notificationForm, {
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
              "createNotification",
              "create notification",
              this.stateUid
            );
          });
      } else {
        ref
          .doc(this.notificationForm.id)
          .update({
            metric: this.notificationForm.metric,
            for: this.notificationForm.for,
            when: this.notificationForm.when,
            parameter: this.notificationForm.parameter
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

      this.onHideNotificationForm();
    },
    onEdit(id) {
      notificationsService
        .getNotificationData(
          this.$route.params.placeId,
          this.$route.params.towerId,
          id
        )
        .then(data => {
          this.notificationForm = data;
          this.onShowNotificationForm(false);
        });
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
            .collection("notifications")
            .doc(id)
            .delete()
            .then(() => {
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
      console.log(id);
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
.form-add-notification {
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
