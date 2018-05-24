const Vue = require('vue');
const Vuetify = require('vuetify');
// vue-loader(v14+) supports only es modules export style...
// require('...').default for commonjs style.
const ArmNav = require('../modules/Nav.vue').default;

Vue.use(Vuetify);
// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  components: { ArmNav },
  data() {
    return {
      logined: !!document.getElementById('currentUser'),
      matchReady: !!document.getElementById('matchReady'),
      activeUserCount:
        (document.getElementById('activeUserCount') || {}).value || '0',
    };
  },
});
