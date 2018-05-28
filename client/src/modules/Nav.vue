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
            <v-icon :color="matchIconColor">fa-fire</v-icon>
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
            <v-list-tile-title>Rate Match Waiting Users: {{ activeUser }}</v-list-tile-title>
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

  computed: {
    matchIconColor() {
      return this.matchStatusReady ? 'red' : '';
    },
  },

  mounted() {
    // this.findMatchUser();
  },

  watch: {
    async matchStatusReady(newVal) {
      try {
        const res = await this.updateMatchStatus(newVal);
        if (res.data.roomId) {
          window.location.href = `/match/room?roomId=${res.data.roomId}`;
        } else {
          this.activeUser = res.data.activeUserCount;
          if (newVal) {
            this.findMatchUser();
          }
        }
      } catch (e) {
        window.location.href = '/';
      }
    },
  },

  methods: {
    loginOrMypage() {
      window.location.href = this.logined ? '/auth/mypage' : '/auth/twitter';
    },

    updateMatchStatus(value) {
      return axios.post(
        '/match/updateMatchStatus',
        { matchStatusReady: value },
        {
          headers: {
            'X-XSRF-Token': document.getElementById('csrfToken').value,
          },
        }
      );
    },

    async findMatchUser() {
      if (!this.matchStatusReady) {
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
        window.location.href = `/match/room?roomId=${res.data.roomId}`;
      } else {
        setTimeout(() => this.findMatchUser(), 5000);
      }
    },
  },
};
</script>
