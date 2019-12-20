<template>
    <div class="trade-resources">
        <p class="type-text">{{text}}</p>
        <div class="send-investments" v-for="(value,resource) in resources" :key="resource+1">
            <div>
                <img
                class="resource-icon"
                :src="require(`@/assets/iconsSVG/${resource}.svg`)"
                alt="Investment"
                />
            </div>

            <div>
                <input type="number" min="0" v-model.number="resources[resource]"  class="resource-amount"/>
            </div>
        </div>

        {{resourcesAmount}}
    </div>
</template>


<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import *  as _ from 'lodash';
import { ResourceAmountData } from "shared/types";
@Component({})
export default class TradeOptions extends Vue {
    @Prop({default:''})text;

    private resources:ResourceAmountData = {
        science:0,
        government:0,
        legacy:0,
        finance:0,
        culture:0,
    }

    get resourcesAmount(){
        this.resourceReader(this.resources);
        return;
    }

    @Prop()resourceReader;
  
}
</script>

<style scoped>
.type-text{
    text-align: left;
}

.resource-icon{
  width:2rem;
  margin: 0rem 0.2rem 0.2rem 0.2rem
}

.send-investments{
  display: inline-block;
  text-align: center;
}

.resource-amount{
    width: 3rem;
    margin:0.2rem;
}
</style>