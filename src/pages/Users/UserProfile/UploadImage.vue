<template>
  <div class="upload-img-container">
    <div class="modal-overlay"></div>
    <input ref="inputFile" title="selecioe um arquivo" type="file" accept="image/jpeg" @change="detectFiles($event.target.files)">

    <modal v-if="readyToCrop" @close="showModal = false">
      <div slot="left-content">
        <vueCropper slot="body" ref="cropper" :img="cropOptions.img" :info="cropOptions.info" :size="cropOptions.size" :outputType="cropOptions.outputType" :canScale="cropOptions.canScale" :autoCrop="cropOptions.autoCrop" :autoCropWidth="cropOptions.autoCropWidth" :autoCropHeight="cropOptions.autoCropHeight" :fixed="cropOptions.fixed" :fixedNumber="cropOptions.fixedNumber" :canMove="cropOptions.canMove"></vueCropper>
      </div>
      <div slot="right-content">
        <p-button class="btn-finish-crop" type="info" round @click.native.prevent="finishCrop">Recortar</p-button>
      </div>
    </modal>
  </div>
</template>
<script>
import firebase from "firebase";
import VueCropper from "vue-cropper";
import Modal from "@/components/Modal";
import { isOnlineCheck } from "@/services/offline/isOnlineCheckService.js";
import { emitNotifyMixin } from "@/mixins/Notify";

export default {
  mixins: [emitNotifyMixin],
  components: {
    VueCropper,
    Modal
  },
  data() {
    return {
      showModal: false,
      readyToCrop: false,
      cropOptions: {
        img: "http://ofyaji162.bkt.clouddn.com/bg1.jpg",
        info: true,
        size: 1,
        outputType: "jpeg",
        canScale: false,
        autoCrop: true,
        autoCropWidth: 300,
        fixed: true,
        fixedNumber: this.format,
        canMove: false
      }
    };
  },
  props: {
    uid: String,
    folder: String,
    fileName: String,
    format: Array
  },
  methods: {
    detectFiles(fileList) {
      if (fileList[0].size > 5e6) {
        this.emitNotify({
          type: "Error",
          msg: `Arquivo muito pesado. Por favor selecione uma imagem com no máximo 5mb`
        });
      } else {
        const reader = new FileReader();

        reader.onloadend = () => {
          this.cropOptions.img = reader.result;
          this.readyToCrop = true;
        };

        reader.readAsDataURL(fileList[0]);
      }

      this.$refs.inputFile.value = "";
    },
    finishCrop() {
      this.$refs.cropper.getCropBlob(data => {
        this.readyToCrop = false;
        this.upload(data);
      });
    },
    async upload(file) {
      const isOnline = await isOnlineCheck();

      if (isOnline) {
        console.log("uploading", `${this.folder}/${this.fileName}`);
        this.$emit("uploading", { uploading: true, fileName: this.fileName });

        const stRef = firebase
          .storage()
          .ref()
          .child(`${this.folder}/${this.fileName}`);

        stRef
          .put(file)
          .then(snapshot => {
            this.$emit("uploading", {
              uploading: false,
              fileName: this.fileName
            });

            this.emitNotify({
              type: "Success",
              msg: "Imagem eviada com sucesso"
            });

            snapshot.ref
              .updateMetadata({
                cacheControl: "public,max-age=300"
              })
              .catch(error => {
                console.error("Error trying to update image metadata", error);

                logService.logError(
                  new Date().getTime(),
                  `Erro ao tentar atualizar o metadata da imagem ${
                    this.folder
                  }/${this.fileName}: ${e.message}`,
                  "updateMetadata",
                  "UpdateImage.vue",
                  this.uid
                );
              });
          })
          .catch(e => {
            this.emitNotify({
              type: "Error",
              msg: `Ocorreu um erro ao tentar enviar a imagem. Por favor tente novamente`
            });

            console.error("Error trying to upload image", error);

            logService.logError(
              new Date().getTime(),
              `Erro ao tentar fazer upload da imagem ${this.folder}/${
                this.fileName
              }: ${e.message}`,
              "upload",
              "UpdateImage.vue",
              this.uid
            );
          });
      } else {
        this.emitNotify({
          type: "Network",
          msg: `O aplicativo está offline. Não é possível fazer upload de fotos`
        });
      }
    }
  }
};
</script>

<style>
.vue-cropper {
  height: 300px !important;
  margin: 21px auto;
  width: 300px !important;
}

.btn-finish-crop {
  margin-bottom: 21px;
}
</style>
