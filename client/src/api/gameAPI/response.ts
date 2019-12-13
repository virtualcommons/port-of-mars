import {Room} from 'colyseus.js';
import {
  ChatMessageData, GameData,
  MarsEventData,
  Phase,
  PlayerData,
  MarsLogMessageData,
  ROLES, TradeData
} from 'shared/types';
import { Responses } from 'shared/responses';
import { DataChange, Schema } from '@colyseus/schema';
import { TStore } from 'vue/types/vue';

type Schemify<T> = T & Schema;

function deschemify<T>(s: Schemify<T>): T {
  return s.toJSON() as T;
}

function applyPlayerResponses(player: any, store: TStore) {
  player.onChange = (changes: Array<any>) => {
    changes.forEach(change => {
      const payload = { role: player.role, data: change.value };
      switch (change.field as keyof PlayerData) {
        case "inventory":
          store.commit('SET_INVENTORY', payload);
          break;
        case "costs":
          store.commit('SET_INVESTMENT_COSTS', payload);
          break;
        case "timeBlocks":
          store.commit('SET_TIME_BLOCKS', payload);
          break;
        case "ready":
          store.commit('SET_READINESS', payload);
          break;
        case "accomplishment":
          store.commit('SET_ACCOMPLISHMENTS', payload);
          break;
        case "victoryPoints":
          store.commit('SET_VICTORY_POINTS', payload);
          break;
        case "pendingInvestments":
          store.commit('SET_PENDING_INVESTMENTS', payload);
          break;
      }
    });
  };
  player.triggerAll();
}

export function gameApplyServerResponses<T>(room: Room, store: TStore) {
  room.onStateChange.once((state: Schemify<GameData>) => {
    ROLES.forEach(role => applyPlayerResponses(state.players[role], store));
    (state.players as any).triggerAll();
  });

  room.onMessage((msg: Responses) => {
    switch (msg.kind) {
      case 'set-player-role':
        store.commit('SET_PLAYER_ROLE', msg.role);
        break;
      default:
        break;
    }
  });

  // eslint-disable-next-line no-param-reassign
  room.state.messages.onAdd = (msg: Schemify<ChatMessageData>, key: number) => {
    store.commit('ADD_TO_CHAT', deschemify(msg));
  };

  room.state.messages.onRemove = (msg: Schemify<ChatMessageData>, index: number) => {
    store.commit('REMOVE_FROM_CHAT', deschemify(msg));
  };

  room.state.logs.onAdd = (logMsg: Schemify<MarsLogMessageData>, index: number) => {
    store.commit('ADD_TO_MARS_LOG', deschemify(logMsg));
  }

  room.state.logs.onRemove = (logMsg: Schemify<MarsLogMessageData>, index: number) => {
    store.commit('REMOVE_FROM_MARS_LOG', deschemify(logMsg));
  }
  // room.state.players.onChange = (changes: Array<DataChange>) => {
  //   for (const change of changes) {
  //     store.commit('SET_PLAYER', { role: change.field as Role, data: change.value});
  //   }
  // };

  room.state.marsEvents.onAdd = (e: Schemify<MarsEventData>, index: number) => {
    store.commit('ADD_TO_EVENTS', deschemify(e));
  };

  room.state.marsEvents.onRemove = (e: Schemify<MarsEventData>, index: number) => {
    store.commit('REMOVE_FROM_EVENTS', deschemify(e));
  };

  room.state.marsEvents.onChange = (event: Schemify<MarsEventData>, index: number) => {
    store.commit('CHANGE_EVENT', {event: deschemify(event), index});
  };

  room.state.tradeSet.onAdd = (event: Schemify<TradeData>, id: string) => {
    store.commit('ADD_TO_TRADES', { trade: deschemify(event), id })
  };

  room.state.tradeSet.onRemove = (event: Schemify<TradeData>, id: string) => {
    store.commit('REMOVE_FROM_TRADES', {id});
  };

  room.state.onChange = (changes: Array<any>) => {
    changes.forEach(change => {
      if (change.field === 'phase') {
        const phase: Phase = change.value;
        store.commit('SET_GAME_PHASE', phase);
      }
      if (change.field === 'round') {
        const round: number = change.value;
        store.commit('SET_ROUND', round);
      }
      if (change.field === 'upkeep') {
        const upkeep: number = change.value;
        store.commit('SET_UPKEEP', upkeep);
<<<<<<< HEAD:client/src/api/response.ts
=======
        
        if(upkeep < 100) {
          store.commit('CREATE_NOTIFICATION',`ohmygod we're all gonna dieeee!`);
          store.commit('ADD_TO_MARS_LOG',{category:'upkeep',message:'upkeep has dropped by 25!'});
        }

        if(upkeep == 100){
          store.commit('HARD_RESET_NOTIFICATIONS','');
          store.commit('HARD_RESET_MARS_LOG','');
        }
>>>>>>> [feat]Switching room functionality:client/src/api/gameAPI/response.ts
      }
    });
  };
}
