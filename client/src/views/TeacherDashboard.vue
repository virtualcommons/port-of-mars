<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 backdrop overflow-auto">
    <div class="h-100 w-100 d-flex flex-column">
      <Messages class="position-fixed p-3"></Messages>
      <b-row class="h-100 w-100 mx-auto flex-grow-1 p-3">
        <!-- Sidebar -->
        <b-col cols="2" class="d-flex flex-column justify-content-between">
          <div>
            <h4 class="row header-nowrap my-2 ml-1">Classrooms</h4>
            <div class="classrooms">
              <b-tabs pills vertical nav-wrapper-class="w-100">
                <b-tab
                  v-for="classroom in classrooms"
                  :key="classroom.id"
                  :title="classroom.descriptor"
                  @click="selectClassroom(classroom.id)"
                ></b-tab>
              </b-tabs>
            </div>
            <b-button v-b-modal.add-classroom-modal variant="success" class="w-100 mt-2">
              <h4 class="mb-0">New<b-icon-plus></b-icon-plus></h4>
            </b-button>
          </div>
          <div>
            <b-button
              v-if="classrooms.length > 0"
              variant="link"
              class="text-decoration-none p-0 d-flex align-items-center"
              @click="$bvModal.show('welcome-info-modal')"
            >
              <b-icon-info-circle class="float-left mr-2 mb-1"></b-icon-info-circle>
              Information
            </b-button>
          </div>
        </b-col>

        <b-col cols="10" class="content-container h-100 w-100 p-3 overflow-hidden">
          <div v-if="classrooms.length > 0 && selectedClassroom">
            <h4>{{ selectedClassroom?.descriptor }}</h4>
            <h4>
              Game Code:
              <span class="badge bg-white text-primary p-2 ml-1">
                {{ selectedClassroom.authToken }}
              </span>
            </h4>
            <b-row>
              <b-tabs pills card v-model="dashboardTabs" class="w-100" lazy>
                <b-tab title="Students">
                  <Students :selectedClassroom="selectedClassroom" />
                </b-tab>
                <b-tab title="Groups">
                  <Groups :selectedClassroom="selectedClassroom" />
                </b-tab>
                <b-tab title="Reports">
                  <Reports :selectedClassroom="selectedClassroom" />
                </b-tab>
                <b-tab title="Settings">
                  <p><b-icon-gear-fill class="mr-2"></b-icon-gear-fill>Classroom Settings</p>
                  <b-row>
                    <b-button
                      :pressed="false"
                      class="text-nowrap mx-3"
                      variant="warning"
                      v-b-modal.rename-classroom-modal
                    >
                      <b-icon-pencil-square class="float-left mr-1"></b-icon-pencil-square>
                      Rename Classroom
                    </b-button>
                    <b-button
                      :pressed="false"
                      class="text-nowrap"
                      variant="danger"
                      v-b-modal.delete-confirm-modal
                    >
                      <b-icon-trash-fill class="float-left mr-1"></b-icon-trash-fill>
                      Delete Classroom
                    </b-button>
                  </b-row>
                </b-tab>
              </b-tabs>
            </b-row>
          </div>
          <div v-else>
            <h4 class="font-weight-bold text-center mb-4" style="color: var(--light-shade)">
              Welcome to the teacher dashboard
            </h4>
            <p style="color: white">
              The game is built on the premise that when people share a common resource, they will
              have to cooperate to manage it sustainably. You may be aware of the “tragedy of the
              commons”? The Port of Mars demonstrates the challenges of managing a shared resource,
              but it does not have to lead to a tragedy. Will your students overcome those
              challenges? And how does this relate to everyday challenges they experience?
            </p>
            <p style="color: white">
              In the lesson plan
              <a
                href="https://docs.google.com/document/d/15VYUrirOInXZ1Dr9xTUSg-KjSycVFhwa0upMbi7mUyw/edit?usp=sharing"
                target="_blank"
                rel="noopener"
              >
                here
              </a>
              , we provide more background and suggestions for activities to do in class, including
              some assessment methods.
            </p>
            <p style="color: white">
              To get started, you need to create a classroom. You will get a number called a game
              code that your students can use to log in. If the total number of students
              participating is not a multiple of five, some students will play with a group that
              includes nice bots.
            </p>
            <p style="color: white">
              You control when the game starts. It would be helpful if the students watched the
              tutorial video and the manual. There might be some questions in the beginning since it
              is not easy to manage a habitat on Mars. The game typically lasts between 30 and 60
              minutes.
            </p>
            <p style="color: white">
              Once the games are played, you can see some basic statistics of the groups such as how
              system health changed over time, and how many points the different students earned.
              This can be used in a discussion with the students. Why did some groups manage to keep
              their habitat running for all the rounds while other groups had their system health
              dropping to 0 within a few rounds (game over)?
            </p>
            <p style="color: white">
              We provide, at the moment, the most essential information for you to use the game in
              class. Depending on the requests we get, extensions will be made. Let us know if you
              have questions or suggestions, and send them to
              <a href="mailto:PORTMARS@ASU.EDU">PORTMARS@ASU.EDU</a>.
            </p>
          </div>
        </b-col>
      </b-row>
    </div>
    <!--add classroom modal-->
    <b-modal
      id="add-classroom-modal"
      size="lg"
      centered
      title="Enter a New Classroom:"
      body-bg-variant="dark"
      header-bg-variant="dark"
      header-class="pb-0 border-bottom-0"
      footer-class="pt-0 border-top-0"
      footer-bg-variant="dark"
      cancel-variant="outline-secondary"
      @ok="handleDescriptorOk('add', $event)"
      @show="resetDescriptorModal"
      @hidden="resetDescriptorModal"
    >
      <form ref="form" @submit.stop.prevent="handleDescriptorSubmit('add')">
        <b-form-group
          label-for="descriptor-input"
          description="Must be no more than 20 characters."
          :state="descriptorState"
        >
          <b-form-input
            id="descriptor-input"
            v-model="classroomDescriptor"
            :state="descriptorState"
            required
          ></b-form-input>
          <b-form-invalid-feedback v-if="!descriptorState && !this.descriptorErrorMessage"
            >Descriptor is required</b-form-invalid-feedback
          >
          <b-form-invalid-feedback v-else-if="descriptorErrorMessage">{{
            descriptorErrorMessage
          }}</b-form-invalid-feedback>
        </b-form-group>
      </form>
    </b-modal>
    <!--rename classroom modal-->
    <b-modal
      id="rename-classroom-modal"
      size="lg"
      centered
      title="Rename Classroom to:"
      body-bg-variant="dark"
      header-bg-variant="dark"
      header-class="pb-0 border-bottom-0"
      footer-class="pt-0 border-top-0"
      footer-bg-variant="dark"
      cancel-variant="outline-secondary"
      @ok="handleDescriptorOk('rename', $event)"
      @show="resetDescriptorModal"
      @hidden="resetDescriptorModal"
    >
      <form ref="form" @submit.stop.prevent="handleDescriptorSubmit('rename')">
        <b-form-group
          label-for="descriptor-input"
          description="Must be no more than 20 characters."
          :state="descriptorState"
        >
          <b-form-input
            id="descriptor-input"
            v-model="classroomDescriptor"
            :state="descriptorState"
            required
          ></b-form-input>
          <b-form-invalid-feedback v-if="!descriptorState && !this.descriptorErrorMessage"
            >Descriptor is required</b-form-invalid-feedback
          >
          <b-form-invalid-feedback v-else-if="descriptorErrorMessage">{{
            descriptorErrorMessage
          }}</b-form-invalid-feedback>
        </b-form-group>
      </form>
    </b-modal>
    <!--delete classroom modal-->
    <b-modal
      id="delete-confirm-modal"
      centered
      title="Delete Confirmation"
      body-bg-variant="dark"
      header-bg-variant="dark"
      header-class="pb-0 border-bottom-0"
      footer-class="pt-0 border-top-0"
      footer-bg-variant="dark"
      cancel-variant="outline-secondary"
      okTitle="Confirm"
      @ok="deleteClassroom"
    >
      <span>Are you sure you want to delete this classroom? This action cannot be undone.</span>
    </b-modal>
    <!--welcome info modal-->
    <b-modal
      id="welcome-info-modal"
      size="lg"
      centered
      body-bg-variant="dark"
      header-bg-variant="dark"
      header-class="pb-0 border-bottom-0"
      footer-class="pt-0 border-top-0"
      footer-bg-variant="dark"
    >
      <h4 class="font-weight-bold text-center mb-4" style="color: var(--light-shade)">
        Welcome to the teacher dashboard
      </h4>
      <p>
        The game is built on the premise that when people share a common resource, they will have to
        cooperate to manage it sustainably. You may be aware of the “tragedy of the commons”? The
        Port of Mars demonstrates the challenges of managing a shared resource, but it does not have
        to lead to a tragedy. Will your students overcome those challenges? And how does this relate
        to everyday challenges they experience?
      </p>
      <p>
        In the lesson plan
        <a
          href="https://docs.google.com/document/d/15VYUrirOInXZ1Dr9xTUSg-KjSycVFhwa0upMbi7mUyw/edit?usp=sharing"
          target="_blank"
          rel="noopener"
        >
          here
        </a>
        , we provide more background and suggestions for activities to do in class, including some
        assessment methods.
      </p>
      <p>
        To get started, you need to create a classroom. You will get a number that your students can
        use to log in. If the total number of students participating is not a multiple of five, some
        students will play with a group that includes nice bots.
      </p>
      <p>
        You control when the game starts. It would be helpful if the students watched the tutorial
        video and the manual. There might be some questions in the beginning since it is not easy to
        manage a habitat on Mars. The game typically lasts between 30 and 60 minutes.
      </p>
      <p>
        Once the games are played, you can see some basic statistics of the groups such as how
        system health changed over time, and how many points the different students earned. This can
        be used in a discussion with the students. Why did some groups manage to keep their habitat
        running for all the rounds while other groups had their system health dropping to 0 within a
        few rounds (game over)?
      </p>
      <p>
        We provide, at the moment, the most essential information for you to use the game in class.
        Depending on the requests we get, extensions will be made. Let us know if you have questions
        or suggestions, and send them to
        <a href="mailto:PORTMARS@ASU.EDU">PORTMARS@ASU.EDU</a>.
      </p>
    </b-modal>
  </b-container>
</template>

<script lang="ts">
import { Component, Inject, Vue, Provide } from "vue-property-decorator";
import { Client } from "colyseus.js";
import { EducatorAPI } from "@port-of-mars/client/api/educator/request";
import Countdown from "@port-of-mars/client/components/global/Countdown.vue";
import HelpPanel from "@port-of-mars/client/components/lobby/HelpPanel.vue";
import Students from "@port-of-mars/client/components/educator/dashboard/Students.vue";
import Groups from "@port-of-mars/client/components/educator/dashboard/Groups.vue";
import Reports from "@port-of-mars/client/components/educator/dashboard/Reports.vue";
import Messages from "@port-of-mars/client/components/global/Messages.vue";
import { ClassroomData } from "@port-of-mars/shared/types";

@Component({
  components: {
    Countdown,
    HelpPanel,
    Messages,
    Students,
    Groups,
    Reports,
  },
})
export default class TeacherDashboard extends Vue {
  @Inject() readonly $client!: Client;
  @Provide() educatorApi = new EducatorAPI(this.$store, this.$ajax);

  dashboardTabs = 0;
  classroomDescriptor = "";
  descriptorErrorMessage = "";
  descriptorState: boolean | null = null;

  classrooms: ClassroomData[] = [];
  selectedClassroom: ClassroomData | null = null;

  checkDescriptorForm() {
    const form = this.$refs.form as HTMLFormElement | undefined;
    if (!form) {
      console.error("Form is not available");
      return false;
    }
    const valid = form.checkValidity();
    this.descriptorState = valid;
    return valid;
  }

  handleDescriptorOk(modalType: string, bvModalEvent: { preventDefault: () => void }) {
    if (!this.checkDescriptorForm()) {
      bvModalEvent.preventDefault();
    } else {
      const isDuplicate = this.classrooms.some(
        classroom => classroom.descriptor === this.classroomDescriptor
      );
      if (isDuplicate) {
        this.descriptorState = false;
        this.descriptorErrorMessage = "A classroom with this name already exists";
        bvModalEvent.preventDefault();
        return;
      } else if (this.classroomDescriptor.length > 20) {
        this.descriptorState = false;
        this.descriptorErrorMessage = "Invalid name. Please try again.";
        bvModalEvent.preventDefault();
        return;
      } else {
        this.handleDescriptorSubmit(modalType);
      }
    }
  }

  handleDescriptorSubmit(modalType: string) {
    if (!this.checkDescriptorForm) {
      console.error("Descriptor form is not completed");
      return;
    } else if (modalType === "rename") {
      this.renameClassroom();
      this.$nextTick(() => {
        this.$bvModal.hide("rename-classroom-modal");
      });
    } else {
      this.addClassroom();
      this.$nextTick(() => {
        this.$bvModal.hide("add-classroom-modal");
      });
    }
  }

  resetDescriptorModal() {
    this.classroomDescriptor = "";
    this.descriptorState = null;
  }

  async addClassroom() {
    if (!this.classroomDescriptor) {
      console.error("Empty classroom descriptor");
      return;
    }
    try {
      await this.educatorApi.createClassroom(this.classroomDescriptor);
      await this.fetchClassrooms();
      this.classroomDescriptor = "";
      console.log("Added new classroom successfully");
    } catch (e) {
      console.error("Failed to add a new classroom:", e);
    }
  }

  async deleteClassroom() {
    if (this.classrooms.length === 0) {
      return;
    }
    if (this.selectedClassroom) {
      try {
        await this.educatorApi.deleteClassroom(this.selectedClassroom.id);
        await this.fetchClassrooms();
        console.log("Deleted classroom successfully");
      } catch (e) {
        console.error("Failed to delete classroom:", e);
      }
    }
  }

  async renameClassroom() {
    if (!this.classroomDescriptor) {
      console.error("Empty classroom descriptor");
      return;
    }
    if (this.selectedClassroom) {
      try {
        await this.educatorApi.updateClassroom(this.selectedClassroom.id, this.classroomDescriptor);
        this.classrooms = await this.educatorApi.getClassrooms();
        console.log("Classroom updated successfully");
        this.classroomDescriptor = "";
        this.selectClassroom(this.selectedClassroom.id);
      } catch (e) {
        console.error("Failed to rename classroom", e);
      }
    }
  }

  selectClassroom(classroomId: number) {
    const classroom = this.classrooms.find(c => c.id === classroomId) || null;
    if (classroom) {
      this.selectedClassroom = classroom;
      this.dashboardTabs = 0;
      console.log("Selected Classroom:", this.selectedClassroom);
    }
  }

  async fetchClassrooms() {
    try {
      this.classrooms = await this.educatorApi.getClassrooms();
      this.dashboardTabs = 0;
      if (this.classrooms.length > 0) {
        this.selectedClassroom = this.classrooms[0];
      }
    } catch (e) {
      console.error("Failed to fetch classrooms:", e);
    }
  }

  async created() {
    await this.fetchClassrooms();
  }
}
</script>

<style lang="scss" scoped>
.classrooms {
  max-height: 43rem;
  overflow-x: hidden !important;
  overflow-y: auto;
}
.classrooms::-webkit-scrollbar {
  display: none;
}

.icon {
  vertical-align: top !important;
  font-size: 2rem;
}
</style>
