<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
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
          v-if="logined"
          href="/match">
          <v-list-tile-action>
            <v-icon color="red">fa-fire</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              Rate Match
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
module.exports = {
  props: ['logined'],
  data() {
    return {
      drawer: null,
    };
  },
  methods: {
    loginOrMypage() {
      window.location.href = this.logined ? '/auth/mypage' : '/auth/twitter';
    },
  },
};
</script>
