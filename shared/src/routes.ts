export const ADMIN_PAGE: "Admin" = "Admin";
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
export const OPENLOGIN_PAGE: "OpenLogin" = "OpenLogin";
export const USERNAME_PAGE: "Username" = "Username";
export const OPENLOBBY_PAGE: "OpenLobby" = "OpenLobby";
export const ONBOARDING_PAGE: "Onboarding" = "Onboarding";

export type Page =
  | "Admin"
  | "Home"
  | "Login"
  | "Lobby"
  | "Game"
  | "Tutorial"
  | "SignedUp"
  | "Register"
  | "Dashboard"
  | "Verify"
  | "Manual"
  | "OpenLogin"
  | "Username"
  | "OpenLobby"
  | "Onboarding";
export const PAGES: Array<Page> = [
  ADMIN_PAGE,
  LOGIN_PAGE,
  LOBBY_PAGE,
  GAME_PAGE,
  TUTORIAL_PAGE,
  REGISTER_PAGE,
  DASHBOARD_PAGE,
  VERIFY_PAGE,
  MANUAL_PAGE,
  HOME_PAGE,
  OPENLOGIN_PAGE,
  USERNAME_PAGE,
  OPENLOBBY_PAGE,
  ONBOARDING_PAGE
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
    name: string;
    props?: boolean;
    meta: { requiresAuth: boolean };
  };
} = {
  [ADMIN_PAGE]: {
    path: "/admin",
    name: ADMIN_PAGE,
    meta: {
      requiresAuth: true,
    },
  },
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
  [OPENLOGIN_PAGE]: {
    path: "/openlogin",
    name: OPENLOGIN_PAGE,
    meta: {
      requiresAuth: false,
    },
  },
  [USERNAME_PAGE]: {
    path: "/username",
    name: USERNAME_PAGE,
    meta: {
      requiresAuth: false,
    },
  },
  [OPENLOBBY_PAGE]: {
    path: "/openlobby",
    name: OPENLOBBY_PAGE,
    meta: {
      requiresAuth: true,
    },
  },
  [ONBOARDING_PAGE]: {
    path: "/onboarding",
    name: ONBOARDING_PAGE,
    meta: {
      requiresAuth: true,
    },
  },
};

export const PAGE_DEFAULT = PAGE_META[HOME_PAGE];
