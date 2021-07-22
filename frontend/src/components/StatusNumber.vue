<template>
  <v-container v-if="isValid">
    <h4>{{ caption }}:</h4>
    {{ status }}
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class StatusNumber extends Vue {
  @Prop() private status!: number;
  @Prop() private caption!: string;
    get isValid(){
    return !(isNaN(this.status)||this.status==null);
  }
}
</script>