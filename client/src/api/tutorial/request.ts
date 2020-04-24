import {
  TradeData,
  AccomplishmentData,
  ResourceAmountData,
  Resource,
} from '@port-of-mars/shared/types';
import {
  initialStoreState,
  defaultInventory,
} from '@port-of-mars/client/store/state';
import { GameRequestAPI } from '@port-of-mars/client/api/game/request';
import * as _ from 'lodash';
import { Store } from 'vuex/types/index';
import { State } from '@port-of-mars/client/store/state';
import { StateTransform } from '@port-of-mars/client/types/tutorial';

export class TutorialAPI extends GameRequestAPI {
  private store!: Store<State>;
  private stateStack: Array<StateTransform[]> = [];
  private isTaskComplete = true;
  private validationObject: any = {};
  private requiredObject!: StateTransform;
  
  private storeSubscription!:any;
  private modalIsOpen:boolean = false;

  constructor() {
    super();
  }

  connect(store: any) {
    this.store = store;
  }

  //we can watch the store for when it updates.
  public activateStoreSubscription(ref:any){
    this.storeSubscription = this.store.subscribe((mutation, state) => {
      
      if(mutation.type == 'SET_MODAL_VISIBLE'){
        if(state.userInterface.modalView.visible && !this.modalIsOpen){
          
          this.completedGeneralClick();
          
        /*this is necessary because vue preforms dom updates asynchronously. Without it,
          as far the the button is concerned, the above call to 'completedGeneralClick' hasn't run...*/
          setTimeout(()=> ref.nextButton[0].click(), 0);
          
          this.modalIsOpen = true;
        }
      }

      if(mutation.type == 'SET_MODAL_HIDDEN'){
        if(this.modalIsOpen){
          this.modalIsOpen = false;
        }
      }
    });
  }

  public killSubscription(){
    this.storeSubscription.unsubscribe();
  }

  public apply() {
    this.store.replaceState(_.cloneDeep(initialStoreState));

    if (this.stateStack.length == 0) {
      this.isTaskComplete = true;
    }

    for (const state of this.stateStack) {
      for (const commandSet of state) {
        for (const [command, value] of Object.entries(commandSet)) {
          switch (command) {
            case 'required':
              this.isTaskComplete = !value;
              break;
            case 'validationObject':
              this.validationObject = value;
              break;
            default:
              this.isTaskComplete = true;
              this.store.commit(command, value);
              break;
          }
        }
      }
    }
  }

  get forcePause() {
    return this.isTaskComplete;
  }

  public resetState() {
    this.stateStack = [];
    this.apply();
  }

  public statePush(state: Array<StateTransform> | undefined) {
    if (state != undefined) {
      for (const commandSet of state) {
        for (const [command, value] of Object.entries(commandSet)) {
          switch (command) {
            case 'required':
              this.isTaskComplete = !value;
              this.requiredObject = commandSet;
              break;
            case 'validationObject':
              this.validationObject = value;
              break;
            default:
              this.store.commit(command, value);
              break;
          }
        }
      }

      this.stateStack.push(state);
    }
  }

  public statePop() {
    this.stateStack.pop();

    this.apply();
  }

  public completedGeneralClick() {
    this.isTaskComplete = true;
    this.requiredObject.required = false;
  }

  public sendChatMessage(message: String) {
    this.store.commit('ADD_TO_CHAT', {
      message,
      role: this.store.state.role,
      dateCreated: new Date().getTime(),
      round: 0,
    });
    this.isTaskComplete = true;

    //since they are tied by reference, this change will be reflected in the step array object
    this.requiredObject.required = false;
  }

  public openPlayerInfoModal() {
    this.store.commit('SET_MODAL_VISIBLE', {
      type: 'PlayerModal',
      data: {
        role: 'Researcher',
      },
    });

    this.isTaskComplete = true;
    this.requiredObject.required = false;
  }

  count: number = 1;
  public sendTradeRequest(tradePackage: TradeData) {
    this.store.commit('ADD_TO_TRADES', {
      id: `mock-trade-${this.count}`,
      trade: tradePackage,
    });
    this.count++;

    this.isTaskComplete = true;
    this.requiredObject.required = false;
  }

  public acceptTradeRequest(id: string) {
    this.store.commit('REMOVE_FROM_TRADES', {
      id,
    });
  }

  public rejectTradeRequest(id: string) {
    this.store.commit('REMOVE_FROM_TRADES', {
      id,
    });
  }

  public cancelTradeRequest(id: string) {
    this.store.commit('REMOVE_FROM_TRADES', {
      id,
    });
  }

  public purchaseAccomplishment(accomplishment: AccomplishmentData) {
    this.store.commit('DISCARD_ACCOMPLISHMENT', {
      id: accomplishment.id,
      role: accomplishment.role,
    });
    this.isTaskComplete = true;
    this.requiredObject.required = false;
  }

  public discardAccomplishment(id: number) {
    this.store.commit('DISCARD_ACCOMPLISHMENT', {
      id,
      role: 'Researcher',
    });

    this.isTaskComplete = true;
    this.requiredObject.required = false;
  }

  public saveGiveResources(resources: ResourceAmountData) {
    //;
    // const correctGive = defaultInventory();
    // correctGive.science =2;
    // correctGive.government = 1;

    for (const [resource, amt] of Object.entries(resources)) {
      if (this.validationObject[resource as Resource] != amt) return false;
    }

    this.isTaskComplete = true;
    this.requiredObject.required = false;
    //this.store.commit('TUTORIAL_SET_GIVE_RESOURCES', resources)
    return true;
  }

  public saveGetResources(resources: ResourceAmountData) {
    // const correctGet = defaultInventory();
    // correctGet.culture =3;

    for (const [resource, amt] of Object.entries(resources)) {
      if (this.validationObject[resource as Resource] != amt) return false;
    }

    this.isTaskComplete = true;
    this.requiredObject.required = false;
    //this.store.commit('TUTORIAL_SET_GET_RESOURCES', resources);
    return true;
  }

  public saveTradePartner(name: string) {
    if (this.validationObject.name == name) {
      this.isTaskComplete = true;
      //this.store.commit('TUTORIAL_SET_TRADE_PARTNER_NAME', name);
      this.requiredObject.required = false;
      return true;
    }
    return false;
  }

  // TOUR TRADE

  // public requestTrade(visible: boolean) {
  //     if (this.validationObject.visible == visible) {
  //         this.isTaskComplete = true;
  //         this.requiredObject.required = false;
  //         return true;
  //     }
  //     return false;
  // }

  public investTimeBlocks() {
    const pendingInventory = this.store.getters.player.pendingInvestments;
    for (const [resource, amt] of Object.entries(pendingInventory)) {
      if (this.validationObject[resource as Resource] != amt) return false;
    }
    this.isTaskComplete = true;
    this.requiredObject.required = false;
    return true;
  }
  public setPlayerReadiness(): void {}
}
