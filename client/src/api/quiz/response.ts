import { Room } from 'colyseus.js';

import { Schema } from '@colyseus/schema';
import { TStore } from 'vue/types/vue';

import {QuizResponses} from 'shared/quizLobby/responses';

type Schemify<T> = T & Schema;

export function applyQuizServerResponses<T>(room: Room, store: TStore){
    room.onMessage((msg:QuizResponses) => {
        switch(msg.kind){
            case 'quiz-lobby':
                console.log(msg.message);
                store.commit('SET_QUIZ_QUESTIONS',msg.questions);
                break;
            case 'graded-quiz':
                store.commit('GET_QUIZ_RESULTS',msg.quizResults);
                break;
            default:break;
        }
    })
}