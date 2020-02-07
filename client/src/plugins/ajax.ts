import Vue, {VueConstructor} from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $ajax: AjaxRequest;
  }
}

class AjaxRequest {
  async post(path: string, data?: any) {
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
          'Authorization': `Bearer ${jwt}`,
        },
        redirect: 'follow',
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data)
      }
    )
  }

  async postNoToken(path: string, data?: any) {
    return await fetch(
      path,
      {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data)
      }
    )
  }

  async get(path: string) {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json'
    };
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      headers['Authorization'] = `Bearer ${jwt}`
    }
    return await fetch(
      path,
      {
        method: 'GET',
        headers,
        redirect: 'follow',
        referrerPolicy: "no-referrer",
      }
    )
  }
}

export const Ajax = {
  install(instance: VueConstructor<Vue>, options: any) {
    instance.prototype.$ajax = new AjaxRequest();
  }
};
