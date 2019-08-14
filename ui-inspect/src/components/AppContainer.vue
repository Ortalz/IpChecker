<template>
  <v-flex xs12>
    <div v-for="(item,index) in listOfIps" :key="index">
      <LineInfo v-bind:item="item"/>
      <v-divider></v-divider>
    </div>
  </v-flex>
</template>

<script>
import LineInfo from "./LineInfo";
export default {
  name: "AppContainer",
  components: { LineInfo },
  props: {
    msg: String
  },
  data: function() {
    return {
      listOfIps: []
    };
  },
  async created() {
    await this.fetchIpsList();
  },
  methods: {
    fetchIpsList: async function() {
      const res = await fetch("http://localhost:5000/iplist");
      var data = await res.json();
      this.listOfIps = data;
    }
  }
};
</script>

