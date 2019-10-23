<template>
  <div class="card-investment">
    <div class='card-type'>
      Type
    </div>
    <div class='card-increment-and-decrement-holder'>
      <div class='investment-increment'>
        +
      </div>

      <div class='investment-decrement'>
        -
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component

export default class CardInvestment extends Vue {

  

}
</script>

<style scoped>
  .card-investment {
    height: 6rem;
    width: 10rem;
    border: 0.125rem solid #F5F5F5;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    text-align: center;
    overflow:hidden;
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
