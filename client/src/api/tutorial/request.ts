import {
  TradeData,
  AccomplishmentData,
  ResourceAmountData,
  Resource,
  Role
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

export class TutorialAPI  {
  private store!: Store<State>;
  private stateStack: Array<StateTransform[]> = [];
  private isTaskComplete = true;
  private validationObject: any = {};
  private requiredObject!: StateTransform;

  connect(store: any) {
    this.store = store;
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

  public discardOption(cardInfo:any) {
    this.store.commit('DISCARD_ACCOMPLISHMENT', {
      id: cardInfo.data.cardData.id,
      role: 'Researcher',
    });

    this.isTaskComplete = true;
    this.requiredObject.required = false;
  }


  public investPendingTimeBlocks(investment:any) {
    this.store.commit('SET_PENDING_INVESTMENT_AMOUNT', investment);

    const pendingInventory = this.store.getters.player.pendingInvestments;
    for (const [resource, amt] of Object.entries(pendingInventory)) {
      if (this.validationObject[resource as Resource] != amt) return false;
    }
    this.isTaskComplete = true;
    this.requiredObject.required = false;
    return true;
  }


  public investTimeBlocks(){}


  public setPlayerReadiness(ready:boolean): void {
    if(ready){
      this.completedGeneralClick();
    }
  }


  //REFACTOR OF THE API SYSTEM

  //MODALS
  public setModalVisible(data: any){
    this.completedGeneralClick();
    this.store.commit('SET_MODAL_VISIBLE',data);
  }

  public setModalHidden(){
    this.store.commit('SET_MODAL_HIDDEN', null);
  }

  public toggleProfileMenu(currentlyVisble:boolean){
    this.store.commit(
      'SET_PROFILE_MENU_VISIBILITY',
      !currentlyVisble
    );
    this.completedGeneralClick();
  }

  //TRADES
  public setTradePlayerName(role: Role){
    this.store.commit('SET_TRADE_PLAYER_NAME', role);
  }

  public setTradePartnerName(name:string){
    this.store.commit('SET_TRADE_PARTNER_NAME', name as Role);

    if (this.validationObject.name == name) {
      this.isTaskComplete = true;
      this.requiredObject.required = false;
      return true;
    }
    return false;
    
  }

  public setTradeGetResources(resources:ResourceAmountData){
    this.store.commit('SET_GET_RESOURCES', resources);

    for (const [resource, amt] of Object.entries(resources)) {
      if (this.validationObject[resource as Resource] != amt) return false;
    }

    this.isTaskComplete = true;
    this.requiredObject.required = false;
    return true;
  }

  public setTradeGiveResources(resources: ResourceAmountData){
    this.store.commit('SET_SEND_RESOURCES', resources);

    for (const [resource, amt] of Object.entries(resources)) {
      if (this.validationObject[resource as Resource] != amt) return false;
    }

    this.isTaskComplete = true;
    this.requiredObject.required = false;
    return true;
  }


}



