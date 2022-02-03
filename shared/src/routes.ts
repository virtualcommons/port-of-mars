export const LOGIN_PAGE: "Login" = "Login";
export const LOBBY_PAGE: "Lobby" = "Lobby";
export const GAME_PAGE: "Game" = "Game";
export const SIGNEDUP_PAGE: "SignedUp" = "SignedUp";
export const TUTORIAL_PAGE: "Tutorial" = "Tutorial";
export const REGISTER_PAGE: "Register" = "Register";
export const VERIFY_PAGE = "Verify" as const;
export const DASHBOARD_PAGE: "Dashboard" = "Dashboard";
export const MANUAL_PAGE: "Manual" = "Manual";
export const HOME_PAGE: "Home" = "Home";

export type Page =
  | "Home"
  | "Login"
  | "Lobby"
  | "Game"
  | "Tutorial"
  | "SignedUp"
  | "Register"
  | "Dashboard"
  | "Verify"
  | "Manual";
export const PAGES: Array<Page> = [
  LOGIN_PAGE,
  LOBBY_PAGE,
  GAME_PAGE,
  TUTORIAL_PAGE,
  REGISTER_PAGE,
  DASHBOARD_PAGE,
  VERIFY_PAGE,
  MANUAL_PAGE,
  HOME_PAGE,
];

export function isPage(pageName: string): pageName is Page {
  return PAGES.includes(pageName as Page);
}

export function getPagePath(page: Page): string {
  return `/#${PAGE_META[page].path}`;
}

export const PAGE_META: {
  [p in Page]: {
    path: string;
    name: string;
    props?: boolean;
    meta: { requiresAuth: boolean };
  };
} = {
  [REGISTER_PAGE]: {
    path: "/register",
    name: REGISTER_PAGE,
    meta: {
      requiresAuth: false,
    },
  },
  [DASHBOARD_PAGE]: {
    path: "/dashboard",
    name: DASHBOARD_PAGE,
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
    name: LOBBY_PAGE,
    meta: {
      requiresAuth: true,
    },
  },
  [HOME_PAGE]: {
    path: "/",
    name: HOME_PAGE,
    meta: {
      requiresAuth: false,
    },
  },
  [LOGIN_PAGE]: {
    path: "/signin",
    name: LOGIN_PAGE,
    meta: {
      requiresAuth: false,
    },
  },
  [SIGNEDUP_PAGE]: {
    path: "/signedup",
    name: SIGNEDUP_PAGE,
    meta: {
      requiresAuth: true,
    },
  },
  [TUTORIAL_PAGE]: {
    path: "/tutorial",
    name: TUTORIAL_PAGE,
    meta: {
      requiresAuth: true,
    },
  },
  [VERIFY_PAGE]: {
    path: "/verify/:token",
    name: VERIFY_PAGE,
    props: true,
    meta: {
      requiresAuth: false,
    },
  },
  [MANUAL_PAGE]: {
    path: "/manual",
    name: MANUAL_PAGE,
    meta: {
      requiresAuth: false,
    },
  },
};

export const PAGE_DEFAULT = PAGE_META[HOME_PAGE];
