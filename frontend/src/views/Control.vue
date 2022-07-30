<template>
  <div>
    <table>
      <tr>
        <td></td>
        <td><v-icon x-large @click="up">mdi-arrow-up-bold-box-outline</v-icon></td>
        <td></td>
      </tr>
      <tr>
        <td><v-icon x-large @click="left">mdi-arrow-left-bold-box-outline</v-icon></td>
        <td><v-icon x-large @click="toggleAxis">mdi-axis-arrow{{followAxis?"-lock":""}}</v-icon></td>
        <td><v-icon x-large @click="right">mdi-arrow-right-bold-box-outline</v-icon></td>
      </tr>
      <tr>
        <td></td>
        <td><v-icon x-large @click="down">mdi-arrow-down-bold-box-outline</v-icon></td>
        <td></td>
      </tr>
    </table>
    <img v-bind:src="'data:image/jpg;base64,'+ vxm.user.image" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { vxm } from "../store";

@Component({
  components: {}
})
export default class Position extends Vue {
  get vxm() {
    return vxm;
  }
get followAxis(){
    return false;
}
left(){
  vxm.user.moveStep({dir:"left"})
}
right(){
 vxm.user.moveStep({dir:"right"})
}
up(){
  vxm.user.moveStep({dir:"up"})
}
down(){
 vxm.user.moveStep({dir:"down"})
}
toggleAxis(){
  vxm.user.setTargetType(this.followAxis?"horizontal":"equatorial");
}
}
</script>
