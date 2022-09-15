<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { isEmailValid, isSubmitDisabled } from "~/composables/useValidation";
import { loginWithEmail } from "~/composables/useAuth";
const email = ref("");
const form = reactive({ feedback: "", isValid: false });

const jwtCookie = useCookie("pom_authtoken", { httpOnly: true });

watch(
  () => email.value,
  (email) => {
    if (isEmailValid(email)) {
      form.feedback = "";
      form.isValid = true;
    } else {
      form.feedback = "Invalid email";
      form.isValid = false;
    }
  }
);

const postLoginForm = async (e: Event) => {
  console.log(email);
  e.preventDefault();
  const jwt = await loginWithEmail(email.value);
  try {
    if (jwt) {
      console.log("got jwt from login: ", jwt);
      jwtCookie.value = jwt;
      await useRouter().push("/consent");
    }
  } catch (error) {
    console.log("error: " + email.toString());
  }
};
</script>

<template>
  <main>
    <div class="flex justify-center items-center w-full h-screen bg-login">
      <div
        class="flex flex-col rounded-lg justify-center items-center h-4/6 w-5/6 bg-slate-900/50"
      >
        <form @submit="postLoginForm">
          <h1
            class="font-semibold font-sans text-white leading-tight text-2xl my-2"
          >
            Sign In to Port of Mars
          </h1>
          <label class="label">
            <span class="label-text">Your Email</span>
          </label>
          <label class="input-group">
            <span>Email</span>
            <input
              required
              v-model="email"
              type="text"
              placeholder="info@site.com"
              class="input input-bordered w-full"
            />
          </label>
          <span class="text-red-800" v-if="form.feedback">{{
            form.feedback
          }}</span>
          <input
            type="submit"
            value="Register"
            class="btn btn-wide bg-emerald-800/70 hover:bg-emerald-500/50 my-2"
            :disabled="isSubmitDisabled(form.isValid)"
          />
        </form>
      </div>
    </div>
  </main>
</template>
