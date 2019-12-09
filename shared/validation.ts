import {AccomplishmentData, Resource, ResourceAmountData, ResourceCostData} from "./types";

export function canPurchaseAccomplishment(accomplishment: AccomplishmentData, inventory: ResourceAmountData) {
  for (const k of Object.keys(inventory)) {
    const resource = k as Resource;
    if (inventory[resource] < Math.abs(accomplishment[resource])) {
      return false;
    }
  }
  return true;
}