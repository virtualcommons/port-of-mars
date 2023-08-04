export const ADMIN_PAGE = "Admin" as const;
export const LOGIN_PAGE = "Login" as const;
export const LOBBY_PAGE = "Lobby" as const;
export const GAME_PAGE = "Game" as const;
export const SOLO_GAME_PAGE = "SoloGame" as const;
export const LEADERBOARD_PAGE = "Leaderboard" as const;
export const PLAYER_HISTORY_PAGE = "PlayerHistory" as const;
export const CONSENT_PAGE = "Consent" as const;
export const VERIFY_PAGE = "Verify" as const;
export const MANUAL_PAGE = "Manual" as const;
export const HOME_PAGE = "Home" as const;
export const ABOUT_PAGE = "About" as const;
export const PRIVACY_PAGE = "Privacy" as const;
export const PROFILE_PAGE = "Profile" as const;

export type Page =
  | "Admin"
  | "Home"
  | "About"
  | "Login"
  | "Lobby"
  | "Game"
  | "SoloGame"
  | "PlayerHistory"
  | "Leaderboard"
  | "Consent"
  | "Profile"
  | "Verify"
  | "Manual"
  | "Privacy";

export const PAGES: Array<Page> = [
  ADMIN_PAGE,
  LOGIN_PAGE,
  LOBBY_PAGE,
  GAME_PAGE,
  SOLO_GAME_PAGE,
  PLAYER_HISTORY_PAGE,
  LEADERBOARD_PAGE,
  CONSENT_PAGE,
  PROFILE_PAGE,
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
  [CONSENT_PAGE]: {
    path: "/consent",
    name: CONSENT_PAGE,
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
  [SOLO_GAME_PAGE]: {
    path: "/solo",
    name: SOLO_GAME_PAGE,
    meta: {
      requiresAuth: true,
    },
  },
  [LEADERBOARD_PAGE]: {
    path: "/leaderboard",
    name: LEADERBOARD_PAGE,
    meta: {
      requiresAuth: false,
    },
  },
  [PLAYER_HISTORY_PAGE]: {
    path: "/history",
    name: PLAYER_HISTORY_PAGE,
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
  [PROFILE_PAGE]: {
    path: "/profile",
    name: PROFILE_PAGE,
    meta: {
      requiresAuth: true,
    },
  },
};

export const PAGE_DEFAULT = PAGE_META[HOME_PAGE];
