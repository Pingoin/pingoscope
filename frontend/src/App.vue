<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Pingoscope</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-filter</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" absolute bottom temporary>
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item>
            <v-list-item-title
              ><router-link to="/" exact exact-active-class="active"
                >Home</router-link
              ></v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <v-list-item-title
              ><router-link to="position" exact exact-active-class="active"
                >Position</router-link
              ></v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <v-list-item-title
              ><router-link to="sensors" exact exact-active-class="active"
                >Sensoren</router-link
              ></v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <v-list-item-title
              ><router-link to="control" exact exact-active-class="active"
                >Steuerung</router-link
              ></v-list-item-title
            >
          </v-list-item>
                    <v-list-item>
            <v-list-item-title
              ><router-link to="calc" exact exact-active-class="active"
                >Berechnungen</router-link
              ></v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <v-list-item-title
              ><a href="/api/test" target="_blank">API Test</a>
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title
              ><a href="/api/store" target="_blank">API Store</a>
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { vxm } from "./store";
@Component({})
export default class App extends Vue {
  get vxm() {
    return vxm;
  }

  drawer = false;
  group: any = null;
  loadData() {
    vxm.user.fetchData();
  }

  @Watch("myWatchedProperty")
  onGroup() {
    this.drawer = false;
  }
  created() {
    vxm.user.initWS();
    setInterval(vxm.user.fetchData, 1000);
  }
}
</script>
