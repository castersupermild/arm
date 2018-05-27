<template>
  <v-container grid-list-xl>
    <v-layout v-bind="binding">
      <v-flex>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">Player1: {{ player1.armsName }}</h3>
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
              <h3 class="headline mb-0">Player2: {{ player2.armsName }}</h3>
            </div>
          </v-card-title>
          <v-card-text>three</v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <div v-show="showButton">
      <v-btn
        round
        color="primary"
        small>Win</v-btn>
      <v-btn
        round
        color="error"
        small>Lose</v-btn>
      <v-btn
        round
        color="warning"
        small>Leave</v-btn>
    </div>
  </v-container>
</template>

<script>
const axios = require('axios');

module.exports = {
  props: {
    room: { type: Object },
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

    showButton() {
      return (
        this.currentUser === this.room.userId1 ||
        this.currentUser === this.room.userId2
      );
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
