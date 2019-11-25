import accomplishments from "./accomplishments";
import chat from "./chat";
import gameState from "./gameState";
import investment from "./investment";
import notifications from "./notifications";
import trading from "./trading";

export default {
    //accomplishments
    SET_ACTIVE_ACCOMPLISHMENTS:accomplishments.SET_ACTIVE_ACCOMPLISHMENTS,
    DISCARD_ACCOMPLISHMENT:accomplishments.DISCARD_ACCOMPLISHMENT,
    PURCHASE_ACCOMPLISHMENT:accomplishments.PURCHASE_ACCOMPLISHMENT,

    //chat
    ADD_TO_CHAT:chat.ADD_TO_CHAT,

    //game state
    SET_GAME_PHASE:gameState.SET_GAME_PHASE,
    SET_EVENTS_FOR_ROUND:gameState.SET_EVENTS_FOR_ROUND,
    CHANGE_UPKEEP_AMOUNT:gameState.CHANGE_UPKEEP_AMOUNT,
    SET_PLAYER_ROLE:gameState.SET_PLAYER_ROLE,
    SET_PLAYER_FINISHED:gameState.SET_PLAYER_FINISHED,

    //investments
    CHANGE_LOCAL_INVESTMENT:investment.CHANGE_LOCAL_INVESTMENT,
    
    //notifications
    SET_NOTIFICATION_MESSAGE:notifications.SET_NOTIFICATION_MESSAGE,
    SET_NOTIFICATION_STATUS:notifications.SET_NOTIFICATION_STATUS,
    SET_TIME_REMAINING:notifications.SET_TIME_REMAINING,
    ADD_TO_MARS_LOG:notifications.SET_TIME_REMAINING,

    //trading
    SET_TRADING_VIEW:trading.SET_TRADING_VIEW,
    SET_TRADING_MEMBER:trading.SET_TRADING_MEMBER,
}