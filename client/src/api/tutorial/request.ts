import {TradeData, AccomplishmentData, ResourceAmountData, Resource} from "shared/types";
import { initialStoreState, defaultInventory } from '@/store/state';
import { GameRequestAPI } from "@/api/game/request";
import * as _ from "lodash";
import {Store} from 'vuex/types/index';
import {State} from '@/store/state';
import {StateTransform} from '@/types/tutorial';


export class TutorialAPI extends GameRequestAPI {
    private store!:Store<State>;
    private stateStack:Array<StateTransform[]> = []
    private isTaskComplete = true;

    constructor(){
        super();
    }

    connect(store:any){
        this.store = store;
    }

    public apply(){
        this.store.replaceState(_.cloneDeep(initialStoreState));

        if(this.stateStack.length == 0){
            this.isTaskComplete = true;
        }
        
        for(const state of this.stateStack){
            
            for(const commandSet of state){
                for(const [command,value] of Object.entries(commandSet)){
                    if(command=='required'){
                        this.isTaskComplete = !value;
                    }
                    else{
                        this.isTaskComplete = true;
                        this.store.commit(command,value);
                    }
                }
            }
        }
    }

    get forcePause(){
        return this.isTaskComplete;
    }

    public resetGame(){
        this.isTaskComplete = true; 
    }


    public statePush(state:Array<StateTransform>|undefined){
       if(state != undefined){
            
        
            for(const commandSet of state){
                for(const [command,value] of Object.entries(commandSet)){
                    
                    if(command=='required'){
                        this.isTaskComplete = !value;
                    }
                    else{
                        this.store.commit(command,value);
                    }
                }
            }

            this.stateStack.push(state);
            
       }

       
    };

    public statePop(){
        this.stateStack.pop();
        
        this.apply();
    };


    public sendChatMessage(message:String){
        this.store.commit('ADD_TO_CHAT',{
            message,
            role:this.store.state.role,
            dateCreated: new Date().getTime(),
            round:0
        });
        this.isTaskComplete = true;
    };

    count:number= 1;
    public sendTradeRequest(tradePackage:TradeData){
        this.store.commit('ADD_TO_TRADES',{
            id:`mock-trade-${this.count}`,
            trade:tradePackage,
        })
        this.count++;

        this.isTaskComplete = true;
    };

    public acceptTradeRequest(id:string){
        this.store.commit('REMOVE_FROM_TRADES',{
            id,
        });
    };

    public rejectTradeRequest(id:string){
        this.store.commit('REMOVE_FROM_TRADES',{
            id,
        });
    };

    public purchaseAccomplishment(accomplishment:AccomplishmentData){
        this.store.commit('DISCARD_ACCOMPLISHMENT',{
            id:accomplishment.id,
            role:accomplishment.role
        });
        this.isTaskComplete = true;
    };

    public discardAccomplishment(id: number){
        this.store.commit('DISCARD_ACCOMPLISHMENT',{
            id,
            role:'Researcher'
        });

        this.isTaskComplete = true;
    };

    public deleteNotification(id: number){
        this.store.commit('CLEAR_NOTIFICATION',{
            data:id,
            role:`Researcher`,
        })
    };


    public saveGiveResources(resources: ResourceAmountData){
        // this.store.commit('SET_GIVE_RESOURCES', resources);
        const correctGive = defaultInventory();
        correctGive.science =2;
        correctGive.government = 1;

        for(const [resource, amt] of Object.entries(resources)){
            if(correctGive[resource as Resource] != amt) return false;
        }

        this.isTaskComplete = true;
        return true;
    }

    public saveGetResources(resources: ResourceAmountData){
        //this.store.commit('SET_GET_RESOURCES', resources);
        const correctGet = defaultInventory();
        correctGet.culture =3;

        for(const [resource, amt] of Object.entries(resources)){
            if(correctGet[resource as Resource] != amt) return false;
        }

        this.isTaskComplete = true;
        return true;
    }

    public saveTradePartner(name: string){
        if(name == 'Curator') {
            this.isTaskComplete = true;
            return true;
        }
        return false;
    }

    public investTimeBlocks():void {};
    public setPlayerReadiness(): void {};
}