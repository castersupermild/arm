<template>
  <v-container grid-list-xl>
    <v-layout v-bind="binding">
      <v-flex>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">12345: {{ player1.armsName }}</h3>
            </div>
          </v-card-title>
          <v-card-text>one</v-card-text>
        </v-card>
      </v-flex>
      <v-flex md1>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">vs</h3>
          </div>
        </v-card-title>
      </v-flex>
      <v-flex>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">23456: {{ player2.armsName || 'waiting...' }}</h3>
            </div>
          </v-card-title>
          <v-card-text>three</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <div>
      <v-btn
        round
        color="primary"
        small>1P Win</v-btn>
      <v-btn
        round
        color="info"
        small>2P Win</v-btn>
      <v-btn
        round
        color="warning"
        small>Draw</v-btn>
      <v-btn
        round
        color="error"
        small>Invalid Match</v-btn>
    </div>
  </v-container>
</template>

<script>
const axios = require('axios');

module.exports = {
  props: {
    currentUser: { type: String },
    player1: { type: Object, required: true },
    player2: { type: Object, required: true },
  },

  data() {
    return {};
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

  methods: {
    updateUser() {
      this.updateButtonLoading = true;
      axios
        .post('/auth/mypage/update', this.user)
        .then(() => {
          this.text = 'Data has been successfully updated';
          this.color = 'success';
          this.snackbar = true;
          this.updateButtonLoading = false;
        })
        .catch(() => {
          this.text = 'Data update failed';
          this.color = 'error';
          this.snackbar = true;
          this.updateButtonLoading = false;
        });
    },
  },
};
</script>
