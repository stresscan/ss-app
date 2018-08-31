<template>
  <div class="row">
    <div class="col-xl-4 col-lg-5 col-md-6">
      <user-card @fileIsTooBig="onFileUploadingTooBig" @uploading="onUploading" :dataLoaded="userDataLoaded" :uid="uid" :name="name" :surname="surname" :username="username" :phoneNumber="phoneNumber" :email="email" :profilePicture="profilePictureUrl" :coverPicture="coverPictureUrl"></user-card>
    </div>
    <div class="col-xl-8 col-lg-7 col-md-6">
      <edit-profile-form @notifyVue="notifyVue" @userDataIsLoaded="onUserDataIsLoaded"></edit-profile-form>
    </div>
  </div>
</template>
<script>
import EditProfileForm from "./EditProfileForm.vue";
import UserCard from "./UserCard.vue";

export default {
  components: {
    EditProfileForm,
    UserCard
  },
  data() {
    return {
      uid: "",
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
      this.uid = userData.uid;
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
        const editProfileForm = this.$children.find(child => {
          return child.$options.name === "EditProfileForm";
        });

        editProfileForm.getImageUrl(this.uid, data.fileName).then(newImgUrl => {
          if (data.fileName.includes("cover")) {
            this.coverPictureUrl = `${newImgUrl}&v=${Date.now()}`;
          } else {
            this.profilePictureUrl = `${newImgUrl}&v=${Date.now()}`;
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
