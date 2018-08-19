<template>
  <input title="selecioe um arquivo" type="file" multiple accept="image/jpeg" @change="detectFiles($event.target.files)">
</template>
<script>
import firebase from "firebase";

export default {
  props: {
    folder: String,
    fileName: String
  },
  methods: {
    detectFiles(fileList) {
      Array.from(Array(fileList.length).keys()).map(x => {
        console.log("file detected", fileList[x]);
        this.upload(fileList[x]);
      });
    },
    upload(file) {
      firebase
        .storage()
        .ref()
        .child(`${this.folder}/${this.fileName}`)
        .put(file)
        .then(snapshot => {
          this.$emit("fileUploaded", { fileName: this.fileName });
          console.log("file uploaded", snapshot);
        });
    }
  }
};
</script>

<style>
</style>
