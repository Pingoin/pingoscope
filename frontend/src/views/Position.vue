<template>
  <div>
    <h2>Kartenansicht</h2>
    <l-map
      ref="myMap"
      v-if="vxm.user.storeData != null"
      :zoom="zoom"
      :center="[
        vxm.user.storeData.latitude || 0,
        vxm.user.storeData.longitude || 0
      ]"
      style="height: 500px; width: 80%"
    >
      <l-tile-layer :url="url" :attribution="attribution" />
      <l-control-scale position="topright" :metric="true"></l-control-scale>
      <v-rotated-marker
        :lat-lng="[vxm.user.storeData.latitude, vxm.user.storeData.longitude]"
        :rotationAngle="vxm.user.storeData.sensorPosition.horizontal.azimuth"
        :icon="icon"
      >
      </v-rotated-marker>
    </l-map>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { vxm } from "../store";
import "leaflet/dist/leaflet.css";
import L, { icon, Icon } from "leaflet";
import {
  LMap,
  LTileLayer,
  LMarker,
  LCircle,
  LPopup,
  LControlScale,
  LRectangle
} from "vue2-leaflet";
const Vue2LeafletRotatedMarker: any = require("vue2-leaflet-rotatedmarker");

@Component({
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LCircle,
    LControlScale,
    LRectangle,
    "v-rotated-marker": Vue2LeafletRotatedMarker
  }
})
export default class Position extends Vue {
  get vxm() {
    return vxm;
  }
  url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  zoom = 7;
  icon = icon({
    iconUrl: "aircraft.svg",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
  attribution =
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
}
</script>
