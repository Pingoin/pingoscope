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
    return vxm.user.targetType=="equatorial";
}
left(){
  alert("left");
}
right(){
  alert("right");
}
up(){
  alert("up");
}
down(){
  alert("down");
}
toggleAxis(){
  vxm.user.setTargetType(this.followAxis?"horizontal":"equatorial");
}
}
</script>
