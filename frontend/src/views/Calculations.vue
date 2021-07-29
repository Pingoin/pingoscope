<template>
  <v-form>
    <v-container>
      <v-row>
                <v-col cols="12" md="4">
          <v-text-field
            v-model="F_O"
            label="F Original"
            type="number"
          />
        </v-col>
                <v-col cols="12" md="4">
          <v-text-field
            v-model="F_ok"
            label="F Okular"
            type="number"
          />
        </v-col>
                <v-col cols="12" md="4">
          <v-text-field
            v-model="a"
            label="Fokuslänge Kamera"
            type="number"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="g"
            label="Fokuslänge Okular"
            type="number"
            readonly
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-model="F_eff"
            label="F Efektiv"
            type="number"
            readonly
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { vxm } from "../store";

@Component({
  components: {}
})
export default class Calculations extends Vue {
  get vxm() {
    return vxm;
  }

  F_O=1200;
  F_ok=25;
  a=10;
  get g(){
    return this.F_ok*this.a/(this.a-this.F_ok);
  }

  get F_eff(){

    return this.F_O*(this.a/this.F_ok-1);
  }
}

</script>