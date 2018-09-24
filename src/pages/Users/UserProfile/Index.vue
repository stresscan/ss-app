<template>
  <div class="row">
    <div class="col-xl-4 col-lg-5 col-md-6">
      <user-card @fileIsTooBig="onFileUploadingTooBig" @uploading="onUploading" :dataLoaded="userDataLoaded" :uid="stateUid" :name="name" :surname="surname" :username="username" :phoneNumber="phoneNumber" :email="email" :profilePicture="profilePictureUrl" :coverPicture="coverPictureUrl"></user-card>
    </div>
    <div class="col-xl-8 col-lg-7 col-md-6">
      <edit-profile-form :uid="stateUid" @notifyVue="notifyVue" @userDataIsLoaded="onUserDataIsLoaded"></edit-profile-form>
    </div>
  </div>
</template>
<script>
import EditProfileForm from "./EditProfileForm.vue";
import UserCard from "./UserCard.vue";
import basePage from "@/mixins/BasePage.js";
import authPage from "@/mixins/Auth/AuthenticatedPage.js";
import userService from "@/services/UsersService.js";

export default {
  mixins: [basePage, authPage],
  components: {
    EditProfileForm,
    UserCard
  },
  data() {
    return {
      name: "",
      surname: "",
      username: "",
      phoneNumber: "",
      email: "",
      profilePictureUrl: "",
      coverPictureUrl: "",
      userDataLoaded: false
    };
  },
  methods: {
    onUserDataIsLoaded(userData) {
      this.name = userData.name;
      this.surname = userData.surname;
      this.username = userData.username;
      this.phoneNumber = userData.phoneNumber;
      this.email = userData.email;
      this.profilePictureUrl = userData.profilePictureUrl;
      this.coverPictureUrl = userData.coverPictureUrl;

      this.userDataLoaded = true;
    },
    onFileUploadingTooBig(data) {
      this.notifyVue({
        verticalAlign: "bottom",
        horizontalAlign: "right",
        type: "danger",
        message:
          "Arquivo muito pesado. Por favor selecione uma imagem com no máximo 5mb",
        icon: "ti-thumb-down"
      });
    },
    onUploading(data) {
      if (data.uploading) {
        if (data.fileName.includes("cover")) {
          this.coverPictureUrl = "";
        } else {
          this.profilePictureUrl = "";
        }
      } else {
        userService
          .getImageUrl(this.stateUid, data.fileName)
          .then(newImgUrl => {
            console.log({ newImgUrl });
            const versionedImgUrl = `${newImgUrl}&v=${Date.now()}`;

            if (data.fileName.includes("cover")) {
              this.coverPictureUrl = versionedImgUrl;
            } else {
              this.profilePictureUrl = versionedImgUrl;
            }
          });
      }
    },
    notifyVue(data) {
      this.$notify({
        message: data.message,
        icon: data.icon,
        horizontalAlign: data.horizontalAlign,
        verticalAlign: data.verticalAlign,
        type: data.type
      });
    }
  }
};
</script>
<style>
</style>
