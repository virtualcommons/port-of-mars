export const LOGIN_PAGE: 'Login' = 'Login';
export const LOBBY_PAGE: 'WaitingLobby' = 'WaitingLobby';
export const GAME_PAGE: 'Game' = 'Game';
export const TUTORIAL_PAGE: 'Tutorial' = 'Tutorial';
export type Page = 'Login' | 'WaitingLobby' | 'Game' | 'Tutorial'
export const PAGES: Array<Page> = [LOGIN_PAGE, LOBBY_PAGE, GAME_PAGE, TUTORIAL_PAGE];

export function isPage(pageName: string): pageName is Page {
  return PAGES.includes(pageName as Page);
}

export const PAGE_META: { [p in Page]: { path: string, name: string, meta: { requiresAuth: boolean} }} = {
  [LOGIN_PAGE]: {
    path: '/',
    name: LOGIN_PAGE,
    meta: {
      requiresAuth: false
    }
  },
  [LOBBY_PAGE]: {
    path: '/lobby',
    name: LOBBY_PAGE,
    meta:
      {
        requiresAuth: true
      }
  },
  [GAME_PAGE]: {
    path: '/game',
    name: GAME_PAGE,
    meta: {
      requiresAuth: true
    }
  },
  [TUTORIAL_PAGE]: {
    path: '/tutorial',
    name: TUTORIAL_PAGE,
    meta: {
      requiresAuth: true
    }
  }
};

export const PAGE_DEFAULT = PAGE_META[LOGIN_PAGE];