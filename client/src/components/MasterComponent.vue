<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Synthetic from '@/tutorial/syntheticdata';

@Component({})
export default class Master extends Vue {
  private data = new Synthetic();

  private role: string = this.data.player;

  private round: number = this.data.role;
}
</script>
