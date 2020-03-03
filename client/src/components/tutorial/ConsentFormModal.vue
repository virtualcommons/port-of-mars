<template>
    <BModal
        class="consent-form-modal"
        size="lg"
        centered
        title="Consent Form"
        hide-footer
        :header-bg-variant="headerBgVariant"
        :header-text-variant="headerTextVariant"
        :no-close-on-backdrop="false"
        :no-close-on-esc="false"
    >
        <template v-slot:modal-title>
            <code><b>CONSENT FORM</b></code>
        </template>
        <div class="d-block text-center">
            <p>Dear Participant,</p>

            <p>
                I am a professor in the School of Sustainability at Arizona State University. 
                I am conducting experiments that investigate how people think, act, and make decisions.
                This research is part of the Interplanetary Research Initiative at Arizona State University.
            </p>

            <p>
                I am requesting your participation, which will involve participating in a game tournament. 
                The game will take a maximum of 60 minutes. The tournament has four rounds to determine the Mars Madness
                champion, and if you qualify for another round, such a game will take another hour at alater day with a 
                special invitation. Your participation in this study is voluntary. <code><b>You must be 18 orolder to participate 
                in the study.</b></code> If you choose not to participate or to withdraw from the study at any time, there will be 
                no penalty; it will not affect your compensation for participation up to thatpoint.
            </p>

            <p>
                During the game you can chat with other participants. By signing this consent form you consent to:
                <ul>
                    <li>Abstain from personal attacks or harassment</li>
                    <li>Will not use profanity or offensive language</li>
                </ul>
            </p>

            <p>
                For participation in this study you may receive extra credit if your instructor of one of the 
                participating classes has made the participation in this event an extra credit opportunity. Those 
                who qualify for the championship round will be invited to have lunch with astronaut in residence,
                Catherine Coleman. The winner of the Mars Madness championship round will be able to create an 
                event card for the next edition of Mars Madness.
            </p>

            <p>
                Society may benefit from this research because an understanding of how people make decisions can 
                help us to design regulations that sustain the use of shared resources, in this experiment in a 
                colony on Mars.  You may benefit from this experience because you learn something about how an 
                experiment is designed and conducted, what issues are of interest to social scientists and space 
                research, and how your own cognitive abilities come into play in decision making situations. 
                There are no foreseeable risks or discomforts to your participation.
            </p>

            <p>
                The results of the research study may be published, but your name will not be used. Your 
                responses will be confidential. However, due to the group nature of this study, complete 
                confidentiality cannot be guaranteed. We contact your instructor that you have participated, 
                if your instructor asked us to do so for an extra credit assignment. We also keep track who 
                moves to next rounds. We delete personal information such as your email address from our database 
                after the tournament is completed.
            </p>

            <p>If you have any questions concerning the research study, contact me at Marco.Janssen@asu.edu.</p>
            
            <p>Sincerely,</p>
            <p>Dr. Marco Janssen</p>

            <p>By clicking below you are giving consent to participate in the above study.</p>

            <button @click="$emit('grant-consent')">Grant Consent</button>
            <button @click="$emit('deny-consent')">Deny Consent</button>

            <p>This research has been reviewed and approved by the Social Behavioral IRB. You may talk to them at 
               (480) 965-6788 or by email at research.integrity@asu.edu if: 
               <ul>
                   <li>Your questions, concerns, or complaints are not being answered by the research team.</li>
                   <li>You cannot reach the research team.</li>
                   <li>You want to talk to someone besides the research team.</li>
                   <li>You have questions about your rights as a research participant.</li>
                   <li>You want to get information or provide input about this research.</li>
               </ul>
            </p>
        </div>
    </BModal>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { BModal } from 'bootstrap-vue';

@Component({
    components: {
        BModal
    }
})

export default class ConsentFormModal extends Vue {
    variants = [
        'primary',
        'secondary',
        'success',
        'warning',
        'danger',
        'info',
        'light',
        'dark'
    ];

    headerBgVariant: string = 'dark';
    headerTextVariant: string = 'light';
    bodyBgVariant: string = 'dark';
    bodyTextVariant: string = 'light';

    consentGranted: string = '';

    async getConsent() {}

    async grantConsent() {
        alert('You granted consent.');
        this.$emit('grant-consent');
    }

    async denyConsent() {
        alert('You denied consent.');
        this.$emit('deny-consent')
    }

}

</script>

<style scoped></style>