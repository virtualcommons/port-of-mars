<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Synthetic from '@/tutorial/syntheticdata';

@Component({})
export default class Master extends Vue {
  private data = new Synthetic();

  private role: string = this.data.player;

  private round: number = this.data.round;

  private costs: object = this.data.roundCosts;

  constructor() {
    super();
    console.log(this.costs);
    this.$store.dispatch('setPlayerRole', this.role);
    this.$store.dispatch('updateRoundCosts', this.costs);
  }
}
</script>
