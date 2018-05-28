const Vue = require('vue');
const Vuetify = require('vuetify');
// vue-loader(v14+) supports only es modules export style...
// require('...').default for commonjs style.
const ArmNav = require('../modules/Nav.vue').default;
const UserForm = require('../modules/UserForm.vue').default;

Vue.use(Vuetify);
// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  components: { ArmNav, UserForm },
  data() {
    return {
      logined: !!document.getElementById('currentUser'),
      matchReady: !!document.getElementById('matchReady'),
      inputComplete: !!document.getElementById('inputComplete'),
      activeUserCount:
        (document.getElementById('activeUserCount') || {}).value || '0',
      user: JSON.parse(document.getElementById('userData').value),
    };
  },
});
