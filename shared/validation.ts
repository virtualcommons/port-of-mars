import {AccomplishmentData, Resource, ResourceAmountData, ResourceCostData, RESOURCES} from "./types";

export function canPurchaseAccomplishment(accomplishment: AccomplishmentData, inventory: ResourceAmountData) {
  for (const k of Object.keys(inventory)) {
    const resource = k as Resource;
    if (inventory[resource] < Math.abs(accomplishment[resource])) {
      return false;
    }
  }
  return true;
}


//might move to TradeOptions.vue
export function makeTradeSafe(resources:ResourceAmountData){
  for(const resource of Object.keys(resources)){
    if(typeof resources[resource] == "string"){
      resources[resource] = 0;
    }
  }
}


export function canPlayerMakeTrade(resources:ResourceAmountData,inventory:ResourceAmountData){
  let canMakeTrade = true;
  let isTradingSomething = false;
  for(const resource of RESOURCES){
  
    if(resources[resource] > inventory[resource]){
      canMakeTrade = false;
      break;
    }
    if(resources[resource] > 0) isTradingSomething = true;
  }

  return canMakeTrade && isTradingSomething;
}