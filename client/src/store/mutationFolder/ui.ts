import { State, defaultTradeData } from '@port-of-mars/client/store/state';
import { Role, ResourceAmountData } from '@port-of-mars/shared/types';

function SET_PLAYER_INFO_MODAL_VISIBILITY(state: State, payload: {role:Role, visible:boolean}){
    state.ui.modalViews.playerInfoModal = payload;
}

function SET_TRADE_REQUEST_MODAL_VISIBILITY(state: State,payload:boolean){
    state.ui.modalViews.tradeRequestModal.visible = payload;
    if(payload == false){
        state.ui.tradeData = defaultTradeData();
    }
}

function SET_CARD_MODAL_VISIBILITY(state: State, payload: {visible:boolean, data:{type:string, info:any}}){
    state.ui.modalViews.cardModal = payload;
}

function CLOSE_ALL_MODALS(state: State, payload:any){
    for(let view of Object.keys(state.ui.modalViews)){
        state.ui.modalViews[view].visible = false;
    }
}

function OPEN_TRADE_MODAL_WARM(state: State, payload: {role:Role}){
    state.ui.tradeData.to.role = payload.role;
    state.ui.modalViews.tradeRequestModal.visible = true;
}

function SET_GET_RESOURCES(state: State, payload: ResourceAmountData){
    state.ui.tradeData.from.resourceAmount = payload;
}

function  SET_SEND_RESOURCES(state: State, payload: ResourceAmountData){
    state.ui.tradeData.to.resourceAmount = payload;
}

function  SET_TRADE_PARTNER_NAME(state: State, payload: Role){
    state.ui.tradeData.to.role = payload;
}

function  SET_TRADE_PLAYER_NAME(state: State, payload: Role){
    state.ui.tradeData.from.role = payload;
}

function RESET_TRADE_MODAL(state: State, payload: any){
    state.ui.tradeData = defaultTradeData();
}





export default {
    SET_PLAYER_INFO_MODAL_VISIBILITY,
    SET_TRADE_REQUEST_MODAL_VISIBILITY,
    SET_CARD_MODAL_VISIBILITY,
    SET_GET_RESOURCES,
    SET_SEND_RESOURCES,
    SET_TRADE_PARTNER_NAME,
    SET_TRADE_PLAYER_NAME,
    CLOSE_ALL_MODALS,
    OPEN_TRADE_MODAL_WARM,
    RESET_TRADE_MODAL,
}