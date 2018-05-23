<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      witdh="350"
      fixed
      app
    >
      <v-list dense>
        <v-list-tile @click="loginOrMypage()">
          <v-list-tile-action>
            <v-icon>account_box</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-if="logined">MyPage</v-list-tile-title>
            <v-list-tile-title v-else>Sign in with Twitter</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          v-if="logined">
          <v-list-tile-action>
            <v-icon color="red">fa-fire</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="rateMatchButton">
              <v-switch
                v-model="matchStatusReady"
                label="Rate Match"
              />
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="/ranking">
          <v-list-tile-action>
            <v-icon>format_list_numbered</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Ranking</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="/rule">
          <v-list-tile-action>
            <v-icon>notification_important</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Rules</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      fixed
      app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"/>
      <v-toolbar-title href="/">Application</v-toolbar-title>
    </v-toolbar>
  </div>
</template>

<script>
const axios = require('axios');

module.exports = {
  props: ['logined', 'matchReady'],

  data() {
    return {
      drawer: null,
      matchStatusReady: this.matchReady,
      noPolling: false,
    };
  },

  watch: {
    matchStatusReady(newVal) {
      axios
        .post(
          '/match/updateMatchStatus',
          { matchStatusReady: newVal },
          {
            headers: {
              'X-XSRF-Token': document.getElementById('csrfToken').value,
            },
          }
        )
        .then(() => {
          // TODO: polling start
        });
    },
  },

  methods: {
    loginOrMypage() {
      window.location.href = this.logined ? '/auth/mypage' : '/auth/twitter';
    },

    startFindMatchUser() {},

    findMatchUser() {
      //
    },
  },
};
</script>
