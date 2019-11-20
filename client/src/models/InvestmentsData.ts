import * as _ from 'lodash';

interface InvestmentProperties {
    n: any;
    initialCost: number;
    currentCost: number;
    currentInventory: number;
    persistentInventory: number;
}

interface InvestmentTypes {
    [key: string]: InvestmentProperties;
    government: InvestmentProperties;
    legacy: InvestmentProperties;
    upkeep: InvestmentProperties;
    finance: InvestmentProperties;
    science: InvestmentProperties;
    culture: InvestmentProperties;
}

class InvestmentsModel {
    private investments: InvestmentTypes = {
      government: {
        n: 'government',
        initialCost: 0,
        currentCost: 0,
        currentInventory: 0,
        persistentInventory: 0,
      },
      legacy: {
        n: 'legacy',
        initialCost: 0,
        currentCost: 0,
        currentInventory: 0,
        persistentInventory: 0,
      },
      upkeep: {
        n: 'upkeep',
        initialCost: 0,
        currentCost: 0,
        currentInventory: 0,
        persistentInventory: 0,
      },
      finance: {
        n: 'finance',
        initialCost: 0,
        currentCost: 0,
        currentInventory: 0,
        persistentInventory: 0,
      },
      science: {
        n: 'science',
        initialCost: 0,
        currentCost: 0,
        currentInventory: 0,
        persistentInventory: 0,
      },
      culture: {
        n: 'culture',
        initialCost: 0,
        currentCost: 0,
        currentInventory: 0,
        persistentInventory: 0,
      },
    };

    changeInventoryValue(investmentToChange: any, amount: number) {
      this.investments[investmentToChange].currentInventory = amount;
    }

    updateCurrentCost(investmentToChange: any, amount: number) {
      this.investments[investmentToChange].currentCost = amount;
    }

    confirmInvestments() {
      Object.keys(this.investments).forEach((investment) => {
        this.investments[investment].persistentInventory
          += this.investments[investment].currentInventory;

        this.investments[investment].currentInventory = 0;
      });
    }

    get returnValues() {
      return this.investments;
    }

    get returnPersistentInventory(){
      return _.mapValues(this.investments, (p:any) => p.persistentInventory);
    }

    canPurchaseAccomplishment(accomplishemntCost:[], safety:boolean) {
      let investments = safety ? _.cloneDeep(this.investments) : this.investments;

      let canBuy = true;
      accomplishemntCost.forEach((investment) => {
        investments[investment].persistentInventory -= 1;

        if (investments[investment].persistentInventory <= -1) {
          canBuy = false;
        }
      });
      return canBuy;
    }

    get localDecrement() {
      return Object.keys(this.investments).reduce((prev, curr) => {
        let temp = prev;
        temp -= this.investments[curr].currentCost * this.investments[curr].currentInventory;
        return temp;
      }, 10);
    }
}

interface InvestmentCosts{
    [key:string]:number
    upkeep:number,
    finance:number,
    legacy:number,
    government:number,
    culture:number,
    science:number,
}

interface BaseInvestmentCostsByPerson{
    [key:string]:InvestmentCosts,
    Entrepreneur:InvestmentCosts,
}

const BaseInvestmentCosts: BaseInvestmentCostsByPerson = {
  Entrepreneur: {
    upkeep: 1,
    finance: 2,
    culture: 3,
    government: 3,
    legacy: -1,
    science: -1,
  },
  Pioneer: {
    upkeep: 1,
    finance: -1,
    culture: 3,
    government: -1,
    legacy: 2,
    science: 3,
  },
  Curator: {
    upkeep: 1,
    finance: 3,
    culture: 2,
    government: -1,
    legacy: 3,
    science: -1,
  },
  Politician: {
    upkeep: 1,
    finance: 3,
    culture: -1,
    government: 2,
    legacy: -1,
    science: 3,
  },
  ///CHANGE THIS BEFORE PR!!!!!!!!!!!!
  Researcher: {
    upkeep: 1,
    finance: 1,
    culture: 1,
    government: 1,
    legacy: 1,
    science: 1,
  },
};

export {
  BaseInvestmentCosts, InvestmentProperties, InvestmentsModel,
};
