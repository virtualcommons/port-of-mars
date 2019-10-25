interface InvestmentTypes{
    [key:string]:number
    government:number,
    legacy:number,
    upkeep:number,
    finance:number,
    science:number,
    culture:number,
}

class InvestmentsModel {
    private investmets: InvestmentTypes = {
      government: 0,
      legacy: 0,
      upkeep: 0,
      finance: 0,
      science: 0,
      culture: 0,
    }

    changeValue(investmentToChange:any, amount:number) {
      this.investmets[investmentToChange] = amount;
    }

    get returnValues() {
      return this.investmets;
    }
}


class ChatMessage {
    private sender:string;

    private content:string;

    constructor() {
      this.sender = '';
      this.content = '';
    }
}

class ChatModel {
    private messages:ChatMessage[];

    constructor() {
      this.messages = [];
    }

    addEntry(message:ChatMessage) {
      this.messages.push(message);
    }
}

export {
  InvestmentsModel,
  ChatModel,
  ChatMessage,
};
