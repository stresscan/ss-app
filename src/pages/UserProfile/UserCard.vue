<template>
  <card class="card-user" style="padding-bottom: 20px">
    <div slot="image" class="cover-pic-wrapper">
      <img v-if="coverPicture" :src="coverPicture">
      <div v-else class="ss-inline-spinner el-center mg-tp-lg"></div>
    </div>
    <div class="author">
      <div slot="image" class="profile-pic-wrapper" :class="{'profile-pic-wrapper-loading': !profilePicture}">
        <img v-if="profilePicture" class="avatar border-white background-white" :src="profilePicture" alt="">
        <div v-else class="ss-inline-spinner el-center mg-tp-md"></div>
      </div>
      <div v-if="dataLoaded">
        <div class="upload-photos-wrapper el-center">
          <upload-image @uploading="onFileUploading" @fileIsTooBig="onFileIsTooBig" class="input-file" :folder="uid" fileName="profile.jpg" :format="[3, 3]" />
          <div class="btn-upload">alterar foto</div>
          <upload-image @uploading="onFileUploading" @fileIsTooBig="onFileIsTooBig" class="input-file second" :folder="uid" fileName="cover.jpg" :format="[6, 3]" />
          <div class="btn-upload second">alterar capa</div>
        </div>
        <h4 class="title">{{ name }} {{ surname }}
          <br>
          <small>@{{ username }}</small>
        </h4>
        <div>{{ phoneNumber }}</div>
        <div>{{ email }}</div>
      </div>
      <div v-else class="ss-inline-spinner el-center mg-bt-md"></div>
    </div>
  </card>
</template>
<script>
import UploadImage from "./UploadImage.vue";

export default {
  components: {
    UploadImage
  },
  props: {
    uid: String,
    name: String,
    surname: String,
    username: String,
    phoneNumber: String,
    email: String,
    dataLoaded: Boolean,
    profilePicture: String,
    coverPicture: String
  },
  methods: {
    onFileIsTooBig(data) {
      this.$emit("fileIsTooBig", data);
    },
    onFileUploading(data) {
      this.$emit("uploading", data);
    }
  }
};
</script>
<style>
.upload-photos-wrapper {
  width: 210px;
  height: 35px;
}

input[type="file"] {
  display: block;
  width: 100px;
  position: absolute;
  opacity: 0;
  z-index: 1;
}

.second input[type="file"] {
  margin-left: 100px;
}

.btn-upload {
  border: solid 1px black;
  width: 100px;
  position: absolute;
  color: white;
  background-color: rgba(0, 0, 0, 0.9);
  padding: 5px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: bold;
}

.btn-upload.second {
  margin-left: 110px;
}

.cover-pic-wrapper {
  height: 200px;
}

.profile-pic-wrapper {
  width: auto;
  height: 100px;
  margin-bottom: 10px;
}

.profile-pic-wrapper-loading {
  height: 100px;
  width: 100px;
  margin: 0 auto;
  margin-bottom: 10px;
  border: solid 6px white;
  border-radius: 12px;
  z-index: 3;
  position: relative;
  background: #f8f8f8;
}
</style>
