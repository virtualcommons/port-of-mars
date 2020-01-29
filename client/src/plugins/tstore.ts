import {State} from "@/store/state";
import Getters from "@/store/getters";
import Mutations from "@/store/mutationFolder";
import Vue, {VueConstructor} from 'vue';
import {Store} from "vuex";

declare module 'vue/types/vue' {
  interface TStore {
    state: State;
    readonly getters: { [K in keyof typeof Getters]: ReturnType<typeof Getters[K]> };

    commit<K extends keyof typeof Mutations>(
      name: K,
      payload: Parameters<typeof Mutations[K]>[1]
    ): void;
  }

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
