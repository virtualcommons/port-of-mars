import { Router } from "express";
import passport from "passport";
import { User } from "@port-of-mars/server/entity";
import { settings } from "@port-of-mars/server/settings";
import { getServices } from "@port-of-mars/server/services";
import { toUrl } from "@port-of-mars/server/util";
import { LOGIN_PAGE, CONSENT_PAGE, FREE_PLAY_LOBBY_PAGE } from "@port-of-mars/shared/routes";
import { isDevOrStaging, isEducatorMode } from "@port-of-mars/shared/settings";

const logger = settings.logging.getLogger(__filename);

export const authRouter = Router();

if (isDevOrStaging()) {
  authRouter.post("/dev-login", passport.authenticate("local-dev"), function (req, res) {
    res.json({ user: req.user });
  });
}

if (isEducatorMode()) {
  authRouter.post("/student-login", passport.authenticate("local-student"), function (req, res) {
    res.json({ user: req.user });
  });
}

authRouter.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    return res.json({ user: {} });
  });
});

authRouter.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/google/success",
    failureRedirect: "/auth/google/failure",
  })
);

authRouter.get("/google/failure", function (req, res) {
  logger.fatal("google login failure, user: %o ", req);
  res.redirect(toUrl(LOGIN_PAGE));
});

authRouter.get("/google/success", function (req, res) {
  if (req.user) {
    const user = req.user as User;
    if (!user.isActive) {
      logger.warn("inactivated user attempted to login %o", user);
      res.redirect(toUrl(LOGIN_PAGE));
    } else if (getServices().account.isRegisteredAndValid(user)) {
      res.redirect(toUrl(FREE_PLAY_LOBBY_PAGE));
    } else {
      logger.warn("invalid / unregistered user %o", user);
      res.redirect(toUrl(CONSENT_PAGE));
    }
  } else {
    logger.warn("no user on the request, returning to login %o", req);
    res.redirect(toUrl(LOGIN_PAGE));
  }
});

authRouter.get("/facebook", passport.authenticate("facebook", { scope: "email" }));

authRouter.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/auth/facebook/success",
    failureRedirect: "/auth/facebook/failure",
  })
);

authRouter.get("/facebook/failure", function (req, res) {
  logger.debug("facebook login failure, user: %o ", req);
  res.redirect(toUrl(LOGIN_PAGE));
});

authRouter.get("/facebook/success", function (req, res) {
  logger.debug("facebook login success, user: %o ", req);
  if (req.user) {
    const user = req.user as User;
    if (!user.isActive) {
      logger.warn("inactivated user attempted to login %o", user);
      res.redirect(toUrl(LOGIN_PAGE));
    } else if (getServices().account.isRegisteredAndValid(user)) {
      res.redirect(toUrl(FREE_PLAY_LOBBY_PAGE));
    } else {
      logger.warn("invalid / unregistered user %o", user);
      res.redirect(toUrl(CONSENT_PAGE));
    }
  } else {
    logger.warn("no user on the request, returning to login %o", req);
    res.redirect(toUrl(LOGIN_PAGE));
  }
});
