<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 d-flex flex-column">
    <div class="p-3 h-100">
      <b-row class="h-100 m-0">
        <b-col class="mh-100 p-2">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="header-nowrap">Manage Teachers</h4>
            <div>
              <b-button variant="success" class="mr-2" @click="showAddTeacherModal"
                >Add Teacher</b-button
              >
            </div>
          </div>

          <div class="h-100-header w-100 content-container">
            <b-table
              dark
              sticky-header
              class="h-100 m-0 custom-table"
              style="max-height: none"
              :fields="fields"
              :items="teachers"
            >
              <template #cell(name)="data">
                {{ data.item.name }}
              </template>

              <template #cell(email)="data">
                {{ data.item.email }}
              </template>

              <template #cell(actions)="data">
                <b-button variant="primary" @click="confirmDeleteTeacher(data.item)"
                  >Delete</b-button
                >
              </template>
            </b-table>
          </div>
        </b-col>
      </b-row>
    </div>

    <!-- Add Teacher Modal -->
    <b-modal
      id="add-teacher-modal"
      centered
      title="Add New Teacher"
      body-bg-variant="dark"
      header-bg-variant="dark"
      header-class="pb-0 border-bottom-0"
      footer-class="pt-0 border-top-0"
      footer-bg-variant="dark"
      cancel-variant="outline-secondary"
      okTitle="Add Teacher"
      @ok="addTeacher"
    >
      <b-form>
        <b-form-group label="Username" label-for="teacher-username-input">
          <b-form-input
            id="teacher-username-input"
            v-model="newTeacher.username"
            required
            placeholder="Enter teacher username"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Teacher Name" label-for="teacher-name-input">
          <b-form-input
            id="teacher-name-input"
            v-model="newTeacher.name"
            required
            placeholder="Enter teacher name"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Teacher Email" label-for="teacher-email-input">
          <b-form-input
            id="teacher-email-input"
            v-model="newTeacher.email"
            required
            type="email"
            placeholder="Enter teacher email"
          ></b-form-input>
        </b-form-group>
      </b-form>
    </b-modal>

    <!-- Show Password Modal -->
    <b-modal
      id="show-password-modal"
      centered
      title="Teacher Password"
      body-bg-variant="dark"
      header-bg-variant="dark"
      header-class="pb-0 border-bottom-0"
      footer-class="pt-0 border-top-0"
      footer-bg-variant="dark"
      ok-title="Close"
      @ok="closePasswordModal"
    >
      <span
        >Your password is: <b>{{ newTeacherPassword }}</b></span
      >
      <br />
      <span>Please store it securely. You will not be able to view it again.</span>
    </b-modal>

    <!-- Delete Teacher Modal -->
    <b-modal
      id="delete-teacher-modal"
      centered
      title="Delete Confirmation"
      body-bg-variant="dark"
      header-bg-variant="dark"
      header-class="pb-0 border-bottom-0"
      footer-class="pt-0 border-top-0"
      footer-bg-variant="dark"
      cancel-variant="outline-secondary"
      okTitle="Confirm"
      @ok="deleteTeacher"
    >
      <span>Are you sure you want to delete this teacher? This action cannot be undone.</span>
    </b-modal>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { TeacherData } from "@port-of-mars/shared/types";
import { EducatorAPI } from "@port-of-mars/client/api/educator/request";

@Component({})
export default class Educator extends Vue {
  teachers: TeacherData[] = [];
  newTeacher = {
    username: "",
    name: "",
    email: "",
  };
  newTeacherPassword: string | null = null;
  selectedTeacher: TeacherData | null = null;

  educatorApi = new EducatorAPI(this.$store, this.$ajax);

  fields = [
    { key: "name", label: "Teacher Name" },
    { key: "email", label: "Email" },
    { key: "actions", label: "Actions", class: "text-center" },
  ];

  async created() {
    await this.fetchTeachers();
  }

  async fetchTeachers() {
    try {
      this.teachers = await this.educatorApi.getTeachers();
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
    }
  }

  showAddTeacherModal() {
    this.newTeacher = { username: "", name: "", email: "" };
    this.$bvModal.show("add-teacher-modal");
  }

  async addTeacher() {
    if (!this.newTeacher.username || !this.newTeacher.name || !this.newTeacher.email) {
      console.error("Username, name, and email are required");
      return;
    }
    try {
      const newTeacher = await this.educatorApi.addTeacher(this.newTeacher);
      this.newTeacherPassword = newTeacher.password;

      await this.fetchTeachers();

      this.$bvModal.show("show-password-modal");

      console.log("Added new teacher successfully");
    } catch (error) {
      console.error("Failed to add teacher:", error);
    }
  }

  confirmDeleteTeacher(teacher: TeacherData) {
    this.selectedTeacher = teacher;
    this.$bvModal.show("delete-teacher-modal");
  }

  async deleteTeacher() {
    if (!this.selectedTeacher) return;
    try {
      await this.educatorApi.deleteTeacher(this.selectedTeacher.teacherId);
      await this.fetchTeachers();
      console.log("Deleted teacher successfully");
    } catch (error) {
      console.error("Failed to delete teacher:", error);
    } finally {
      this.selectedTeacher = null;
    }
  }

  closePasswordModal() {
    this.newTeacherPassword = null;
  }
}
</script>
