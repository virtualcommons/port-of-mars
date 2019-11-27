import accomplishments from './accomplishments';
import chat from './chat';
import gameState from './gameState';
import investment from './investment';
import notifications from './notfications';
import trading from './trading';

export default {
    //accomplishments
    setActiveAccomplishments:accomplishments.setActiveAccomplishments,
    discardAccomplishment:accomplishments.discardAccomplishment,
    purchaseAccomplishment:accomplishments.purchaseAccomplishment,

    //chat
    sendChatMsg:chat.sendChatMsg,

    //game state
    updatePhase:gameState.updatePhase,
    updateRoundEvents:gameState.updateRoundEvents,
    changeUpkeepAmount:gameState.changeUpkeepAmount,
    setPlayerRole:gameState.setPlayerRole,

    //investments
    changeLocalInvestment:investment.changeLocalInvestment,
    
    //notifications
    setNotificationMessage:notifications.setNotificationMessage,
    setNotificationStatus:notifications.setNotificationStatus,
    addToMarsLog:notifications.addToMarsLog,

    //trading
    setTradingView:trading.setTradingView,
    setTradingMember:trading.setTradingMember,
}
