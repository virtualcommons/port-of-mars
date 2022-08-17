<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
const hasScrolledToBottom = ref(false);
const name = ref("");
const email = ref("");
const consent = ref(false);
const feedback = reactive({ name: "", email: "" });

const form = reactive({ name, email, consent });

watch(
  () => email.value,
  (email) => {
    validateEmail(email);
  }
);

watch(
  () => name.value,
  (name) => {
    validateName(name);
  }
);

const emit = defineEmits(["verify-email"]);

function validateName(name: string) {
  return name === null || name === undefined || name === ""
    ? (feedback.name = "Name cannot be an empty field.")
    : (feedback.name = "");
}

// validate email input with regex
function validateEmail(email: string) {
  const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  console.log("test email: ", emailFormat.test(email));
  if (!emailFormat.test(email)) {
    feedback.email = "Invalid email";
  } else {
    feedback.email = "";
  }
}

function onScroll(e: Event) {
  const [scrollTop, clientHeight, scrollHeight] = [
    e.target,
    e.target,
    e.target,
  ];
  if (scrollTop + clientHeight >= scrollHeight) {
    console.log("reached the bottom of the div");
    hasScrolledToBottom.value = true;
  }
}

function onSubmit(e: Event) {
  console.log(form);
  e.preventDefault();
  emit("verify-email", form);
  // TODO: make api call to submit form and send verification email
}

function grantConsent() {
  consent.value = true;
}

function denyConsent() {
  consent.value = false;
  // TODO: make api call then reroute to landing page (or stay here?)
}
</script>

<template>
  <main>
    <div
      class="grid grid-cols-2 gap-3 items-stretch w-full h-screen p-5 bg-amber-900/20"
    >
      <div
        class="p-5 h-5/6 overflow-y-auto bg-stone-800/50 text-white"
        @scroll="onScroll"
      >
        <h1 class="font-semibold leading-tight text-xl my-2">
          Port of Mars Consent Form and Email Registration
        </h1>
        <div class="space-y-5">
          <p>Dear Participant,</p>
          <p>
            I am a professor in the School of Sustainability at Arizona State
            University. I am conducting experiments that investigate how people
            think, act, and make decisions. This research is part of the
            <a href="https://interplanetary.asu.edu/">
              Interplanetary Initiative
            </a>
            at Arizona State University.
          </p>
          <p>
            I am requesting your participation in a tournament consisting of
            several rounds of games. Each game in the tournament will take no
            more than 60 minutes on average. The top ranking players in each
            round will qualify for the next round and will receive an email
            invitation to participate in another game on a later day. Your
            participation in this study is strictly voluntary and you may choose
            to not participate or to withdraw from the study at any time with no
            penalty; it will not affect your compensation for participation up
            to that point.
          </p>
          <p>
            <mark>
              You must be 18 or older and a current undergraduate student at
              Arizona State University to participate in the study.
            </mark>
          </p>
          <p>
            During the game you can chat with other participants. By signing
            this consent form, you consent to:
          </p>
          <ul>
            <li>Abstain from personal attacks or harassment</li>
            <li>
              Abstain from using profanity or offensive language when
              communicating with your fellow participants
            </li>
          </ul>
          <p>
            For participation in this study you may receive extra credit if you
            are in a class with a participating instructor.
          </p>
          <p>
            Those who qualify for the championship round will receive a limited
            edition Port of Mars t-shirt, and the winner(s) of the Mars Madness
            tournament will be eligible to receive $1000. In the event of a tie,
            the prize will be split equally between the tied participants.
          </p>
          <p>
            Society may benefit from this research because an understanding of
            how people make decisions can help us to design regulations that
            sustain the use of shared resources, in this experiment in a colony
            on Mars. You may benefit from this experience because you learn
            something about how an experiment is designed and conducted, what
            issues are of interest to social scientists and space research, and
            how your own cognitive abilities come into play in decision making
            situations. There are no foreseeable risks or discomforts to your
            participation.
          </p>
          <p>
            The results of the research study may be published, but your name
            will not be used. Your responses will be confidential. However, due
            to the group nature of this study, complete confidentiality cannot
            be guaranteed. If you are participating in this study as part of a
            class for extra credit, we may inform your instructor that you have
            participated, for example. We also have to keep track of which
            players will move on to next rounds. We will remove personal
            information such as your email address from our database after the
            tournament has been completed and ensure that only anonymized
            participant identifiers are associated with your experiment data.
          </p>
          <p>
            If you have any questions concerning the research study, please
            contact
            <a href="mailto:Marco.Janssen@asu.edu">Marco.Janssen@asu.edu</a>.
          </p>

          <p class="justify-self-start">Sincerely,</p>
          <p class="justify-self-start">Dr. Marco Janssen</p>
        </div>
      </div>
      <div class="p-5 text-white">
        <div
          tabindex="0"
          :class="consent ? 'collapse-open' : 'collapse-close'"
          class="collapse"
        >
          <div class="collapse-title text-xl font-medium space-x-5">
            <button
              class="btn"
              @click="grantConsent"
              :disabled="!hasScrolledToBottom"
            >
              Grant Consent
            </button>
            <button class="btn" @click="denyConsent">Deny Consent</button>
          </div>
          <div class="flex flex-col collapse-content">
            <form class="flex flex-col space-y-2" @submit="onSubmit">
              <p>Register</p>
              <label class="label">
                <span class="label-text">What is your name?</span>
              </label>
              <input
                required
                v-model="form.name"
                type="text"
                placeholder="Full Name"
                class="input input-bordered w-full max-w-xs"
              />
              <span v-if="feedback.name">{{ feedback.name }}</span>
              <label class="label">
                <span class="label-text">What is your email?</span>
              </label>
              <input
                required
                v-model="form.email"
                type="text"
                placeholder="Email"
                class="input input-bordered w-full max-w-xs"
              />
              <span v-if="feedback.email">{{ feedback.email }}</span>
              <!-- TODO: disable verify email submit during certain cases -->
              <input type="submit" value="Verify Email" class="btn my-5" />
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
