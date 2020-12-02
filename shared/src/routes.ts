export const LOGIN_PAGE: 'Login' = 'Login';
export const LOBBY_PAGE: 'Lobby' = 'Lobby';
export const GAME_PAGE: 'Game' = 'Game';
export const SIGNEDUP_PAGE: 'SignedUp' = 'SignedUp';
export const TUTORIAL_PAGE: 'Tutorial' = 'Tutorial';
export const CONSENT_PAGE: 'Consent' = 'Consent';
export const VERIFY_PAGE = 'Verify' as const;
export const DASHBOARD_PAGE: 'Dashboard' = 'Dashboard';

export type Page = 'Login' | 'Lobby' | 'Game' | 'Tutorial' | 'SignedUp' | 'Consent' | 'Dashboard' | 'Verify';
export const PAGES: Array<Page> = [ LOGIN_PAGE, LOBBY_PAGE, GAME_PAGE, TUTORIAL_PAGE, CONSENT_PAGE, DASHBOARD_PAGE, VERIFY_PAGE ];

export function isPage(pageName: string): pageName is Page {
  return PAGES.includes(pageName as Page);
}

export function getPagePath(page: Page): string {
  return `/#${PAGE_META[page].path}`;
}

export const PAGE_META: { [p in Page]: { path: string, name: string, props?: boolean, meta: { requiresAuth: boolean} }} = {
  [CONSENT_PAGE]: {
    path: '/register',
    name: CONSENT_PAGE,
    meta: {
      requiresAuth: false
    }
  },
  [DASHBOARD_PAGE]: {
    path: '/dashboard',
    name: DASHBOARD_PAGE,
    meta: {
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
  [LOBBY_PAGE]: {
    path: '/lobby',
    name: LOBBY_PAGE,
    meta:
      {
        requiresAuth: true
      }
  },
  [LOGIN_PAGE]: {
    path: '/',
    name: LOGIN_PAGE,
    meta: {
      requiresAuth: false
    }
  },
  [SIGNEDUP_PAGE]: {
    path: '/signedup',
    name: SIGNEDUP_PAGE,
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
  [VERIFY_PAGE]: {
    path: '/verify/:token',
    name: VERIFY_PAGE,
    props: true,
    meta: {
      requiresAuth: false
    }
  }
};

export const PAGE_DEFAULT = PAGE_META[LOGIN_PAGE];