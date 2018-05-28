const Vue = require('vue');
const Vuetify = require('vuetify');
const ArmNav = require('../modules/Nav.vue').default;
const MatchLogs = require('../modules/MatchLogs.vue').default;

Vue.use(Vuetify);

const currentUser = document.getElementById('currentUser');
// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  components: { ArmNav, MatchLogs },
  data() {
    return {
      logined: !!currentUser,
      currentUser: currentUser ? currentUser.value : null,
      matchReady: !!document.getElementById('matchReady'),
      activeUserCount:
        (document.getElementById('activeUserCount') || {}).value || '0',
      inputComplete: !!document.getElementById('inputComplete'),
      logs: JSON.parse(document.getElementById('logs').value),
    };
  },
});
