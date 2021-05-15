<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>The hunter Helper</v-toolbar-title>

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
              ><router-link to="/maps" exact exact-active-class="active"
                >Maps</router-link
              ></v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <v-list-item-title
              ><router-link to="/overview" exact exact-active-class="active"
                >Übersicht</router-link
              ></v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <v-list-item-title
              ><router-link to="/callers" exact exact-active-class="active"
                >Rufer</router-link
              ></v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <v-list-item-title
              ><router-link to="/animals" exact exact-active-class="active"
                >Tiere</router-link
              ></v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <v-list-item-title
              ><router-link to="/calibers" exact exact-active-class="active"
                >Munition</router-link
              ></v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <v-list-item-title
              ><a href="/api/animals" target="_blank"
                >API Tiere</a
              ></v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <v-list-item-title
              ><a href="/api/callers" target="_blank"
                >API Rufer</a
              ></v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <v-list-item-title
              ><a href="/api/calibers" target="_blank"
                >API Munition</a
              ></v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <v-list-item-title
              ><a href="/api/maps" target="_blank"
                >API Karten</a
              ></v-list-item-title
            >
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
@Component({})
export default class App extends Vue {
  drawer = false;
  group: any = null;
  loadData() {
    this.$store.dispatch("fetchData");
  }

  @Watch("myWatchedProperty")
  onGroup() {
    this.drawer = false;
  }
  created() {
    this.loadData();
  }
}
</script>
