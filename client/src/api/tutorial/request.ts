import {TradeData} from "shared/types";
import { initialStoreState } from '@/store/state';
import { GameRequestAPI } from "@/api/game/request";
import * as _ from "lodash";

export class TutorialAPI extends GameRequestAPI {
    private store!:any;
    private stateStack:Array<any> = []

    constructor(){
        super();
    }

    connect(store:any){
        this.store = store;
    }

    public apply(){
        this.store.replaceState(_.cloneDeep(initialStoreState));
        
        for(const state of this.stateStack){
            for(const [command,value] of Object.entries(state)){
                this.store.commit(command,value);
                
            }
        }
    }


    public statePush(state:any){
       if(state != undefined){
            
            for(const [command,value] of Object.entries(state)){
                this.store.commit(command,value);
            }

            //delete state.CREATE_NOTIFICATION;
            this.stateStack.push(state);
       }

       
    }

    public statePop(count:any){
        
        for(let i = 0; i < count; i++){
            this.stateStack.pop();
        }
        
        this.apply();
    }


    public sendChatMessage(message:String){
        this.store.commit('ADD_TO_CHAT',{
            message,
            role:this.store.state.role,
            dateCreated: new Date().getTime(),
            round:0
        })
    }

    count:number= 1;
    public sendTradeRequest(tradePackage:TradeData){
        this.store.commit('ADD_TO_TRADES',{
            id:`mock-trade-${this.count}`,
            trade:tradePackage,
        })
        this.count++;
    }

    public acceptTradeRequest(id:string){
        this.store.commit('REMOVE_FROM_TRADES',{
            id,
        });
    }

    public rejectTradeRequest(id:string){
        this.store.commit('REMOVE_FROM_TRADES',{
            id,
        });
    }

}