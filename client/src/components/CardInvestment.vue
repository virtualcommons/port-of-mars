<template>
  <div class="card-investment">
    <div class='investment-options'>
      <div class='card-type'>
        Type
      </div>
      <div class='card-increment-and-decrement-holder'>
        <div class='investment-increment' @click="incrementInvestment">
          +
        </div>

        <div class='investment-decrement' @click="decrementInvestment">
          -
        </div>
      </div>
    </div>
    <div class='investment-amount'>
      <p>{{`${investmentName}:${investmentAmount}`}}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class CardInvestment extends Vue {
  @Prop({default:'ohDear'})
  private investmentName!:string;

  @Prop({default:0})
  private investmentAmount!:number;
  

  incrementInvestment(){
    this.$store.dispatch('changeLocalInvestment',
      {
        investmentName:this.investmentName,
        investmentAmount:this.investmentAmount+1,
      });
  }

  decrementInvestment(){
    if(this.investmentAmount > 0){
      this.$store.dispatch('changeLocalInvestment',
      {
        investmentName:this.investmentName,
        investmentAmount:this.investmentAmount-1,
      });
    }
    
  }

}
</script>

<style scoped>

  .investment-amount{
    color:white;
    text-align: center;
  }


  .investment-options {
    height: 7rem;
    width: 9.5rem;
    border: 0.125rem solid #F5F5F5;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    text-align: center;
    overflow:hidden;
    color:white;
  }


  .card-type{
    width:70%;
  }

  .card-increment-and-decrement-holder{
    width: 30%;
    height: 100%;
    border-left: 0.125rem solid #F5F5F5;
    
    display: flex;
    flex-direction: column;
    
    
  }

  .investment-increment{
    width: 100%;
    height:100%;
    margin: auto;
    padding-top: .6rem;
    border-bottom: 0.125rem solid #F5F5F5;
    
  }

  .investment-decrement{
    width: 100%;
    margin: auto;
    height: 100%;
    padding-top: .3rem;
  }

  .investment-increment:hover{
    background-color: orange;
    overflow: hidden;
  }
  .investment-decrement:hover{
    background-color: orange;
  }
</style>
