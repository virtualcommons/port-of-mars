import accomplishments from './accomplishments';
import chat from './chat';
import gameState from './gameState';
import investment from './investment';
import notifications from './notfications';
import trading from './trading';

export default {
  ...accomplishments,
  ...gameState,
  ...investment,
  ...notifications,
  ...trading
}
