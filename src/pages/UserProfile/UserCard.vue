<template>
  <card class="card-user" style="padding-bottom: 20px">
    <div slot="image">
      <img :src="coverPicture">
    </div>
    <div class="author">
      <img class="avatar border-white backgroud-white" :src="profilePicture" alt="">
      <div v-if="dataLoaded">
        <div class="upload-photos-wrapper el-center">
          <upload-image class="input-file" :folder="uid" fileName="profile.jpg" @fileUploaded="onFileUploaded" />
          <div class="btn-upload">alterar foto</div>
          <upload-image class="input-file second" :folder="uid" fileName="cover.jpg" @fileUploaded="onFileUploaded" />
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
    onFileUploaded(data) {
      this.$emit("newFileUploaded", data);
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

input[type="file"].second {
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
</style>
