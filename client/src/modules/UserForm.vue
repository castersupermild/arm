<template>
  <div>
    <v-avatar
      slot="activator"
      size="36px"
    >
      <img
        :src="user.image"
        :alt="user.twitterName"
      >
    </v-avatar> {{ user.armsName }}

    <v-form
      ref="form"
      v-model="valid"
      lazy-validation>
      <v-text-field
        v-model="user.rating"
        label="Rating"
        disabled
      />
      <v-text-field
        v-model="user.armsName"
        :rules="[v => !!v || 'ARMS Name is required']"
        label="ARMS Name"
        required
      />
      <v-text-field
        v-model="user.friendCode"
        :rules="friendCodeRules"
        label="Switch Friend Code"
        required
      />
      <v-select
        :items="connectionTypes"
        v-model="user.connectionType"
        label="Connection Type(LAN or Wifi)"
      />

      <v-spacer/>
      <p>Match Condition</p>

      <v-select
        :items="matchConditionConnections"
        v-model="user.matchConditionConnection"
        label="Opponent Connection"
      />
      <v-select
        :items="matchConditionRatings"
        v-model="user.matchConditionRating"
        label="Opponent Rate"
      />
      <v-checkbox
        v-model="user.publicTwitterUsername"
        label="Twitter Visibility Level Public"
      />

      <v-spacer/>

      <v-btn
        :disabled="!valid"
        :loading="updateButtonLoading"
        color="primary"
        round
        @click="updateUser">update</v-btn>

      <v-snackbar
        :timeout="timeout"
        :color="color"
        :multi-line="mode === 'multi-line'"
        :vertical="mode === 'vertical'"
        v-model="snackbar"
      >
        {{ text }}
        <v-btn
          dark
          flat
          @click.native="snackbar = false">Close</v-btn>
      </v-snackbar>
    </v-form>
  </div>
</template>

<script>
const axios = require('axios');

module.exports = {
  props: {
    user: { type: Object, required: true },
  },

  data() {
    return {
      valid: true,
      friendCodeRules: [
        v => !!v || 'Friend Code is required',
        v =>
          !!v.match(/^SW(-[0-9]{4}){3}$/) ||
          'Friend Code format(SW-1234-5678-9012) is invalid',
      ],
      connectionTypes: [
        {
          text: 'LAN',
          value: 1,
        },
        {
          text: 'Wifi',
          value: 2,
        },
      ],
      matchConditionRatings: [
        {
          text: 'unlimited',
          value: 1,
        },
        {
          text: 'within 100',
          value: 2,
        },
        {
          text: 'within 200',
          value: 3,
        },
      ],
      snackbar: false,
      color: '',
      mode: '',
      timeout: 3000,
      text: '',
      updateButtonLoading: false,
    };
  },

  computed: {
    matchConditionConnections() {
      const data = [
        {
          text: 'Wifi Ok',
          value: 2,
        },
        {
          text: 'LAN Only',
          value: 1,
        },
      ];
      if (this.user.connectionType === 2) {
        data.pop();
        this.user.matchConditionConnection = 2;
      }
      return data;
    },
  },

  methods: {
    updateUser() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.updateButtonLoading = true;
      axios
        .post('/auth/mypage/update', this.user, {
          headers: {
            'X-XSRF-Token': document.getElementById('csrfToken').value,
          },
        })
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
