export const LOGIN_PAGE: 'Login' = 'Login';
export const LOBBY_PAGE: 'WaitingLobby' = 'WaitingLobby';
export const GAME_PAGE: 'Game' = 'Game';
export const TUTORIAL_PAGE: 'Tutorial' = 'Tutorial';
export const REGISTER_PAGE: 'Register' = 'Register';
export const PLAYER_DASHBOARD: 'Dashboard' = 'Dashboard';
export const REFACTOR_UI: 'Refactor' = 'Refactor';
export type Page = 'Login' | 'WaitingLobby' | 'Game' | 'Tutorial' | 'Register' | 'Dashboard'| 'Refactor';
export const PAGES: Array<Page> = [LOGIN_PAGE, LOBBY_PAGE, GAME_PAGE, TUTORIAL_PAGE, REGISTER_PAGE, PLAYER_DASHBOARD, REFACTOR_UI];

export function isPage(pageName: string): pageName is Page {
  return PAGES.includes(pageName as Page);
}

export const PAGE_META: { [p in Page]: { path: string, name: string, props?: boolean, meta: { requiresAuth: boolean} }} = {
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
  },
  [REGISTER_PAGE]: {
    path: '/register',
    name: REGISTER_PAGE,
    meta: {
      requiresAuth: false
    }
  },
  [PLAYER_DASHBOARD]: {
    path: '/dashboard',
    name: PLAYER_DASHBOARD,
    meta: {
      requiresAuth: true
    }
  },
  [REFACTOR_UI]: {
    path: '/refactor',
    name: REFACTOR_UI,
    meta: {
      requiresAuth: true
    }
  }
};

export const PAGE_DEFAULT = PAGE_META[LOGIN_PAGE];