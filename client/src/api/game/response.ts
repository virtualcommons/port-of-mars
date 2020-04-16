import { Room } from 'colyseus.js';
import {
  ChatMessageData,
  GameData,
  MarsEventData,
  Phase,
  PlayerData,
  MarsLogMessageData,
  ROLES,
  TradeData,
  Role
} from '@port-of-mars/shared/types';
import { Responses } from '@port-of-mars/shared/game/responses';
import { Schema } from '@colyseus/schema';
import { TStore } from '@port-of-mars/client/plugins/tstore';

type Schemify<T> = T & Schema;

function deschemify<T>(s: Schemify<T>): T {
  return s.toJSON() as T;
}

const responseMap = {
  'inventory': 'SET_INVENTORY',
  'costs': 'SET_INVESTMENT_COSTS',
  'specialty': 'SET_SPECIALTY',
  'timeBlocks': 'SET_TIME_BLOCKS',
  'ready': 'SET_READINESS',
  'accomplishments': 'SET_ACCOMPLISHMENTS',
  'victoryPoints': 'SET_VICTORY_POINTS',
  'pendingInvestments': 'SET_PENDING_INVESTMENTS',
  'contributedUpkeep': 'SET_CONTRIBUTED_UPKEEP'
}

function applyPlayerResponses(player: any, store: TStore) {
  player.onChange = (changes: Array<any>) => {
    changes.forEach(change => {
      const payload = { role: player.role, data: change.value };

      // FIXME: this could just be a mapping of change.field: 'STRING_COMMAND' or some kind of predictable transformation
      // I'd prefer something like the responseMap defined above which can then
      // reduce the switch statement to store.commit(responseMap[change.field], payload) and we adjust the
      // mapping as needed.
      // requires some TS chicanery that I don't know how to do to make it typesafe though
      switch (change.field as keyof PlayerData) {
        case 'inventory':
          store.commit('SET_INVENTORY', payload);
          break;
        case 'costs':
          store.commit('SET_INVESTMENT_COSTS', payload);
          break;
        case 'specialty':
          store.commit('SET_SPECIALTY', payload);
          break;
        case 'timeBlocks':
          store.commit('SET_TIME_BLOCKS', payload);
          break;
        case 'ready':
          store.commit('SET_READINESS', payload);
          break;
        case 'accomplishments':
          store.commit('SET_ACCOMPLISHMENTS', payload);
          break;
        case 'victoryPoints':
          store.commit('SET_VICTORY_POINTS', payload);
          break;
        case 'pendingInvestments':
          store.commit('SET_PENDING_INVESTMENTS', payload);
          break;
        case 'contributedUpkeep':
          store.commit('SET_CONTRIBUTED_UPKEEP', payload);
          break;
      }
    });
  };
  player.triggerAll();
}

// see https://github.com/Luka967/websocket-close-codes#websocket-close-codes
// and https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
const REFRESHABLE_WEBSOCKET_ERROR_CODES = [1002, 1003, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012, 1013, 1014, 1015];

export function applyGameServerResponses<T>(room: Room, store: TStore) {
  room.onStateChange.once((state: Schemify<GameData>) => {
    ROLES.forEach(role => applyPlayerResponses(state.players[role], store));
    (state.players as any).triggerAll();
  });

  room.onError((message: string) => {
    console.log("Error occurred in room..");
    console.log(message);
    alert("sorry, we encountered an error, please try refreshing the page or contact us");
  })

  room.onLeave((code: number) => {
    console.log(`client left the room: ${code}`);
    if ([Phase.victory, Phase.defeat].includes(store.state.phase)) {
      return;
    }
    if (REFRESHABLE_WEBSOCKET_ERROR_CODES.includes(code)) {
      alert("your connection was interrupted, refreshing the browser")
      window.location.reload(false);
    }
    else {
      alert("your connection was interrupted, please try refreshing the page or contact us");
    }
  });

  room.onMessage((msg: Responses) => {
    switch (msg.kind) {
      case 'set-player-role':
        store.commit('SET_PLAYER_ROLE', msg.role);
        break;
      default:
        console.log('room.onMessage received unexpected payload');
        console.log(msg);
        break;
    }
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
    store.commit('CHANGE_EVENT', { event: deschemify(event), index });
  };

  room.state.tradeSet.onAdd = (event: Schemify<TradeData>, id: string) => {
    const rawEvent: TradeData = deschemify(event);
    store.commit('ADD_TO_TRADES', { trade: rawEvent, id });
  };

  room.state.tradeSet.onRemove = (event: Schemify<TradeData>, id: string) => {
    store.commit('REMOVE_FROM_TRADES', { id });
  };

  room.state.onChange = (changes: Array<any>) => {
    changes.forEach(change => {
      if (change.field === 'phase') {
        const phase: Phase = change.value;
        store.commit('SET_GAME_PHASE', phase);
        store.commit('CLOSE_ALL_MODALS','data');
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
      if (change.field === 'upkeep') {
        const upkeep: number = change.value;
        store.commit('SET_UPKEEP', upkeep);
      }
      if (change.field === 'winners') {
        const winners: Array<Role> = change.value;
        store.commit('SET_WINNERS', winners);
      }
    });
  };
}
