import {
  AccomplishmentData,
  Resource,
  ResourceAmountData,
  RESOURCES,
} from "./types";

export function canPurchaseAccomplishment(
  accomplishment: AccomplishmentData,
  inventory: ResourceAmountData
) {
  for (const k of Object.keys(inventory)) {
    const resource = k as Resource;
    if (inventory[resource] < Math.abs(accomplishment[resource])) {
      return false;
    }
  }
  return true;
}

//does not allow user to type in blank data
export function makeTradeSafe(resources: ResourceAmountData) {
  for (const resource of RESOURCES) {
    if (typeof resources[resource] == "string") {
      resources[resource] = 0;
    }
  }
  return resources;
}

/**
 * Prevent zero (0-0) trades
 * @param offer Resources that the local player offers in a trade request.
 * @param request Resources that the local player requests in a trade request.
 */
export function isZeroTrade(
  offer: ResourceAmountData,
  request: ResourceAmountData
) {
  let zeroTrade: boolean = true;
  for (const resource of RESOURCES) {
    zeroTrade = zeroTrade && offer[resource] == 0 && request[resource] == 0;
  }
  if (zeroTrade) console.log("this is a zero trade");
  return zeroTrade;
}

export function canPlayerMakeTrade(
  resourcesToTrade: ResourceAmountData,
  inventory: ResourceAmountData
) {
  let canMakeTrade = true;
  let isTradingSomething = false;
  for (const resource of RESOURCES) {
    if (resourcesToTrade[resource] > inventory[resource]) {
      canMakeTrade = false;
      break;
    }
    if (resourcesToTrade[resource] >= 0) {
      // make sure that at least one resource is being traded
      isTradingSomething = true;
    }
  }
  return canMakeTrade && isTradingSomething;
}
