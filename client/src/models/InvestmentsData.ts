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
      console.log(amount);
      this.investments[investmentToChange].currentCost = amount;
      console.log(this.investments[investmentToChange].currentCost);
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

    get returnSafeValues() {
      return _.cloneDeep(this.investments);
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
  Researcher: {
    upkeep: 1,
    finance: -1,
    culture: -1,
    government: 3,
    legacy: 3,
    science: 2,
  },
};

export {
  BaseInvestmentCosts, InvestmentProperties, InvestmentsModel,
};
