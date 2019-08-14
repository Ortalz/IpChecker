<template>
  <v-container grid-list-md text-xs-center fill-height>
    <v-layout row wrap>
      <v-flex xs1 class="mr-5">
        <div class="px-0 title">IP:</div>
        {{ip}}
      </v-flex>
      <v-flex xs1 class="mr-5">
        <v-btn color="info mr-5" @click="checkIp()">Check IP</v-btn>
      </v-flex>
      <v-flex xs6 v-if="response">
        <v-card dark :color="responseColor">
          <v-card-text class="px-0">
            Virus Check Result:
            {{response}}
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "LineInfo",
  props: ["item"],
  data: function() {
    return {
      ip: this.item,
      response: null,
      isCleanUrl: "green darken-2"
    };
  },
  computed: {
    responseColor() {
      switch(this.isCleanUrl) {
        case "green":
          return "green darken-2";
        case "red": 
          return "red darken-3";
        case "orange":
          return "orange darken-3"
        default: 
          return "red"
      }
    }
  },
  methods: {
    checkIp: async function() {
      const rawResponse = await fetch("http://localhost:5000/checkip", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ip: this.ip })
      }).catch(error => {
        /* eslint-disable no-console */
        console.log(error);
      });
      const content = await rawResponse.json();
      if (content.response_code && content.response_code === 1) {
        this.response = 
        `Country: ${content.country}, 
        Total Malicious URLS: ${content.detected_urls ? content.detected_urls.length : "Not Available"}, 
        Clean URLS: ${content.undetected_urls ? content.undetected_urls.length: "Not Available"
        }`;
        this.isCleanUrl = content.detected_urls.length == 0 ? "green" : "red";
      } else {
        this.response = `Failed with code: ${content.response_code}, Reason: ${content.verbose_msg}`;
        this.isCleanUrl = "orange";
      }
    }
  }
};
</script>
