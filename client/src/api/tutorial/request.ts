import {
  AccomplishmentData,
  Resource,
  ResourceAmountData,
  Role,
  TradeData,
} from "@port-of-mars/shared/types";
import {
  defaultPendingInvestment,
  initialStoreState,
  State,
} from "@port-of-mars/shared/game/client/state";
import { ChatMarsLogView, HUDLeftView, HUDRightView } from "@port-of-mars/shared/game/client/panes";
import * as _ from "lodash";
import { Store } from "vuex/types/index";
import { StateTransform } from "@port-of-mars/client/types/tutorial";
import { SfxManager } from "@port-of-mars/client/util";

export class TutorialAPI {
  count: number = 1;
  private store!: Store<State>;
  private stateStack: Array<StateTransform[]> = [];
  private isTaskComplete = true;
  private validationObject: any = {};
  private requiredObject!: StateTransform;
  private forwardButtonRef!: any;
  private sfx!: SfxManager;

  //This is used by Tutorial.vue to determine if the user can move forward
  get hasCompletedAction() {
    return this.isTaskComplete;
  }

  // Stubbed API methods not used in tutorial

  connect(store: any) {
    this.store = store;
  }

  registerRef(forwardButtonRef: any) {
    this.forwardButtonRef = forwardButtonRef;
  }

  setSfxManager(sfx: SfxManager): void {
    this.sfx = sfx;
  }

  resetBotWarning(): void {}

  setNextPhase(): void {}

  resetGame(): void {}

  /*
    This adds the sigular state transform it received to the state
    and adds it to the state stack for later use
  */
  public statePush(state: Array<StateTransform> | undefined) {
    if (state != undefined) {
      for (const commandSet of state) {
        for (const [command, value] of Object.entries(commandSet)) {
          switch (command) {
            case "required":
              //we want to set this to the opposite of whatever the required tag is.
              this.isTaskComplete = !value;
              this.requiredObject = commandSet;
              break;
            case "validationObject":
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

  /*
    This goes through the entire state stack and applies each action, in order.

    The main difference between replayState and statePush is that this runs through the entire
    stateStack array, where statePush just applies its current argument to the state.
  */
  public replayState() {
    //We work with a clean version of the state
    this.store.replaceState(_.cloneDeep(initialStoreState));

    if (this.stateStack.length == 0) {
      this.isTaskComplete = true;
    }

    for (const state of this.stateStack) {
      for (const commandSet of state) {
        for (const [command, value] of Object.entries(commandSet)) {
          switch (command) {
            /*we decided that, once you complete a required action,
              you shouldn't have to do it again. therefore, we don't care about
              the required tag or the vaildation object.
            */
            case "required":
              break;
            case "validationObject":
              break;
            default:
              this.store.commit(command, value);
              break;
          }
        }
      }
    }
    //at the end, we always want to be able to move forward.
    this.isTaskComplete = true;
  }

  //To completely reset the state, we simply empty the state stack
  public resetState() {
    this.stateStack = [];
    this.replayState();
  }

  //To remove the most recent addition, we remove it and replay the stack
  public statePop() {
    this.stateStack.pop();
    this.replayState();
  }

  public sendChatMessage(message: String) {
    this.store.commit("ADD_TO_CHAT", {
      message,
      role: this.store.state.role,
      dateCreated: new Date().getTime(),
      round: 0,
    });

    this.completedActionWithImplicitForward();
  }

  purchaseAccomplishment(accomplishment: AccomplishmentData): void {
    this.store.commit("PURCHASE_ACCOMPLISHMENT", {
      data: accomplishment,
      role: this.store.state.role,
    });
    this.store.commit("DISCARD_ACCOMPLISHMENT", {
      data: accomplishment.id,
      role: this.store.state.role,
    });
    this.store.commit("SET_VICTORY_POINTS", {
      data: 7,
      role: "Researcher",
    });
    this.completedActionWithImplicitForward();
  }

  discardAccomplishment(id: number): void {
    console.log("Discarding accomplishment: " + id);
    this.store.commit("DISCARD_ACCOMPLISHMENT", { id, role: this.store.state.role });
    this.completedActionWithImplicitForward();
  }

  //INVESTMENTS HANDLER
  public investPendingTimeBlocks(investment: any) {
    this.store.commit("SET_PENDING_INVESTMENT_AMOUNT", investment);

    const pendingInventory = this.store.getters.player.pendingInvestments;
    for (const [resource, amt] of Object.entries(pendingInventory)) {
      if (this.validationObject[resource as Resource] != amt) return false;
    }

    this.completedActionWithImplicitForward();
    return true;
  }

  public investTimeBlocks() {}

  //PLAYER READINESS HANDLER
  public setPlayerReadiness(ready: boolean): void {
    if (ready) {
      this.completedActionWithImplicitForward();
    }
  }

  //MODAL HANDLERS
  public setModalVisible(data: any) {
    this.store.commit("SET_MODAL_VISIBLE", data);
    this.completedActionWithImplicitForward();
  }

  public setModalHidden() {
    this.store.commit("SET_MODAL_HIDDEN", null);
  }

  public toggleProfileMenu(currentlyVisible: boolean) {
    this.store.commit("SET_PROFILE_MENU_VISIBILITY", !currentlyVisible);

    this.completedActionWithImplicitForward();
  }

  public setChatMarsLogView(view: ChatMarsLogView) {
    this.store.commit("SET_CHATMARSLOG_VIEW", view);
  }

  // OTHER UI

  public setHUDLeftView(view: HUDLeftView) {
    this.store.commit("SET_HUDLEFT_VIEW", view);
  }

  public setHUDRightView(view: HUDRightView) {
    this.store.commit("SET_HUDRIGHT_VIEW", view);
  }

  //TRADES
  public setTradePlayerName(role: Role) {
    this.store.commit("SET_TRADE_PLAYER_NAME", role);
  }

  public setTradePartnerName(name: string) {
    this.store.commit("SET_TRADE_PARTNER_NAME", name as Role);

    if (this.validationObject.name == name) {
      this.completedActionWithImplicitForward();
      return true;
    }
    return false;
  }

  //validate against the validation object that's passed in.
  public setTradeGetResources(resources: ResourceAmountData) {
    this.store.commit("SET_GET_RESOURCES", resources);

    for (const [resource, amt] of Object.entries(resources)) {
      if (this.validationObject[resource as Resource] != amt) return false;
    }

    this.completedActionWithImplicitForward();
    return true;
  }

  //validate against the validation object that's passed in.
  public setTradeGiveResources(resources: ResourceAmountData) {
    this.store.commit("SET_SEND_RESOURCES", resources);

    for (const [resource, amt] of Object.entries(resources)) {
      if (this.validationObject[resource as Resource] != amt) return false;
    }

    this.completedActionWithImplicitForward();
    return true;
  }

  public sendTradeRequest(tradePackage: TradeData) {
    this.store.commit("ADD_TO_TRADES", {
      id: `mock-trade-${this.count}`,
      trade: tradePackage,
    });
    this.count++;
    this.completedActionWithImplicitForward();
  }

  public acceptTradeRequest(id: string) {
    this.store.commit("REMOVE_FROM_TRADES", {
      id,
    });
  }

  public rejectTradeRequest(id: string) {
    this.store.commit("REMOVE_FROM_TRADES", {
      id,
    });
  }

  public cancelTradeRequest(id: string) {
    this.store.commit("REMOVE_FROM_TRADES", {
      id,
    });
  }

  public resetPendingInvestments() {
    this.store.commit("SET_PENDING_INVESTMENTS", {
      role: this.store.state.role,
      data: defaultPendingInvestment(),
    });
  }

  public resetTradeModal() {}

  //use this to verify that the user has completed the action
  private completedRequiredAction() {
    //we want to immediatly set the task to completed
    this.isTaskComplete = true;

    //this sets the 'required' tag to false on the tutorial step, so when we replay,
    //that action is no longer required.
    this.requiredObject.required = false;
  }

  //use this to verify that the user has completed the action and to move the user forward a step.
  private completedActionWithImplicitForward() {
    this.completedRequiredAction();

    setTimeout(() => this.forwardButtonRef[0].click(), 0);
  }
}
