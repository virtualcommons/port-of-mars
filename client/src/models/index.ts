interface InvestmentProperties {
  n: any;
  initialCost: number;
  currentCost: number;
  currentInventory: number;
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
    },
    legacy: {
      n: 'legacy',
      initialCost: 0,
      currentCost: 0,
      currentInventory: 0,
    },
    upkeep: {
      n: 'upkeep',
      initialCost: 0,
      currentCost: 0,
      currentInventory: 0,
    },
    finance: {
      n: 'finance',
      initialCost: 0,
      currentCost: 0,
      currentInventory: 0,
    },
    science: {
      n: 'science',
      initialCost: 0,
      currentCost: 0,
      currentInventory: 0,
    },
    culture: {
      n: 'culture',
      initialCost: 0,
      currentCost: 0,
      currentInventory: 0,
    },
  };

  changeInventoryValue(investmentToChange: any, amount: number) {
    this.investments[investmentToChange].currentInventory = amount;
  }

  get returnValues() {
    return this.investments;
  }
}

interface ChatMessage {
  sender: string;
  content: string;
}

class ChatModel {
  private messages: ChatMessage[];

  constructor() {
    this.messages = [];
  }

  addEntry(message: ChatMessage) {
    this.messages.push(message);
  }

  get chat() {
    return this.messages;
  }
}

export {
  InvestmentProperties, InvestmentsModel, ChatModel, ChatMessage,
};
