<template>
  <card class="card-user" style="padding-bottom: 20px">
    <div slot="image">
      <img src="http://www.assetquest.com/wp-content/uploads/2016/04/Land.jpeg" alt="...">
    </div>
    <div class="author">
      <img class="avatar border-white" src="@/assets/img/faces/face-1.jpg" alt="...">
      <h4 class="title">Rodrigo Fake
        <br>
        <a href="#">
          <small>@digofake</small>
        </a>
      </h4>
      <div>18 99057-8876</div>
      <div>rfake@ssalfa.com.br</div>
    </div>
  </card>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    getClasses(index) {
      var remainder = index % 3;
      if (remainder === 0) {
        return "col-lg-3 offset-lg-1";
      } else if (remainder === 2) {
        return "col-lg-4";
      } else {
        return "col-lg-3";
      }
    }
  }
};
</script>
<style>
</style>
