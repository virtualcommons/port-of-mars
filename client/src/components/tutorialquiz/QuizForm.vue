<template>
    <div class="quiz-question-container">
        <div class="quiz-question-title">
            <p>{{question}}</p>
        </div>
        <div class="quiz-question-form-container">
            <form class="quiz-question-form" v-on:submit.prevent="handleUpdate(optionSelected,name)">
                <div class="quiz-questions" v-for="(option,index) in options" :key="index">
                    <input type="radio" v-model="optionSelected" name="optionSelected" :value="index" >{{option}}<br>
                </div>
                <div class="quiz-buttons">
                    <button @click='name=-1' class="prev-button">Previous</button>
                    <button @click='name=1' class="next-button">Next Question</button>
                    <button v-show='index == 2' @click='name=2' class="next-button">Submit Quiz</button>
                </div>
            </form> 
        </div> 
    </div>
</template>

<script lang='ts'>
import { Vue, Component,Prop } from "vue-property-decorator";

@Component({})
export default class QuizForm extends Vue{
    optionSelected = -1;
    name = 0;

    @Prop({default:''})question

    @Prop({default: ()=>  []})options;

    @Prop({default:-1})index;

    @Prop({default:function(id,name){
        return function(){};
    }})handleUpdate;

}
</script>


<style scoped>
.quiz-question-container{
    background-color: var(--space-white);
    border-radius: 0.5rem;
    height:27rem;
    color:black;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    overflow:hidden;
}

.quiz-question-title{
    text-align: center;
    width:100%;
    height: auto;
    align-self: flex-start;
    font-size: 1.4rem;
    font-weight: bold;
    margin-top:1rem;
}

.quiz-question-form-container{
    width:100%;
    height: auto;
    align-self: flex-end;
}


.quiz-questions{
    width:95%;
    margin:auto;
    margin-top:1rem;
}

.quiz-buttons{
    margin-top:4rem;
    display: flex;
    justify-content: space-between;
}

button{
    border: none;
    background: none;
}

.next-button{
    padding:0.5rem;
    border-top-left-radius: 0.5rem;
    background-color:rgb(105, 224, 105);
}

.prev-button{
    padding:0.5rem;
    border-top-right-radius: 0.5rem;
    background-color:rgb(224, 105, 105);
}
</style>