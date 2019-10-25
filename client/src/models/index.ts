interface InvestmentTypes {
  [key: string]: number;
  government: number;
  legacy: number;
  upkeep: number;
  finance: number;
  science: number;
  culture: number;
}

class InvestmentsModel {
  private investments: InvestmentTypes = {
    government: 0,
    legacy: 0,
    upkeep: 0,
    finance: 0,
    science: 0,
    culture: 0,
  };

  changeValue(investmentToChange: any, amount: number) {
    this.investments[investmentToChange] = amount;
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

export { InvestmentsModel, ChatModel, ChatMessage };
