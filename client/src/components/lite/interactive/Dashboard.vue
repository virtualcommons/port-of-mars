<template>
  <div class="d-flex flex-column p-2 h-100 overflow-hidden">
    <div class="d-flex flex-row justify-content-between mx-3">
      <div v-for="([playerKey, player], index) of state.players" :key="playerKey">
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
            :max="75"
            :delta="pendingSystemHealthInvestment"
            v-model="normalizedSystemHealth"
            label="System Health"
            class="flex-grow-1"
            variant="green"
          />
        </div>

        <div class="d-flex flex-md-row flex-column flex-grow-1 overflow-hidden">
          <div class="cell-shrink mw-50 d-flex flex-column">
            <div class="p-1 mb-2 small">
              <ThresholdInfo
                :state="state"
                :thresholdInformation="state.treatmentParams.thresholdInformation"
              />
            </div>
            <div class="flex-grow-1 d-flex flex-column">
              <div v-if="state.activeCardId >= 0" class="p-2">
                <EventCard :event="activeCard">
                  <div v-if="isVotingEvent && activeCard?.requiresVote" class="mt-2">
                    <div v-if="getVotingType === 'binary'" class="text-center">
                      <b-button-group size="md" class="w-100">
                        <b-button
                          variant="outline-success"
                          @click="handleBinaryVote(true)"
                          :disabled="hasVoted"
                        >
                          {{ binaryAffirmativeLabel }}
                        </b-button>
                        <b-button
                          variant="outline-danger"
                          @click="handleBinaryVote(false)"
                          :disabled="hasVoted"
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
                          variant="outline-light"
                          @click="handleRoleVote(role)"
                          :disabled="hasVoted"
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
              </div>
            </div>
          </div>

          <div class="cell-grow d-flex flex-column mw-50">
            <div class="d-flex flex-row justify-content-around">
              <div class="cell-grow bg-transparent m-0 d-flex flex-column justify-content-center">
                <h6 class="text-center">
                  {{ state.isRoundTransitioning ? "New round in" : "Time left" }}
                </h6>
                <div class="d-flex justify-content-center">
                  <Clock :timeRemaining="state.timeRemaining" :size="2" />
                </div>
              </div>
              <div
                class="cell-grow bg-transparent mw-50 m-0 d-flex flex-column justify-content-center"
              >
                <div>
                  <h6 class="text-center">Round</h6>
                </div>
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
            </div>

            <div class="d-flex flex-column flex-grow-1 p-2">
              <div class="d-flex justify-content-around align-items-center">
                <div class="d-flex flex-column align-items-center mx-3">
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
                <div class="d-flex flex-column align-items-center mx-3">
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
              <div class="flex-grow-1">
                <Investment
                  :state="state"
                  v-model="pendingSystemHealthInvestment"
                  @invest="handleInvest"
                  helpText="Contribute resources to system health. Left over resources are earned as points."
                  buttonText="Invest"
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
import { LiteGameClientState } from "@port-of-mars/shared/lite";
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
      return this.state.currentVoteStep === 1 ? "role" : "binary";
    }
    if (this.activeCard?.codeName === "compulsivePhilanthropy") {
      return "role";
    }
    return "binary";
  }

  get getAvailableRoles() {
    return Array.from(this.state.players.values()).map(player => player.role);
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

  get actualVotesReceived() {
    const playersWithVotes = Array.from(this.state.players.values()).filter(
      player => player.vote !== undefined
    );
    console.log("InteractiveDashboard: Calculating actual votes received");
    console.log(
      "InteractiveDashboard: All players:",
      Array.from(this.state.players.values()).map(p => ({
        role: p.role,
        hasVote: p.vote !== undefined,
        vote: p.vote,
      }))
    );
    console.log("InteractiveDashboard: Players with votes:", playersWithVotes.length);
    console.log("InteractiveDashboard: Total players:", this.state.numPlayers);
    console.log("InteractiveDashboard: Voting in progress:", this.state.votingInProgress);
    return playersWithVotes.length;
  }

  get normalizedSystemHealth() {
    if (this.state.systemHealth === 0) {
      return 0;
    }
    return Math.floor((this.state.systemHealth - 1) / this.state.numPlayers) + 1;
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
}
</script>

<style lang="scss" scoped>
.event-timer .progress {
  background-color: transparent;
}
</style>
