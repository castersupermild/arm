<template>
  <form @submit.prevent="searchLowestCalendar">
    <h3>{{ title }}</h3>
    originCityCode: <input
      v-model="searchParams.originCityCode"
      type="text" ><br>
    destinationCityCode: <input
      v-model="searchParams.destinationCityCode"
      type="text" ><br>
    fromDate: <input
      v-model="searchParams.fromDate"
      type="text" ><br>
    toDate: <input
      v-model="searchParams.toDate"
      type="text" ><br>
    <button type="submit">search lowest calendar</button>
  </form>
</template>

<script>
module.exports = {
  props: {
    actionUrl: { type: String, required: true },
    title: { type: String, default: 'lowest calendar form' },
    searchParams: {
      type: Object,
      default() {
        return {
          originCityCode: '',
          destinationCityCode: '',
          fromDate: '',
          toDate: '',
        };
      },
    },
  },

  methods: {
    searchLowestCalendar() {
      window.location.href = `${this.actionUrl}?${new URLSearchParams({
        ...this.searchParams,
      }).toString()}`;
    },
  },
};
</script>
