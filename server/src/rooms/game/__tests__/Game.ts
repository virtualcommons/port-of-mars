import {GameState, AccomplishmentSet, Player, Trade} from "@port-of-mars/server/rooms/game/state";
import {CURATOR, PIONEER, RESEARCHER, ENTREPRENEUR, TradeData, Role} from "shared/types";
import {getAccomplishmentByID, getAccomplishmentIDs} from "@port-of-mars/server/data/Accomplishment";
import * as _ from 'lodash'
import {mockGameInitOpts, mockGameStateInitOpts} from "@port-of-mars/server/util";
import {ConsolePersister} from "@port-of-mars/server/services/persistence";
import {Connection, createConnection} from "typeorm";
import shell from "shelljs";
import {tradeCanBeCompleted} from "shared/validation";


describe('a Researcher Player Accomplishment', () => {
  const repo = new AccomplishmentSet(RESEARCHER);
  const p = new Player(RESEARCHER);
  it('can be purchased if their role matches', () => {
    const accomplishment = getAccomplishmentByID(RESEARCHER, 1);
    p.purchaseAccomplishment(accomplishment);
    expect(p.inventory.science).toBe(-accomplishment.science);
    expect(p.victoryPoints).toBe(accomplishment.victoryPoints);
  });

  it('cannot be purchased if their roles do not match', () => {
    const accomplishment = getAccomplishmentByID(PIONEER, 21);
    const possibleAccomplishments = getAccomplishmentIDs(RESEARCHER);
    expect(possibleAccomplishments.includes(accomplishment.id)).toBe(false);
  });

  it('replenish returns correct amount of accomplishments', () => {
    p.refreshPurchasableAccomplishments();
    expect(p.accomplishments.purchasable.length).toBe(3);
  });

  it('screw cards handle contributed upkeep correctly', () => {  
    const grantFunkAccomplishment = getAccomplishmentByID(RESEARCHER,14); 
    expect(p.contributedUpkeep).toBe(0);
    p.purchaseAccomplishment(grantFunkAccomplishment);
    expect(p.contributedUpkeep).toBe(-6);
  });

  it('cards in hand are removed from the deck of possible cards', () =>{
    //from the beginning
    const id = p.accomplishments.purchasable[0].id;
    expect(p.accomplishments.deck.includes(id)).toBe(false);

    //after calling refreshPurchasableAccomplishments()
    p.purchaseAccomplishment(p.accomplishments.purchasable[0]);
    p.refreshPurchasableAccomplishments();
    for(const a of p.accomplishments.purchasable){
      expect(p.accomplishments.deck.includes(a.id)).toBe(false);
    }
  });

  it('purchasing cards removes them from purchasable', () => {
    expect(p.accomplishments.purchasable.length).toBe(3);
    p.purchaseAccomplishment(p.accomplishments.purchasable[0]);
    expect(p.accomplishments.purchasable.length).toBe(2);
  });

  it('trying to replenish after all cards are purchased is handled without error', () => {
    p.accomplishments.deck = [];
    const purchasableSize = p.accomplishments.purchasable.length;
    p.refreshPurchasableAccomplishments();
    expect(p.accomplishments.purchasable.length).toBe(purchasableSize);
  });

});

describe('a player snaphot', () => {
  const p1 = new Player(RESEARCHER);
  const p2 = new Player(CURATOR);
  it('can be round tripped', () => {
    p2.fromJSON(p1.toJSON());
    expect(_.isEqual(p1, p2)).toBeTruthy();
  });
});

describe('a game state snapshot', () => {

  it('can be round tripped', async () => {
    const options = mockGameStateInitOpts(x => x, () => 10);
    const g1 = new GameState(options);
    const g2 = new GameState(options);

    g2.fromJSON(g1.toJSON());
    expect(_.isEqual(g1, g2)).toBeTruthy();
    g2.maxRound = g1.maxRound + 1;
    expect(_.isEqual(g1, g2)).toBeFalsy()
  });
});

describe('a personal gain event', () => {
  const gameState = new GameState(mockGameStateInitOpts(x => x, () => 10));
  it('gets players who voted yes', () => {
    
  });

  // check upkeep 
  // votes associated with roles and timeblocks affecedl.
});

describe('trading validations', () => {
  const g = new GameState(mockGameStateInitOpts(x => x, () => 10));
  g.players['Curator'].inventory.update({
    finance:0,
    culture:3,
    science:0,
    legacy:0,
    government:0,
  });

  g.players['Entrepreneur'].inventory.update({
    finance:3,
    culture:1,
    science:0,
    legacy:0,
    government:0,
  });

  g.tradeSet['123'] = new Trade(
    {
    role: 'Curator',
    resourceAmount: {
      science: 0,
      government: 0,
      legacy: 0,
      finance: 0,
      culture: 3
    }
  },
  {
    role: 'Entrepreneur',
    resourceAmount: {
      science: 0,
      government: 0,
      legacy: 0,
      finance: 2,
      culture: 0
    }
  });

  g.tradeSet['456'] = new Trade(
    {
    role: 'Entrepreneur',
    resourceAmount: {
      science: 0,
      government: 0,
      legacy: 0,
      finance: 1,
      culture: 0
      }
    },
    {
    role: 'Curator',
    resourceAmount: {
      science: 0,
      government: 0,
      legacy: 0,
      finance: 0,
      culture: 3
    }
  });

  let t1:Trade = g.tradeSet['123'];
  let t2:Trade = g.tradeSet['456'];

  t2.apply(g);
  it('does not allow resource values below 0', () => {

    expect(tradeCanBeCompleted(g.players[g.tradeSet['123'].from.role as Role].inventory, g.tradeSet['123'].from.resourceAmount)).toBe(false);
  });

  it('does not send a notifcation to everyone', () => {
    g.players['Curator'].sendNotifcation('test');
    g.players['Curator'].sendNotifcation('notif 2');
    expect(g.players['Curator'].notifications.length).toBe(2);

    g.players['Curator'].deleteNotifcation(1);
    expect(g.players['Curator'].notifications.length).toBe(1);
    expect(g.players['Entrepreneur'].notifications.length).toBe(0);
  });
});


describe('inverting pending inventory', () => {
  const g = new GameState(mockGameStateInitOpts(x => x, () => 10));
  g.players['Curator'].inventory.update({
    finance:0,
    culture:3,
    science:0,
    legacy:0,
    government:0,
  });

  

  it('sets the pending investments to the inverted inventory while preserving the inventory', () => {
    g.players['Curator'].invertPendingInventory();
    expect(g.players['Curator'].pendingInvestments.culture).toBe(-3);
    expect(g.players['Curator'].inventory.culture).toBe(3);
  });
});