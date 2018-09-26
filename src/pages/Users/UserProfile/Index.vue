<template>
  <div class="row">
    <div class="col-xl-4 col-lg-5 col-md-6">
      <user-card @notifyNetwork="notifyNetwork" @notifyError="notifyError" @notifySuccess="notifySuccess" @uploading="onUploading" :reactive-online-app="reactiveOnlineApp" :dataLoaded="userDataLoaded" :uid="stateUid" :name="name" :surname="surname" :username="username" :phoneNumber="phoneNumber" :email="email" :profilePicture="profilePictureUrl" :coverPicture="coverPictureUrl"></user-card>
    </div>
    <div class="col-xl-8 col-lg-7 col-md-6">
      <edit-profile-form @notifyNetwork="notifyNetwork" @notifySuccess="notifySuccess" @notifyError="notifyError" @userDataIsLoaded="onUserDataIsLoaded" :reactive-online-app="reactiveOnlineApp" :uid="stateUid"></edit-profile-form>
    </div>
  </div>
</template>

<script>
import EditProfileForm from "./EditProfileForm.vue";
import UserCard from "./UserCard.vue";
import basePageMixin from "@/mixins/BasePage.js";
import authPageMixin from "@/mixins/Auth/AuthPage.js";
import userService from "@/services/UsersService.js";
import offlineUserService from "@/services/offline/OfflineUsersService.js";
import { notifyMixin } from "@/mixins/Notify";

export default {
  mixins: [basePageMixin, authPageMixin, notifyMixin],
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
            const versionedImgUrl = `${newImgUrl}&v=${Date.now()}`;
            if (data.fileName.includes("cover")) {
              this.coverPictureUrl = versionedImgUrl;

              offlineUserService.persiste({
                coverPictureUrl: this.coverPictureUrl
              });
            } else {
              this.profilePictureUrl = versionedImgUrl;

              offlineUserService.persiste({
                profilePictureUrl: this.profilePictureUrl
              });
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
