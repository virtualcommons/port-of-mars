import Vue, {VueConstructor} from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $post: (path: string, data: any) => Promise<Response>;
  }
}

export const Ajax = {
  install(instance: VueConstructor<Vue>, options: any) {
    instance.prototype.$post = async function(path: string, data: any) {
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        throw new Error('must have jwt');
      }
      return await fetch(
        path,
        {
          method: 'POST',
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
          },
          redirect: 'follow',
          referrerPolicy: "no-referrer",
          body: JSON.stringify(data)
        }
      )
    }
  }
};
