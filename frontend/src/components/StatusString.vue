<template>
  <v-container v-if="status">
    <h4>{{ caption }}:</h4>
    {{ status }}
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class StatusString extends Vue {
  @Prop() private status!: string;
  @Prop() private caption!: string;
}
</script>