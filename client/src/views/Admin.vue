<template>
  <b-container class="h-100 p-0 m-0 bg" fluid>
    <b-row no-gutters class="h-100 w-100">
      <!-- admin sidebar -->
      <b-nav pills class="sidebar" vertical style="display: block; position: fixed; width: 100%; max-width:145px;">
        <b-nav-item class="nav-link" active-class="active" to="/admin/overview">
          Overview
        </b-nav-item>
        <b-nav-item class="nav-link" active-class="active" to="/admin/rooms">
          Rooms
        </b-nav-item>
        <b-nav-item class="nav-link" active-class="active" to="/admin/reports">
          Reports
        </b-nav-item>
        <b-nav-item class="nav-link" active-class="active" to="/admin/settings">
          Settings
        </b-nav-item>
      </b-nav>
      <router-view class="h-100 backdrop" style="position: relative; margin-left: 145px !important;"></router-view>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Admin extends Vue {
}
</script>

<style lang="scss" scoped>
.overflow-auto {
  overflow: auto;
}

.sidebar-wrapper {
  background-color: $dark;
  padding-right: 0;
}

.sidebar {
  border: none;
  .nav-link {
    color: #918d8d;
    &.active {
      background-color: $primary;
      color: #fff;
    }
  }
}
</style>
