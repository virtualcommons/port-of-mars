<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 overflow-auto">
    <div class="h-100 p-3">
      <b-row class="h-100 m-0">
        <b-col>
          <div class="mb-4" id="prolific-study">
            <h4>Prolific Studies</h4>
            <hr class="my-2" />
            <div class="d-flex justify-content-end align-items-center mb-3">
              <b-button variant="success" class="mr-2" @click="showAddStudyModal">
                <h4 class="mb-0"><b-icon-plus />New Study</h4>
              </b-button>
            </div>
            <div class="h-100-header w-100 content-container">
              <b-table
                dark
                sticky-header
                class="h-100 m-0 custom-table"
                :fields="studyFields"
                :items="prolificStudies"
              >
                <template #cell(description)="data">
                  {{ data.item.description || "-" }}
                </template>
                <template #cell(studyId)="data">
                  {{ data.item.studyId || "-" }}
                </template>
                <template #cell(completionCode)="data">
                  {{ data.item.completionCode || "-" }}
                </template>
                <template #cell(actions)="data">
                  <b-button
                    @click="showEditStudyModal(data.item)"
                    variant="primary"
                    class="mr-2"
                    size="sm"
                  >
                    Edit
                  </b-button>
                  <b-button @click="showBonusPaymentsModal(data.item)" size="sm"
                    >Bonus Payments</b-button
                  >
                </template>
              </b-table>
            </div>
          </div>
          <b-modal
            id="add-study-modal"
            centered
            title="Add New Study"
            body-bg-variant="dark"
            header-bg-variant="dark"
            footer-bg-variant="dark"
            okTitle="Add Study"
            cancelTitle="Cancel"
            @ok="addStudy"
          >
            <b-form>
              <b-form-group label="Study ID" label-for="study-id-input">
                <b-form-input
                  id="study-id-input"
                  v-model="newStudy.studyId"
                  required
                  placeholder="The ID of the study on Prolific"
                ></b-form-input>
              </b-form-group>
              <b-form-group label="Description" label-for="study-description-input">
                <b-form-input
                  id="study-description-input"
                  v-model="newStudy.description"
                  required
                  placeholder="Short description of the study to disambiguate"
                ></b-form-input>
              </b-form-group>
              <b-form-group label="Completion Code" label-for="completion-code-input">
                <b-form-input
                  id="completion-code-input"
                  v-model="newStudy.completionCode"
                  required
                  placeholder="The completion code from Prolific"
                ></b-form-input>
              </b-form-group>
            </b-form>
          </b-modal>
          <b-modal
            id="edit-study-modal"
            centered
            :title="`Edit Study: ${selectedStudy.studyId}`"
            body-bg-variant="dark"
            header-bg-variant="dark"
            footer-bg-variant="dark"
            okTitle="Save Changes"
            cancelTitle="Cancel"
            @ok="saveStudyChanges"
          >
            <b-form>
              <b-form-group label="Description" label-for="edit-study-description-input">
                <b-form-input
                  id="study-description-input"
                  v-model="selectedStudy.description"
                  required
                  placeholder="Short description of the study to disambiguate"
                ></b-form-input>
              </b-form-group>
              <b-form-group label="Completion Code" label-for="edit-completion-code-input">
                <b-form-input
                  id="completion-code-input"
                  v-model="selectedStudy.completionCode"
                  required
                  placeholder="The completion code from Prolific"
                ></b-form-input>
              </b-form-group>
            </b-form>
          </b-modal>
          <b-modal
            id="bonus-payment-modal"
            centered
            :title="`Bonus Payment info for study: ${selectedStudy.studyId}`"
            body-bg-variant="dark"
            header-bg-variant="dark"
            footer-bg-variant="dark"
            hide-footer
          >
            <b-form v-if="selectedStudy.participantPoints">
              <b-form-checkbox
                id="show-zero-bonus-payments"
                v-model="showZeroBonusPayments"
                class="mb-3"
              >
                Show participants with $0.00 bonus payments
              </b-form-checkbox>
              <b-form-textarea
                id="bonus-payment-description-input"
                :value="selectedBonusPaymentInfo"
                required
                placeholder="No participants have earned bonus payments"
                disabled
                class="bg-dark"
                style="font-family: monospace"
                rows="20"
                max-rows="20"
              ></b-form-textarea>
            </b-form>
          </b-modal>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { StudyAPI } from "@port-of-mars/client/api/study/request";
import { ProlificStudyData } from "@port-of-mars/shared/types";

@Component({})
export default class Studies extends Vue {
  studyApi!: StudyAPI;

  prolificStudies: ProlificStudyData[] = [];
  newStudy: ProlificStudyData = this.resetStudy();
  selectedStudy: ProlificStudyData = this.resetStudy();

  showZeroBonusPayments = false;

  studyFields = [
    { key: "studyId", label: "Study ID" },
    { key: "description", label: "Description" },
    { key: "completionCode", label: "Completion Code" },
    { key: "actions", label: "" },
  ];

  get selectedBonusPaymentInfo() {
    return this.selectedStudy.participantPoints
      ? this.pointsToPaymentsCsv(this.selectedStudy.participantPoints)
      : "";
  }

  async created() {
    this.studyApi = new StudyAPI(this.$tstore, this.$ajax);
    await this.loadProlificStudies();
  }

  resetStudy(): ProlificStudyData {
    return {
      studyId: "",
      description: "",
      completionCode: "",
      isActive: true,
    };
  }

  async loadProlificStudies() {
    try {
      this.prolificStudies = await this.studyApi.getAllProlificStudies();
      console.log("Loaded studies:", this.prolificStudies);
    } catch (error) {
      console.error("Failed to load studies:", error);
    }
  }

  showAddStudyModal() {
    this.newStudy = this.resetStudy();
    this.$bvModal.show("add-study-modal");
  }

  async addStudy() {
    try {
      await this.studyApi.addProlificStudy(this.newStudy);
      this.$bvModal.hide("add-study-modal");
      await this.loadProlificStudies();
      this.newStudy = this.resetStudy();
    } catch (error) {
      console.error("Failed to add study:", error);
    }
  }

  showEditStudyModal(study: ProlificStudyData) {
    console.log({ ...study });
    this.selectedStudy = { ...study };
    this.$bvModal.show("edit-study-modal");
  }

  async saveStudyChanges() {
    if (this.selectedStudy) {
      try {
        await this.studyApi.updateProlificStudy({ ...this.selectedStudy });
        this.$bvModal.hide("edit-study-modal");
        await this.loadProlificStudies();
      } catch (error) {
        console.error("Failed to update study:", error);
      }
    }
  }

  showBonusPaymentsModal(study: ProlificStudyData) {
    this.selectedStudy = { ...study };
    this.$bvModal.show("bonus-payment-modal");
  }

  pointsToPaymentsCsv(data: ProlificParticipantPointData[]): string {
    return data
      .filter(item => this.showZeroBonusPayments || item.points > 0)
      .map(item => {
        const dollars = (item.points / 100).toFixed(2);
        return `${item.prolificId},${dollars}`;
      })
      .join("\n");
  }
}
</script>
