<template>
  <v-container v-if="isValid">
    <h4>{{ caption }}:</h4>
    {{ Math.round(status*100)/100 }} {{unit}}
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class StatusUnit extends Vue {
  @Prop() private status!: number;
  @Prop() private caption!: string;
  @Prop() private unit!: string;
  get isValid(){
    return !(isNaN(this.status)||this.status==null);
  }
}
</script>