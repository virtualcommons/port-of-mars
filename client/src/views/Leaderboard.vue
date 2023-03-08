<!-- Initializes table -->
<template>
  <b-container class="bv-row">
    <b-col>
      <b-button-group size="sm">
        <b-button @click="getBotData" variant="primary">Bot Data</b-button>
        <b-button @click="getNoBotData" variant="primary">No Bot Data</b-button>
      </b-button-group>

      <b-row class="text-center">
        <b-table
          dark
          sticky-header
          small
          class="h-100 m-0 custom-table"
          :fields="exFields"
          :items="exItems"
          col
          style="width: 100rem"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
        >
        </b-table>
      </b-row>
    </b-col>
  </b-container>
</template>

<!-- Initializes table components & orders rank in ascending order-->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Leaderboard extends Vue {
  exFields: any;
  exItems: any;
  sortBy: any;
  sortDesc: any;

  data() {
    return {
      sortBy: "rank",
      sortDesc: false,
      exFields: ["rank", "user_name", "position", "points"],
      exItems: [
        { rank: 2, user_name: "hotdogs", position: "Entrepreneur", points: 32 },
        { rank: 10, user_name: "popcorn", position: "Politician", points: 50 },
        { rank: 39, user_name: "cupcakes", position: "Scientist", points: 45 },
        { rank: 24, user_name: "barkingdogs", position: "Lawyer", points: 20 },
      ],
    };
  }

  getBotData() {}

  getNoBotData() {}
}
</script>

<style lang="scss" scoped></style>
