<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="logs"
      class="elevation-1"
      hide-actions
    >
      <template
        slot="items"
        slot-scope="props">
        <td class="text-xs-right">{{ props.item.myRating }}</td>
        <td class="text-xs-right">{{ props.item.opponentName }}</td>
        <td class="text-xs-right">{{ props.item.opponentRating }}</td>
        <td class="text-xs-right">{{ props.item.result }}</td>
        <td class="text-xs-right">{{ props.item.changeRate }}</td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
module.exports = {
  props: ['logs'],

  data() {
    return {
      headers: [
        {
          text: 'My Rating',
          align: 'left',
          sortable: false,
          value: 'myRating',
        },
        { text: 'Opponent Name', sortable: false, value: 'opponentName' },
        { text: 'Opponent Rating', sortable: false, value: 'opponentRating' },
        { text: 'Result', sortable: false, value: 'result' },
        { text: 'Change Rate', sortable: false, value: 'changeRate' },
      ],
    };
  },
};
</script>
