<template>
  <v-app>
    <v-toolbar app color="blue-grey darken-3" dark>
      <v-toolbar-side-icon>
        <v-img
          src="https://www.ntooitive.com/wp-content/uploads/2017/11/if__IP_Address_1134556.png"
        />
      </v-toolbar-side-icon>
      <v-toolbar-title class="headline">
        <span>IP Checker</span>
      </v-toolbar-title>
    </v-toolbar>
    <v-content>
      <AppContainer/>
    </v-content>
  </v-app>
</template>

<script>
import AppContainer from "./components/AppContainer";

export default {
  name: "App",
  components: {
    AppContainer
  },
  data() {
    return {
      //
    };
  }
};
</script>
