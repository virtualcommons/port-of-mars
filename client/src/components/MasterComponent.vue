<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import store from "@/store";

    @Component
    export default class Master extends Vue{
        private role:String;
        private roundCount:number;

        constructor(){
            super();
            this.role = "Researcher";
            this.roundCount = 11;
        }
    }
</script>