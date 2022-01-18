<template>
  <div>
    <h2>Lagesensor</h2>
    <status-string
      caption="Azimut"
      :status="
        radToString(vxm.user.storeData.sensorPosition.horizontal.azimuth)
      "
    ></status-string>
    <status-string
      caption="Altitude"
      :status="
        radToString(vxm.user.storeData.sensorPosition.horizontal.altitude)
      "
    ></status-string>
    <h2>GPS</h2>
    <status-number
      caption="Längenengrad"
      :status="vxm.user.storeData.longitude"
    />
    <status-number
      caption="Breitengrad"
      :status="vxm.user.storeData.latitude"
    />

    <v-data-table
      :headers="satHeaders"
      :items="satsVisible"
      :items-per-page="10"
      class="elevation-1"
    ></v-data-table>

    <h2>Raspberry Pi-Sensoren</h2>
    <status-unit
      caption="CPU-Temperatur"
      :status="vxm.user.storeData.systemInformation.cpuTemp"
      unit="°C"
      >y</status-unit
    >
    <h2>Alt/Az-Steuerung</h2>

    <status-string
      caption="Motor Atltiude"
      :status="
        radToString(vxm.user.storeData.actualPosition.horizontal.altitude)
      "
    />
    <status-string
      caption="Motor Azimuth"
      :status="
        radToString(vxm.user.storeData.actualPosition.horizontal.azimuth)
      "
    />
        <status-string
      caption="Motor RA"
      :status="
        radToHourString(vxm.user.storeData.actualPosition.equatorial.rightAscension)
      "
    />
    <status-string
      caption="Motor Decl"
      :status="
        radToString(vxm.user.storeData.actualPosition.equatorial.declination)
      "
    />
    <status-string
      caption="Ziel Atltiude"
      :status="
        radToString(vxm.user.storeData.targetPosition.horizontal.altitude)
      "
    />
    <status-string
      caption="Ziel Azimuth"
      :status="
        radToString(vxm.user.storeData.targetPosition.horizontal.azimuth)
      "
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { vxm } from "../store";
import StatusString from "../components/StatusString.vue";
import StatusNumber from "../components/StatusNumber.vue";
import StatusUnit from "../components/StatusUnit.vue";
import { radToString,radToHourString } from "../plugins/angles";

@Component({
  components: {
    StatusString,
    StatusUnit,
    StatusNumber
  }
})
export default class Position extends Vue {
  get vxm() {
    return vxm;
  }
  get satHeaders() {
    return [
      { text: "PRN-ID", value: "SVPRNNumber" },
      { text: "Satelliten-System", value: "system" },
      { text: "Altitude", value: "Elevation" },
      { text: "Azimut", value: "Azimuth" },
      { text: "Signal-Noise-Ratio", value: "SNR" }
    ];
  }
  get satsVisible() {
    let sats = vxm.user.storeData.gnssData.satsGlonassVisible.map(x => {
      (x as any)["system"] = "GLONASS";
      return x;
    });

    vxm.user.storeData.gnssData.satsGpsVisible.map(x => {
      (x as any)["system"] = "GPS";
      return x;
    }).forEach(sat=>sats.push(sat))

        vxm.user.storeData.gnssData.satsGalileoVisible.map(x => {
      (x as any)["system"] = "Galileo";
      return x;
    }).forEach(sat=>sats.push(sat))

        vxm.user.storeData.gnssData.satsBeidouVisible.map(x => {
      (x as any)["system"] = "Beidou";
      return x;
    }).forEach(sat=>sats.push(sat))

    return sats;
  }
  radToString(rad: number): string {
    return radToString(rad);
  }
    radToHourString(rad: number): string {
    return radToHourString(rad);
  }

}
</script>
