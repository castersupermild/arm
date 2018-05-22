const Vue = require('vue');
const Vuetify = require('vuetify');
const ArmNav = require('../modules/Nav.vue').default;

Vue.use(Vuetify);
// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  components: { ArmNav },
  data() {
    return {
      logined: !!document.getElementById('logined'),
      player1: {
        name: 'abc',
      },
      player2: {},
    };
  },

  computed: {
    binding() {
      const binding = {};
      if (this.$vuetify.breakpoint.mdAndUp) {
        binding.column = false;
      } else {
        binding.column = true;
      }
      return binding;
    },
  },
});
