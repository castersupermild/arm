const Vue = require('vue');
const Vuetify = require('vuetify');
const ArmNav = require('../modules/Nav.vue').default;
const MatchRoom = require('../modules/MatchRoom.vue').default;

Vue.use(Vuetify);

const currentUser = document.getElementById('currentUser');
// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  components: { ArmNav, MatchRoom },
  data() {
    return {
      logined: !!currentUser,
      currentUser: currentUser ? currentUser.value : null,
      matchReady: !!document.getElementById('matchReady'),
      activeUserCount:
        (document.getElementById('activeUserCount') || {}).value || '0',
      noPolling: !!document.getElementById('noPolling'),
      player1: JSON.parse(document.getElementById('player1').value),
      player2: JSON.parse(document.getElementById('player2').value),
    };
  },
});
