<template>
  <card class="card" :title="title">
    <div>
      <ul class="list-unstyled team-members">
        <li>
          <div class="row" style="margin-bottom: 5px" v-for="member in members" :key="member.name">
            <div class="col-3">
              <div class="avatar">
                <img :src="member.image" :alt="member.name" class="img-fluid">
              </div>
            </div>
            <div class="col-4">
              {{member.name}}
              <br>
              <span :class="getStatusClass(member.status)">
                <small>{{member.status}}</small>
              </span>
            </div>

            <div class="col-4">
              <div class="row">
                <div class="col-6">
                  <p-button title="Enviar mensagem" type="success" outline icon>
                    <i class="fa fa-envelope"></i>
                  </p-button>
                </div>
                <div class="col-6">
                  <p-button title="Abrir chat" type="success" outline icon>
                    <i class="fa fa-comment"></i>
                  </p-button>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </card>
</template>
<script>
export default {
  data() {
    return {
      title: "Membros do Time",
      members: [
        {
          image: require("@/assets/img/faces/face-0.jpg"),
          name: "Fulano",
          status: "Offline"
        },
        {
          image: require("@/assets/img/faces/face-2.jpg"),
          name: "Ciclano",
          status: "Online"
        },
        {
          image: require("@/assets/img/faces/face-3.jpg"),
          name: "Beltrano",
          status: "Ocupado"
        }
      ]
    };
  },
  methods: {
    getStatusClass(status) {
      switch (status) {
        case "Offline":
          return "text-muted";
        case "Online":
          return "text-success";
        case "Ocupado":
          return "text-warning";
        default:
          return "text-success";
      }
    }
  }
};
</script>
<style>
</style>
