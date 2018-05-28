<template>
  <v-container grid-list-xl>
    <v-layout v-bind="binding">
      <v-flex>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">Player1:
                <v-avatar
                  slot="activator"
                  size="36px"
                >
                  <img
                    :src="player1.image"
                    :alt="player1.twitterName"
                  >
              </v-avatar>{{ player1.armsName }}</h3>
              <div>{{ player1.friendCode }}</div>
              <div v-if="room.player1Rating">Rating: {{ room.player1Rating }}</div>
              <div v-show="player1.publicTwitterUsername"><a
                :href="'https://twitter.com/'+player1.username"
                target="_blank">@{{ player1.username }}</a></div>
            </div>
          </v-card-title>
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
              <h3 class="headline mb-0">Player2:
                <v-avatar
                  slot="activator"
                  size="36px"
                >
                  <img
                    :src="player2.image"
                    :alt="player2.twitterName"
                  >
              </v-avatar>{{ player2.armsName }}</h3>
              <div>{{ player2.friendCode }}</div>
              <div v-if="room.player2Rating">Rating: {{ room.player2Rating }}</div>
              <div v-show="player2.publicTwitterUsername"><a
                :href="'https://twitter.com/'+player2.username"
                target="_blank">@{{ player2.username }}</a></div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
    <div v-if="!existsMatchResult">
      passcode: {{ room.passcode }}
    </div>
    <br>
    <div v-if="showButton">
      <v-btn
        :loading="updateButtonLoading"
        round
        color="primary"
        small
        @click="updateResult('win')">Win</v-btn>
      <v-btn
        :loading="updateButtonLoading"
        round
        color="error"
        small
        @click="updateResult('lose')">Lose</v-btn>
      <v-btn
        :loading="updateButtonLoading"
        round
        color="warning"
        small
        @click="updateResult('leave')">Leave</v-btn>
    </div>


    <div v-if="existsMatchResult">
      <h4>Result</h4>
      <div v-if="validMatchResult">
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">Winner:
                <v-avatar
                  slot="activator"
                  size="36px"
                >
                  <img
                    :src="winner.image"
                    :alt="winner.twitterName"
                  >
              </v-avatar>{{ winner.armsName }}</h3>
              <div>Rating: <span style="color:blue;">{{ winnerRating }}({{ winnerChangeRating }}<v-icon
                color="blue"
                small>arrow_upward</v-icon>)</span></div>
              <br>

              <h3 class="headline mb-0">Loser:
                <v-avatar
                  slot="activator"
                  size="36px"
                >
                  <img
                    :src="loser.image"
                    :alt="loser.twitterName"
                  >
              </v-avatar>{{ loser.armsName }}</h3>
              <div>Rating: <span style="color:red;">{{ loserRating }}({{ loserChangeRating }}<v-icon
                color="red"
                small>arrow_downward</v-icon>)</span></div>
            </div>
          </v-card-title>
        </v-card>
      </div>
      <div v-else-if="invalidMatchResultMessage">
        {{ invalidMatchResultMessage }}
      </div>
    </div>
    <div v-else-if="playerHasLeft">
      <h4>Result</h4>
      <div>
        {{ playerLeftMessage }}
      </div>
    </div>

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
  </v-container>
</template>

<script>
const axios = require('axios');

module.exports = {
  props: {
    roomInfo: { type: Object },
    currentUser: { type: String },
    player1: { type: Object, required: true },
    player2: { type: Object, required: true },
  },

  mounted() {
    if (!this.existsMatchResult && (this.isPlayer1() || this.isPlayer2())) {
      this.waitingResult = true;
      this.getLatestRoomInfo();
    }
  },

  data() {
    return {
      room: this.roomInfo,
      snackbar: false,
      color: '',
      mode: '',
      timeout: 3000,
      text: '',
      updateButtonLoading: false,
      waitingResult: false,
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

    showButton() {
      return (
        (this.isPlayer1() && this.room.result1 === 0) ||
        (this.isPlayer2() && this.room.result2 === 0)
      );
    },

    existsMatchResult() {
      return this.room.result1 !== 0 && this.room.result2 !== 0;
    },

    playerHasLeft() {
      return this.room.result1 === 3 || this.room.result2 === 3;
    },

    playerLeftMessage() {
      if (this.room.result1 === 3 && this.room.result2 === 3) {
        return `Both Players have left...`;
      } else if (this.room.result1 === 3) {
        return `Player1 has left...`;
      } else if (this.room.result2 === 3) {
        return `Player2 has left...`;
      }
      return null;
    },

    validMatchResult() {
      return (
        (this.room.result1 === 1 && this.room.result2 === 1) ||
        (this.room.result1 === 2 && this.room.result2 === 2)
      );
    },

    invalidMatchResultMessage() {
      if (!this.validMatchResult) {
        if (this.room.result1 === 3 && this.room.result2 === 3) {
          return `Both Players have left...`;
        } else if (this.room.result1 === 3) {
          return `Player1 has left...`;
        } else if (this.room.result2 === 3) {
          return `Player2 has left...`;
        }
        return `Results is conflict, player1 input ${
          this.room.result1 === 1 ? '"win"' : '"lose"'
        }, player2 input ${this.room.result2 === 2 ? '"win"' : '"lose"'}`;
      }
      return null;
    },

    winner() {
      if (this.validMatchResult) {
        return this.room.result1 === 1 ? this.player1 : this.player2;
      }
      return null;
    },

    loser() {
      if (this.validMatchResult) {
        return this.room.result1 === 1 ? this.player2 : this.player1;
      }
      return null;
    },

    winnerRating() {
      if (this.validMatchResult) {
        return this.room.result1 === 1
          ? this.room.player1Rating
          : this.room.player2Rating;
      }
      return null;
    },

    loserRating() {
      if (this.validMatchResult) {
        return this.room.result1 === 1
          ? this.room.player2Rating
          : this.room.player1Rating;
      }
      return null;
    },

    winnerChangeRating() {
      if (this.validMatchResult) {
        return this.room.result1 === 1
          ? this.room.player1ChangeRating
          : this.room.player2ChangeRating;
      }
      return null;
    },

    loserChangeRating() {
      if (this.validMatchResult) {
        return this.room.result1 === 1
          ? this.room.player2ChangeRating
          : this.room.player1ChangeRating;
      }
      return null;
    },
  },

  methods: {
    isPlayer1() {
      return this.currentUser === this.room.userId1;
    },

    isPlayer2() {
      return this.currentUser === this.room.userId2;
    },

    async getLatestRoomInfo() {
      if (!this.waitingResult) {
        return;
      }
      const res = await axios.post(
        '/match/getLatestRoomInfo',
        { roomId: this.room.roomId },
        {
          headers: {
            'X-XSRF-Token': document.getElementById('csrfToken').value,
          },
        }
      );

      if (res.data.room) {
        this.room = res.data.room;
        if (this.existsMatchResult) {
          if (this.validMatchResult && this.room.player1Rating === 0) {
            setTimeout(() => this.getLatestRoomInfo(), 5000);
          } else {
            this.waitingResult = false;
          }
        } else {
          setTimeout(() => this.getLatestRoomInfo(), 5000);
        }
      } else {
        setTimeout(() => this.getLatestRoomInfo(), 5000);
      }
    },

    updateResult(result) {
      this.updateButtonLoading = true;
      let resultCode = null;
      let key = null;

      // eslint-disable-next-line no-alert
      if (!window.confirm(`Is the result really "${result}"?`)) {
        this.updateButtonLoading = false;
        return;
      }
      if (this.isPlayer1()) {
        key = 'resultCode1';
        if (result === 'win') {
          resultCode = 1;
        } else if (result === 'lose') {
          resultCode = 2;
        } else if (result === 'leave') {
          resultCode = 3;
        }
      } else if (this.isPlayer2()) {
        key = 'resultCode2';
        if (result === 'win') {
          resultCode = 2;
        } else if (result === 'lose') {
          resultCode = 1;
        } else if (result === 'leave') {
          resultCode = 3;
        }
      }
      if (!resultCode) {
        return;
      }

      axios
        .post(
          '/match/room/result/update',
          {
            roomId: this.room.roomId,
            [key]: resultCode,
          },
          {
            headers: {
              'X-XSRF-Token': document.getElementById('csrfToken').value,
            },
          }
        )
        .then(res => {
          this.room = res.data.room;
          this.text = 'Data has been successfully updated';
          this.color = 'success';
          this.snackbar = true;
          this.updateButtonLoading = false;
          if (!this.existsMatchResult) {
            this.waitingResult = true;
            this.getLatestRoomInfo();
          }
        })
        .catch(() => {
          this.text = 'Data update failed... Please Reload.';
          this.color = 'error';
          this.snackbar = true;
          this.updateButtonLoading = false;
        });
    },
  },
};
</script>
