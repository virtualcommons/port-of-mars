<template>
  <BContainer class="container-accomplishments" id="v-step-15">
    <BRow class="accomplishments-topbar">
      <div class="accomplishments-topbar-title">
        <p>Accomplishments</p>
      </div>
      <div class="accomplishments-topbar-button-container">
        <button
          type="button"
          name="button"
          @click="handleClick('available')"
          :class="activeView == 'available' ? 'btn-active' : ''"
        >
          Available
        </button>
        <button
          type="button"
          name="button"
          @click="handleClick('inventory')"
          :class="activeView == 'inventory' ? 'btn-active' : ''"
        >
          Inventory
        </button>
      </div>
    </BRow>

    <BRow class="accomplishment-cards">
      <BRow class="accomplishments-cards-available" v-if="activeView == 'available'">
        <CardAccomplishment id="v-step-16" :accomplishment="currentAccomplishments[0]" />
        <CardAccomplishment :accomplishment="currentAccomplishments[1]" />
        <CardAccomplishment :accomplishment="currentAccomplishments[2]" />
      </BRow>

      <BRow class="accomplishments-cards-inventory" v-if="activeView == 'inventory'">
      <div v-for="accomplishment in boughtAccomplishments" :key="accomplishment.label">
        <CardAccomplishment :accomplishment="accomplishment"/>
      </div>
      </BRow>
    </BRow>
  </BContainer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';
import CardAccomplishment from '@/components/gamedashboard/cards/CardAccomplishment.vue';
import { accomplishments } from '../../../../../server/src/data';

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
    CardAccomplishment,
  },
})
export default class ContainerAccomplishments extends Vue {
  private activeView = 'available';

  private isActive = true;

  get currentAccomplishments() {
    return this.$store.state.activeAccomplishmentCards;
  }

  get boughtAccomplishments() {
    return this.$store.state.boughtAccomplishmentCards;
  }

  handleClick(view: string) {
    this.activeView = view;
  }
}
</script>

<style scoped>
.container-accomplishments {
  height: 100%;
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
}

.accomplishments-topbar {
  height: 10%;
  width: 100%;
  margin: 0;
  padding: 0.25rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--space-orange);
}

.accomplishments-topbar-title {
  height: 100%;
  width: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.accomplishments-topbar-title p {
  width: 100%;
  margin: 0;
  font-size: var(--font-large);
  text-align: left;
  color: var(--space-gray);
}

.accomplishments-topbar-button-container {
  height: 100%;
  width: 40%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
}

.accomplishments-topbar-button-container button {
  height: 50%;
  border: none;
  font-size: var(--font-small);
  text-align: right;
  background-color: transparent;
  transition: all .2s ease-in-out;
}

.accomplishments-topbar-button-container button:focus {
  outline: none;
}

.btn-active {
  color: var(--space-white);
  background-color: var(--space-gray) !important;
}

.accomplishment-cards {
  height: 90%;
  width: 100%;
  padding: 0.5rem;
  margin: 0;
  border-right: var(--border-white);
  border-bottom: var(--border-white);
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

.accomplishment-cards::-webkit-scrollbar {
  /* WebKit */
  width: 0;
  height: 0;
}

.accomplishments-cards-available,
.accomplishments-cards-inventory {
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.accomplishments-cards-available {
  min-height: 100%;
  justify-content: space-around;
}

.accomplishments-cards-inventory {
  min-height: 100%;
  justify-content: space-around;
}

.test-card {
  height: 3.5rem;
  width: 80%;
  margin-bottom: 0.5rem;
  background-color: green;
}
</style>
