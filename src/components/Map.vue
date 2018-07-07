<template>
  <card class="card-map">
    <div class="map">
      <div id="map"></div>
    </div>
  </card>
</template>
<script>
export default {
  props: {
    title: String,
    lat: String,
    lng: String
  },
  mounted() {
    var myLatlng = new window.google.maps.LatLng(this.lat, this.lng);
    var mapOptions = {
      zoom: 13,
      center: myLatlng,
      scrollwheel: true,
      styles: [
        {
          featureType: "water",
          stylers: [{ saturation: 43 }, { lightness: -11 }, { hue: "#0088ff" }]
        },
        {
          featureType: "road",
          elementType: "geometry.fill",
          stylers: [{ hue: "#ff0000" }, { saturation: -100 }, { lightness: 99 }]
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#808080" }, { lightness: 54 }]
        },
        {
          featureType: "landscape.man_made",
          elementType: "geometry.fill",
          stylers: [{ color: "#ece2d9" }]
        },
        {
          featureType: "poi.park",
          elementType: "geometry.fill",
          stylers: [{ color: "#ccdca1" }]
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#767676" }]
        },
        {
          featureType: "road",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#ffffff" }]
        },
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        {
          featureType: "landscape.natural",
          elementType: "geometry.fill",
          stylers: [{ visibility: "on" }, { color: "#b8cb93" }]
        },
        { featureType: "poi.park", stylers: [{ visibility: "on" }] },
        {
          featureType: "poi.sports_complex",
          stylers: [{ visibility: "on" }]
        },
        { featureType: "poi.medical", stylers: [{ visibility: "on" }] },
        {
          featureType: "poi.business",
          stylers: [{ visibility: "simplified" }]
        }
      ]
    };
    var map = new window.google.maps.Map(
      document.getElementById("map"),
      mapOptions
    );

    var marker = new window.google.maps.Marker({
      position: myLatlng,
      title: this.title
    });

    // To add the marker to the map, call setMap();
    marker.setMap(map);
  }
};
</script>
<style>
</style>
