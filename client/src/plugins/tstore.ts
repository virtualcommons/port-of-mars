import {State} from "@port-of-mars/client/store/state";
import Getters from "@port-of-mars/client/store/getters";
import Mutations from "@port-of-mars/client/store/mutationFolder";
import Vue, {VueConstructor} from 'vue';
import {Store} from "vuex";

export interface TStore {
  state: State;
  readonly getters: { [K in keyof typeof Getters]: ReturnType<typeof Getters[K]> };

  commit<K extends keyof typeof Mutations>(
    name: K,
    payload: Parameters<typeof Mutations[K]>[1]
  ): void;
}

declare module 'vue/types/vue' {

  interface Vue {
    $tstore: TStore;
  }
}

export const TypedStore = {
  install(instance: VueConstructor, options: any) {
    Object.defineProperty(instance.prototype, '$tstore', {
      get: function(this:  & { $store: Store<any> }) {
        return this.$store;
      }
    });
  }
};
