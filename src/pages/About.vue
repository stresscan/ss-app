<template>
  <div class="row">
    <div class="col-12">
      <card :title="table1.title" :subTitle="table1.subTitle">
        <div slot="raw-content" style="padding: 20px;">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras tempus at nulla feugiat auctor. Proin id maximus nunc. Praesent interdum quam nec metus mollis, at molestie urna condimentum. Nam nec bibendum ex. Sed eu tortor augue. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nunc id sem non leo ultricies laoreet. Sed eu sapien ut lacus condimentum convallis. Aenean in lectus a dui fringilla luctus ac vitae nibh. Pellentesque pulvinar lacus vitae enim blandit, in dignissim neque cursus. Nulla finibus imperdiet est quis fermentum. Aenean consectetur non felis iaculis viverra. Maecenas pulvinar, orci et rutrum mattis, massa leo sollicitudin ante, eu molestie ipsum justo eu dolor. In hac habitasse platea dictumst. Aenean quis finibus ipsum, nec dignissim urna. Vivamus vitae varius justo, ac luctus eros.</p>
          <p>Vestibulum iaculis accumsan dignissim. Nulla facilisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer euismod venenatis mi. Proin porttitor mollis mi nec ornare. Praesent arcu risus, consectetur nec magna aliquet, cursus ornare enim. Nulla porta metus ut dignissim lobortis. Etiam nunc metus, dapibus in est sed, tempor varius tellus.</p>
        </div>
      </card>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      table1: {
        title: "Sobre a Stress Scan",
        subTitle: "Algum Subtitulo"
      }
    };
  }
};
</script>
<style>
</style>
