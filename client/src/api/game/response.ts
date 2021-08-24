import {Room} from 'colyseus.js';
import {
  ChatMessageData,
  GameData,
  MarsEventData,
  MarsLogMessageData,
  Phase,
  PlayerData, ResourceAmountData,
  Role,
  ROLES,
  RoundIntroductionData,
  TradeData
} from '@port-of-mars/shared/types';
import {SetError, SetPlayerRole} from '@port-of-mars/shared/game/responses';
import {DataChange, Schema} from '@colyseus/schema';
import {TStore} from '@port-of-mars/client/plugins/tstore';
import Mutations from '@port-of-mars/client/store/mutations';

type Schemify<T> = T & Schema;

function deschemify<T>(s: Schemify<T>): T {
  return s.toJSON() as T;
}

type PlayerPrimitive = Omit<PlayerData, 'role' | 'inventory' | 'costs' | 'accomplishments'>;

type ServerResponse = {
  [field in keyof PlayerPrimitive]: keyof typeof Mutations;
};

const responseMap: ServerResponse = {
  botWarning: 'SET_BOT_WARNING',
  specialty: 'SET_SPECIALTY',
  timeBlocks: 'SET_TIME_BLOCKS',
  ready: 'SET_READINESS',
  victoryPoints: 'SET_VICTORY_POINTS',
  systemHealthChanges: 'SET_SYSTEM_HEALTH_CHANGES',
};

function applyCosts(role: Role, costs: any, store: TStore) {
  costs.onChange = (changes: Array<DataChange>) => {
    for (const change of changes) {
      store.commit('SET_INVESTMENT_COST', {role, resource: change.field as keyof ResourceAmountData, data: change.value});
    }
  }
}

function applyAccomplishmentResponse(role: Role, accomplishment: any, store: TStore) {
  accomplishment.purchased.onAdd = (acc: any, index: number) => {
    store.commit('ADD_TO_PURCHASED_ACCOMPLISHMENTS', {role, data: acc});
  }
  accomplishment.purchased.onRemove = (acc: any, index: number) => {
    store.commit('REMOVE_FROM_PURCHASED_ACCOMPLISHMENTS', {role, data: acc})
  }

  accomplishment.purchasable.onAdd = (acc: any, index: number) => {
    console.log("Adding to purchasable accomplishments: ", acc);
    store.commit('ADD_TO_PURCHASABLE_ACCOMPLISHMENTS', {role, data: acc})
  }
  accomplishment.purchasable.onRemove = (acc: any, index: number) => {
    console.log('removing from purchasable', acc);
    store.commit('REMOVE_FROM_PURCHASABLE_ACCOMPLISHMENTS', {role, data: acc})
  }
}

/**
 * Translates automatic colyseus schema changes into vuex mutations on the store.
 *
 * Colyseus automatically syncs primitive values but nested classes (Player -> Inventory -> Resources)
 * need to be manually registered.
 *
 * @param role
 * @param inventory
 * @param store
 */
function applyInventoryResponses(role: Role, inventory: any, store: TStore) {
  inventory.onChange = (changes: Array<any>) => {
    for (const change of changes) {
      store.commit('SET_INVENTORY_AMOUNT', {role, resource: change.field, value: change.value});
    }
  }
}

function applyPlayerResponses(role: Role, player: any, store: TStore) {
  player.onChange = (changes: Array<any>) => {
    //filtering out any changes that have to do with the role immediately
    changes
      .filter((change) => change.field != 'role')
      .forEach((change) => {
        const payload = {role: player.role, data: change.value};
        store.commit(
          responseMap[change.field as keyof PlayerPrimitive],
          payload
        );
      });
  };
  applyInventoryResponses(role, player.inventory, store);
  applyAccomplishmentResponse(role, player.accomplishments, store);
  applyCosts(role, player.costs, store);
  // player.triggerAll();
}

// see https://github.com/Luka967/websocket-close-codes#websocket-close-codes
// and https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
const REFRESHABLE_WEBSOCKET_ERROR_CODES = [
  1002,
  1003,
  1005,
  1006,
  1007,
  1008,
  1009,
  1010,
  1011,
  1012,
  1013,
  1014,
  1015,
];

export function applyGameServerResponses<T>(room: Room, store: TStore) {
  room.onStateChange.once((state: Schemify<GameData>) => {
    ROLES.forEach((role) => applyPlayerResponses(role, state.players[role], store));
    (state.players as any).triggerAll();
  });

  room.onError((code: number, message?: string) => {
    console.log(`Error ${code} occurred in room: ${message}`);
    alert(
      'sorry, we encountered an error, please try refreshing the page or contact us'
    );
  });

  room.onLeave((code: number) => {
    console.log(`client left the room: ${code}`);
    if ([Phase.victory, Phase.defeat].includes(store.state.phase)) {
      return;
    }
    if (REFRESHABLE_WEBSOCKET_ERROR_CODES.includes(code)) {
      alert('your connection was interrupted, refreshing the browser');
      window.location.reload(false);
    } else {
      alert(
        'your connection was interrupted, please try refreshing the page or contact us'
      );
    }
  });

  room.onMessage('set-player-role', (msg: SetPlayerRole) => {
    store.commit('SET_PLAYER_ROLE', msg.role);
  });
  room.onMessage('set-error', (msg: SetError) => {
    store.commit('SET_DASHBOARD_MESSAGE', {
      kind: 'warning',
      message: msg.message,
    });
  });

  // eslint-disable-next-line no-param-reassign
  room.state.messages.onAdd = (msg: Schemify<ChatMessageData>, key: number) => {
    store.commit('ADD_TO_CHAT', deschemify(msg));
  };

  room.state.messages.onRemove = (
    msg: Schemify<ChatMessageData>,
    index: number
  ) => {
    store.commit('REMOVE_FROM_CHAT', deschemify(msg));
  };

  room.state.logs.onAdd = (
    logMsg: Schemify<MarsLogMessageData>,
    index: number
  ) => {
    store.commit('ADD_TO_MARS_LOG', deschemify(logMsg));
  };

  room.state.logs.onRemove = (
    logMsg: Schemify<MarsLogMessageData>,
    index: number
  ) => {
    store.commit('REMOVE_FROM_MARS_LOG', deschemify(logMsg));
  };

  // RESPONSES FOR EVENTS :: START

  room.state.marsEvents.onAdd = (e: Schemify<MarsEventData>, index: number) => {
    // console.log('RESPONSE (marsEvents.onAdd): ', deschemify(e));
    store.commit('ADD_TO_EVENTS', deschemify(e));
  };

  room.state.marsEvents.onRemove = (
    e: Schemify<MarsEventData>,
    index: number
  ) => {
    // console.log('RESPONSE (marsEvents.onRemove): ', deschemify(e));
    store.commit('REMOVE_FROM_EVENTS', deschemify(e));
  };

  room.state.marsEvents.onChange = (
    event: Schemify<MarsEventData>,
    index: number
  ) => {
    // console.log('RESPONSE (marsEvents.onChange): ', {
    //   event: deschemify(event),
    //   index
    // });
    store.commit('CHANGE_EVENT', {event: deschemify(event), index});
  };

  room.state.tradeSet.onAdd = (event: Schemify<TradeData>, id: string) => {
    console.log({ rawTrade: event });
    event.onChange = (changes) => {
      changes.forEach(change => {
        if (change.field === 'status') {
          store.commit('UPDATE_TRADE_STATUS', {id: event.id, status: change.value});
        }
      })
    }
    const trade: TradeData = deschemify(event);
    console.log({ trade });
    store.commit('ADD_TO_TRADES', {trade, id});
  };

  room.state.tradeSet.onRemove = (event: Schemify<TradeData>, id: string) => {
    store.commit('REMOVE_FROM_TRADES', {id});
  };

  room.state.onChange = (changes: Array<any>) => {
    changes.forEach((change) => {
      console.log(change);
      if (change.field === 'phase') {
        const phase: Phase = change.value;
        store.commit('SET_GAME_PHASE', phase);
        store.commit('SET_MODAL_HIDDEN', null);
      }
      if (change.field === 'round') {
        const round: number = change.value;
        store.commit('SET_ROUND', round);
      }
      if (change.field === 'timeRemaining') {
        const timeRemaining: number = change.value;
        store.commit('SET_TIME_REMAINING', timeRemaining);
      }
      if (change.field === 'marsEventsProcessed') {
        store.commit('SET_MARS_EVENTS_PROCESSED', change.value);
      }
      if (change.field === 'systemHealth') {
        const systemHealth: number = change.value;
        store.commit('SET_SYSTEM_HEALTH', systemHealth);
      }
      if (change.field === 'winners') {
        const winners: Array<Role> = change.value;
        store.commit('SET_WINNERS', winners);
      }
      if (change.field === 'roundIntroduction') {
        const roundIntroduction: RoundIntroductionData = change.value;
        store.commit('SET_ROUND_INTRODUCTION', roundIntroduction);
      }
      if (change.field === 'heroOrPariah') {
        const heroOrPariah: 'hero' | 'pariah' = change.value;
        store.commit('SET_HERO_OR_PARIAH', heroOrPariah);
      }
    });
  };
}
