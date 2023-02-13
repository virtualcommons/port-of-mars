export const ADMIN_PAGE = "Admin" as const;
export const LOGIN_PAGE = "Login" as const;
export const LOBBY_PAGE = "Lobby" as const;
export const GAME_PAGE = "Game" as const;
export const REGISTER_PAGE = "Register" as const;
export const VERIFY_PAGE = "Verify" as const;
export const MANUAL_PAGE = "Manual" as const;
export const HOME_PAGE = "Home" as const;
export const ABOUT_PAGE = "About" as const;
export const PRIVACY_PAGE = "Privacy" as const;

export type Page =
  | "Admin"
  | "Home"
  | "About"
  | "Login"
  | "Lobby"
  | "Game"
  | "Register"
  | "Verify"
  | "Manual"
  | "Privacy";

export const PAGES: Array<Page> = [
  ADMIN_PAGE,
  LOGIN_PAGE,
  LOBBY_PAGE,
  GAME_PAGE,
  REGISTER_PAGE,
  VERIFY_PAGE,
  MANUAL_PAGE,
  HOME_PAGE,
  ABOUT_PAGE,
  PRIVACY_PAGE,
];

export function isPage(pageName: string): pageName is Page {
  return PAGES.includes(pageName as Page);
}

export function getPagePath(page: Page): string {
  // FIXME: depends on mode: hash for vue router
  return `/#${PAGE_META[page].path}`;
}

export const PAGE_META: {
  [p in Page]: {
    path: string;
    name?: string;
    props?: any;
    meta: { requiresAuth: boolean; requiresAdmin?: boolean };
  };
} = {
  [ADMIN_PAGE]: {
    path: "/admin",
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  [REGISTER_PAGE]: {
    path: "/register",
    name: REGISTER_PAGE,
    meta: {
      requiresAuth: true,
    },
  },
  [GAME_PAGE]: {
    path: "/game",
    name: GAME_PAGE,
    meta: {
      requiresAuth: true,
    },
  },
  [LOBBY_PAGE]: {
    path: "/lobby",
    meta: {
      requiresAuth: true,
    },
  },
  [HOME_PAGE]: {
    path: "/",
    name: HOME_PAGE,
    props: true,
    meta: {
      requiresAuth: false,
    },
  },
  [ABOUT_PAGE]: {
    path: "/about",
    name: ABOUT_PAGE,
    props: { scrollToAbout: true },
    meta: {
      requiresAuth: false,
    },
  },
  [LOGIN_PAGE]: {
    path: "/login",
    name: LOGIN_PAGE,
    meta: {
      requiresAuth: false,
    },
  },
  [VERIFY_PAGE]: {
    path: "/verify/:token",
    name: VERIFY_PAGE,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  [MANUAL_PAGE]: {
    path: "/manual",
    name: MANUAL_PAGE,
    meta: {
      requiresAuth: false,
    },
  },
  [PRIVACY_PAGE]: {
    path: "/privacy",
    name: PRIVACY_PAGE,
    meta: {
      requiresAuth: false,
    },
  },
};

export const PAGE_DEFAULT = PAGE_META[HOME_PAGE];
