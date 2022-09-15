import { defineStore } from "pinia";

// You can name the return value of `defineStore()` anything you want,
//but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useUserStore = defineStore("user-store", {
  id: "user",
  state: () => ({
    name: "",
    email: "",
    isVerified: false,
    dateCreated: null,
    passedQuiz: false,
    dateConsented: null,
  }),
  actions: {},
});
