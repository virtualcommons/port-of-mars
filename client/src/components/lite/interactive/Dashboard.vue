<template>
  <div class="d-flex flex-column p-2 h-100 overflow-hidden">
    <div class="d-flex flex-row justify-content-between mx-3">
      <div v-for="(player, playerKey, index) in state.players" :key="playerKey">
        <OtherPlayers
          :index="index + 1"
          :isSelf="player.role === state.player.role"
          :player="player"
        />
      </div>
    </div>

    <div class="d-flex flex-row flex-grow-1 overflow-hidden">
      <div class="d-flex flex-column flex-grow-1 overflow-hidden">
        <div class="d-flex flex-shrink-1 m-2 mt-3">
          <SegmentedBar
            :min="0"
            :max="60"
            :delta="pendingSystemHealthInvestment"
            v-model="state.systemHealth"
            label="System Health"
            class="flex-grow-1"
            variant="green"
            size="md"
            :helpText="systemHealthHelpText"
          />
        </div>
        <div class="d-flex flex-row align-items-center justify-content-between py-2">
          <div class="d-flex flex-column align-items-center mx-3">
            <h6 class="text-center">Round</h6>
            <div class="d-flex justify-content-center align-items-center">
              <div class="vfd-container p-2">
                <VFDNumberDisplay :digits="2" :value="state.round" variant="red" size="2" />
              </div>
              <h4 v-if="state.treatmentParams.isNumberOfRoundsKnown" class="mx-2">/</h4>
              <div v-if="state.treatmentParams.isNumberOfRoundsKnown" class="vfd-container p-2">
                <VFDNumberDisplay :digits="2" :value="state.maxRound" variant="red" size="2" />
              </div>
            </div>
          </div>
          <div class="d-flex flex-column align-items-center mx-3">
            <span class="badge bg-primary" :style="phaseLabel.style">
              <h6 class="text-center mb-0">{{ phaseLabel.label }}</h6>
            </span>
            <p v-if="state.activeCardId >= 0" class="text-center small text-muted">
              Deal with them before investing
            </p>
            <Clock
              v-if="state.activeCardId < 0"
              :timeRemaining="state.timeRemaining"
              :size="2"
              :showBlank="state.activeCardId >= 0"
            />
          </div>
          <div class="d-flex align-items-center">
            <div class="d-flex flex-column align-items-center">
              <h6 class="text-center">Points</h6>
              <div class="vfd-container p-2">
                <VFDNumberDisplay
                  :digits="2"
                  :value="state.player.points"
                  variant="yellow"
                  size="2"
                />
              </div>
            </div>
            <div class="d-flex flex-column align-items-center ml-3">
              <h6 class="text-center">Resources</h6>
              <div class="vfd-container p-2">
                <VFDNumberDisplay
                  :digits="2"
                  :value="state.player.resources"
                  variant="blue"
                  size="2"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex flex-md-row flex-column flex-grow-1 overflow-hidden">
          <div class="cell-shrink d-flex flex-column w-100 w-md-50">
            <div
              class="flex-grow-1 d-flex flex-column justify-content-center align-items-center"
              style="min-width: 0"
            >
              <div class="p-2 overflow-hidden">
                <transition
                  name="event-draw"
                  appear
                  mode="out-in"
                  @before-leave="onBeforeEventCardLeave"
                  @after-leave="onAfterEventCardLeave"
                >
                  <EventCard
                    v-if="state.activeCardId >= 0"
                    :key="`card-${activeCard.deckCardId}`"
                    class="w-100"
                    :event="activeCard"
                    style="max-width: 48rem; margin: 0 auto"
                  >
                    <div v-if="isVotingEvent && activeCard?.requiresVote" class="mt-2">
                      <div v-if="getVotingType === 'binary'" class="text-center">
                        <b-button-group size="md" class="w-100">
                          <b-button
                            variant="success"
                            @click="handleBinaryVote(true)"
                            :disabled="hasVoted"
                            :class="{ 'animate-flashing vfd-green': !hasVoted }"
                          >
                            {{ binaryAffirmativeLabel }}
                          </b-button>
                          <b-button
                            variant="danger"
                            @click="handleBinaryVote(false)"
                            :disabled="hasVoted"
                            :class="{ 'animate-flashing vfd-red': !hasVoted }"
                          >
                            {{ binaryNegativeLabel }}
                          </b-button>
                        </b-button-group>
                      </div>
                      <div v-else-if="getVotingType === 'role'" class="text-center">
                        <div class="d-flex flex-wrap justify-content-center">
                          <b-button
                            v-for="role in getAvailableRoles"
                            :key="role"
                            class="m-1"
                            variant="warning"
                            @click="handleRoleVote(role)"
                            :disabled="hasVoted"
                            :class="{ 'animate-flashing vfd-yellow': !hasVoted }"
                          >
                            {{ role }}
                          </b-button>
                        </div>
                      </div>
                    </div>
                    <div v-if="state.eventTimeTotal > 0" class="event-timer mt-2">
                      <b-progress
                        :value="state.eventTimeRemaining"
                        :max="state.eventTimeTotal"
                        variant="success"
                        height="0.75rem"
                      />
                    </div>
                  </EventCard>
                </transition>
                <div
                  v-if="state.activeCardId < 0 && !isCardLeaving"
                  class="flex-grow-1 d-flex align-items-center justify-content-center"
                >
                  <div class="w-100">
                    <p class="text-muted small mb-3 text-center">
                      Events will happen at the start of the next round
                    </p>
                    <div class="p-1 mb-2 small" style="flex: 0 0 auto">
                      <ThresholdInfo
                        :state="state"
                        :thresholdInformation="state.treatmentParams.thresholdInformation"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="cell-shrink d-flex flex-column w-100 w-md-50">
            <div class="d-flex flex-column flex-grow-1 p-2">
              <div class="flex-grow-1">
                <Investment
                  :state="state"
                  v-model="pendingSystemHealthInvestment"
                  @invest="handleInvest"
                  helpText="Contribute resources to system health. Left over resources are earned as points."
                  buttonText="Invest"
                  :enableKeyboard="false"
                  :shouldFlashEachRound="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="cell-shrink mw-25" style="min-width: 25%">
        <LiteChat :messages="state.chatMessages" :chatEnabled="state.chatEnabled" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Inject, Prop, Vue, Watch } from "vue-property-decorator";
import { LiteGameRequestAPI } from "@port-of-mars/client/api/pomlite/multiplayer/request";
import { LiteGameClientState, LiteGamePlayerClientState } from "@port-of-mars/shared/lite";
import EventCard from "@port-of-mars/client/components/lite/EventCard.vue";
import LiteChat from "@port-of-mars/client/components/lite/LiteChat.vue";
import PlayerIndicators from "@port-of-mars/client/components/lite/PlayerIndicators.vue";
import SegmentedBar from "@port-of-mars/client/components/lite/SegmentedBar.vue";
import Investment from "@port-of-mars/client/components/lite/Investment.vue";
import Clock from "@port-of-mars/client/components/lite/Clock.vue";
import ThresholdInfo from "@port-of-mars/client/components/lite/ThresholdInfo.vue";
import VFDNumberDisplay from "@port-of-mars/client/components/lite/VFDNumberDisplay.vue";
import HealthGained from "@port-of-mars/client/components/lite/HealthGained.vue";
import OtherPlayers from "@port-of-mars/client/components/lite/interactive/OtherPlayers.vue";
import { Role } from "@port-of-mars/shared/types";

@Component({
  components: {
    EventCard,
    LiteChat,
    PlayerIndicators,
    SegmentedBar,
    Investment,
    Clock,
    ThresholdInfo,
    VFDNumberDisplay,
    HealthGained,
    OtherPlayers,
  },
})
export default class Dashboard extends Vue {
  @Inject() readonly api!: LiteGameRequestAPI;
  @Prop() state!: LiteGameClientState;

  pendingSystemHealthInvestment = 0;
  systemHealthGained = 0;
  pointsGained = 0;
  votesReceived = 0;

  // inline voting state (moved from modal)
  selectedBinaryVote: boolean | null = null;
  selectedRole: Role | null = null;
  hasVoted = false;
  submittingVote = false;
  isCardLeaving = false;

  get activeCard() {
    return this.state.visibleEventCards.find(card => card.deckCardId === this.state.activeCardId);
  }

  get isProlificBaselineGame() {
    return this.state.type === "prolificBaseline";
  }

  get isVotingEvent() {
    if (!this.activeCard?.requiresVote || !this.state.votingInProgress) {
      return false;
    }
    // if event has affectedRole, only show voting to that role
    if (this.activeCard.affectedRole) {
      return this.state.player.role === this.activeCard.affectedRole;
    }
    // otherwise show voting to all players
    return true;
  }

  get getVotingType(): "binary" | "role" {
    if (this.activeCard?.codeName === "heroOrPariah") {
      // step 1: binary (hero/pariah), step 2: role selection
      return this.state.currentVoteStep === 1 ? "binary" : "role";
    }
    if (this.activeCard?.codeName === "compulsivePhilanthropy") {
      return "role";
    }
    return "binary";
  }

  get getAvailableRoles() {
    return Object.values(this.state.players).map(
      (player: LiteGamePlayerClientState) => player.role
    );
  }

  get binaryAffirmativeLabel() {
    switch (this.activeCard?.codeName) {
      case "heroOrPariah":
        return "Hero (gain)";
      default:
        return "Yes";
    }
  }

  get binaryNegativeLabel() {
    switch (this.activeCard?.codeName) {
      case "heroOrPariah":
        return "Pariah (lose)";
      default:
        return "No";
    }
  }

  get phaseLabel() {
    let label = "";
    let color = "";
    if (this.state.isRoundTransitioning) {
      label = "New round in";
      color = "var(--secondary)";
    } else if (this.state.activeCardId >= 0) {
      label = "Events active";
      color = "var(--warning)";
    } else {
      label = "Make an investment";
      color = "var(--primary)";
    }
    return {
      label,
      style: `background-color: ${color} !important; color: var(--dark) !important; margin-top: -5px; margin-bottom: 5px`,
    };
  }

  get systemHealthHelpText() {
    if (this.state.sandstormRoundsRemaining > 0) {
      return "[SANDSTORM ACTIVE] Forecasted system health loss: 25";
    }
    return "Forecasted system health loss: 15";
  }

  handleInvest(investment: number) {
    this.pointsGained = this.state.player.resources - investment;
    this.systemHealthGained = investment;
    this.api.invest(investment);
  }

  handleBinaryVote(vote: boolean) {
    if (!this.hasVoted) {
      this.selectedBinaryVote = vote;
      this.submitVote();
    }
  }

  handleRoleVote(role: Role) {
    if (!this.hasVoted) {
      this.selectedRole = role;
      this.submitVote();
    }
  }

  async submitVote() {
    if (this.submittingVote || this.hasVoted) return;
    this.submittingVote = true;
    try {
      if (this.getVotingType === "binary" && this.selectedBinaryVote !== null) {
        await this.api.submitVote({ binaryVote: this.selectedBinaryVote });
      } else if (this.getVotingType === "role" && this.selectedRole) {
        await this.api.submitVote({ roleVote: this.selectedRole });
      }
      this.hasVoted = true;
    } catch (error) {
      console.error("Vote submission error:", error);
    } finally {
      this.submittingVote = false;
    }
  }

  resetVotingState() {
    this.selectedBinaryVote = null;
    this.selectedRole = null;
    this.hasVoted = false;
    this.submittingVote = false;
  }

  @Watch("state.activeCardId")
  onActiveCardChanged() {
    this.resetVotingState();
  }

  @Watch("state.currentVoteStep")
  onVoteStepChanged() {
    // reset local voting state between steps so buttons enable correctly
    this.resetVotingState();
  }

  onBeforeEventCardLeave() {
    // avoid showing placeholder during leave animation
    this.isCardLeaving = true;
  }

  onAfterEventCardLeave() {
    this.isCardLeaving = false;
  }
}
</script>

<style lang="scss" scoped>
.event-timer .progress {
  background-color: transparent;
}

// card flip animation
.event-draw-enter-active,
.event-draw-leave-active {
  transition: transform 600ms ease;
  transform-style: preserve-3d;
}
.event-draw-enter {
  transform-origin: 50% 100%;
  transform: perspective(800px) rotateX(-90deg);
}
.event-draw-enter-to {
  transform: perspective(800px) rotateX(0deg);
}
.event-draw-leave-to {
  transform-origin: 50% 100%;
  transform: perspective(800px) rotateX(90deg);
}
</style>
