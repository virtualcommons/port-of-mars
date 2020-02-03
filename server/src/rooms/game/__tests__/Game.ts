import {GameState, AccomplishmentSet, Player} from "@/rooms/game/state";
import {CURATOR, PIONEER, RESEARCHER} from "shared/types";
import {getAccomplishmentByID, getAccomplishmentIDs} from "@/data/Accomplishment";
import * as _ from 'lodash'
import {mockGameInitOpts} from "@/util";
import {ConsolePersister} from "@/services/persistence";
import {Connection, createConnection} from "typeorm";
import shell from "shelljs";

describe('a Researcher Player Accomplishment', () => {
  const repo = new AccomplishmentSet(RESEARCHER);
  const p = new Player(RESEARCHER);
  it('can be bought if their role matches', () => {
    const accomplishment = getAccomplishmentByID(RESEARCHER, 1);
    p.buyAccomplishment(accomplishment);
    expect(p.inventory.science).toBe(-accomplishment.science);
    expect(p.victoryPoints).toBe(accomplishment.victoryPoints);
  });

  it('cannot be bought if their roles do not match', () => {
    const accomplishment = getAccomplishmentByID(PIONEER, 21);
    const possibleAccomplishments = getAccomplishmentIDs(RESEARCHER);
    expect(possibleAccomplishments.includes(accomplishment.id)).toBe(false);
  });

  it('replenish returns correct amount of accomplishments', () => {
    p.refreshPurchasableAccomplishments();
    expect(p.accomplishment.purchasable.length).toBe(3);
  });

  it('screw cards handle contributed upkeep correctly', () => {  
    const grantFunkAccomplishment = getAccomplishmentByID(RESEARCHER,14); 
    expect(p.contributedUpkeep).toBe(0);
    p.buyAccomplishment(grantFunkAccomplishment);
    expect(p.contributedUpkeep).toBe(-6);
  });

  it('cards in hand are removed from the deck of possible cards', () =>{
    //from the beginning
    const id = p.accomplishment.purchasable[0].id;
    expect(p.accomplishment.deck.includes(id)).toBe(false);

    //after calling refreshPurchasableAccomplishments()
    p.buyAccomplishment(p.accomplishment.purchasable[0]);
    p.refreshPurchasableAccomplishments();
    for(const a of p.accomplishment.purchasable){
      expect(p.accomplishment.deck.includes(a.id)).toBe(false);
    }
  });

  it('buying cards removes them from purchasable', () => {
    expect(p.accomplishment.purchasable.length).toBe(3);
    p.buyAccomplishment(p.accomplishment.purchasable[0]);
    expect(p.accomplishment.purchasable.length).toBe(2);
  });

  it('trying to replenish after all cards are bought is handled without error', () => {
    p.accomplishment.deck = [];
    const purchasableSize = p.accomplishment.purchasable.length;
    p.refreshPurchasableAccomplishments();
    expect(p.accomplishment.purchasable.length).toBe(purchasableSize);
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
  let conn !: Connection;

  beforeAll(async () => {
    shell.exec(`createdb -w -U marsmadness -h db pom_testing`);
    conn = await createConnection('test');
  });

  it('can be round tripped', async () => {
    const persister = new ConsolePersister();
    const userRoles = mockGameInitOpts(persister).userRoles;
    const g1 = new GameState(userRoles);
    const g2 = new GameState(userRoles);

    g2.fromJSON(g1.toJSON());
    expect(_.isEqual(g1, g2)).toBeTruthy();
    g2.maxRound = g1.maxRound + 1;
    expect(_.isEqual(g1, g2)).toBeFalsy()
  });

  afterAll(async () => {
    await conn.close()
  })
});

describe('a personal gain event', () => {
  const gameState = new GameState(mockGameInitOpts());
  it('gets players who voted yes', () => {
    
  });

  // check upkeep 
  // votes associated with roles and timeblocks affecedl.
})