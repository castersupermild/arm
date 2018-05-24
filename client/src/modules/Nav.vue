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
        <v-list-tile
          v-if="logined">
          <v-list-tile-action>
            <v-icon>arrow_right</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Active User: {{ activeUser }}</v-list-tile-title>
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
      <v-toolbar-title><a
        href="/"
        class="appTitle">Name TBD...</a></v-toolbar-title>
    </v-toolbar>
  </div>
</template>

<script>
const axios = require('axios');

module.exports = {
  props: ['logined', 'matchReady', 'activeUserCount', 'noPolling'],

  data() {
    return {
      drawer: null,
      matchStatusReady: this.matchReady,
      notFindMatchUser: this.noPolling,
      activeUser: this.activeUserCount,
    };
  },

  mounted() {
    this.findMatchUser();
  },

  watch: {
    async matchStatusReady(newVal) {
      const res = await axios.post(
        '/match/updateMatchStatus',
        { matchStatusReady: newVal },
        {
          headers: {
            'X-XSRF-Token': document.getElementById('csrfToken').value,
          },
        }
      );

      this.activeUser = res.data.activeUserCount;
      if (newVal) {
        this.findMatchUser();
      }
    },
  },

  methods: {
    loginOrMypage() {
      window.location.href = this.logined ? '/auth/mypage' : '/auth/twitter';
    },

    async findMatchUser() {
      if (!this.matchStatusReady || this.notFindMatchUser) {
        return;
      }
      const res = await axios.post(
        '/match/findMatchUser',
        {},
        {
          headers: {
            'X-XSRF-Token': document.getElementById('csrfToken').value,
          },
        }
      );

      if (res.data.existsRoom) {
        window.location.href = '/match/room';
      } else {
        setTimeout(() => this.findMatchUser(), 5000);
      }
    },
  },
};
</script>
