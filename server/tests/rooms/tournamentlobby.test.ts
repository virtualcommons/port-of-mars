import { Client } from "colyseus";
import { mockColyseusClients } from "../common";
import { TournamentLobbyRoom } from "@port-of-mars/server/rooms/lobby/tournament";
import { TournamentLobbyRoomState } from "@port-of-mars/server/rooms/lobby/tournament/state";

import { settings } from "@port-of-mars/server/settings";
const logger = settings.logging.getLogger(__filename);

/**
 * Tests group formation and handling logic in the tournament lobby room.
 * lobby functions are mocked by calling GroupManager functions without the client/server
 * messaging or database calls
 */

describe("a tournament lobby room", () => {
  let room: TournamentLobbyRoom;
  let state: TournamentLobbyRoomState;

  beforeAll(() => {
    room = new TournamentLobbyRoom();
    state = new TournamentLobbyRoomState();
    room.setState(state);
  });

  afterAll(() => {
    // manually dispose of the room, otherwise it lingers  while it waits for the
    // auto-dispose timeout
    room._events.emit("dispose");
  });

  afterEach(() => {
    resetLobby();
  });

  function mockJoin(clients: Client[]) {
    clients.forEach(client => {
      room.state.addClient(client);
      room.afterJoin(client);
    });
  }

  function mockLeave(clients: Client[]) {
    clients.forEach(client => {
      room.state.removeClient(client.auth.username);
      room.afterLeave(client);
    });
  }

  function mockFormGroups() {
    room.groupManager.shuffleQueue();
    while (room.queue.length >= room.groupSize) {
      room.groupManager.formGroupFromQueue();
    }
  }

  function resetLobby() {
    room.state.clients.clear();
    room.groupManager.queue = [];
    room.groupManager.pendingGroups.clear();
    room.groupManager.clientToGroup.clear();
  }

  it("does nothing with an empty queue", () => {
    mockFormGroups();
    expect(room.groupManager.pendingGroups.size).toBe(0);
    expect(room.queue.length).toBe(0);
  });

  it("does not form a group with a single user in queue", () => {
    const singleClient = mockColyseusClients("paul", [1]);
    mockJoin(singleClient);
    mockFormGroups();
    expect(room.groupManager.pendingGroups.size).toBe(0);
    expect(room.queue.length).toBe(1);
  });

  it("forms an exact group with 5 users", () => {
    const clients = mockColyseusClients("anne", [1, 2, 3, 4, 5]);
    mockJoin(clients);
    mockFormGroups();
    expect(room.groupManager.pendingGroups.size).toBe(1);
    expect(room.queue.length).toBe(0);
    const group = Array.from(room.groupManager.pendingGroups.values())[0];
    const clientIds = group.clients.map(client => client.id);
    for (let i = 1; i <= 5; i++) {
      expect(clientIds.includes(i)).toBeTruthy();
    }
  });

  it("correctly handles clients joining and leaving between group formation intervals", () => {
    const clients1 = mockColyseusClients(
      "first",
      Array.from({ length: 13 }, (_, i) => i + 1)
    );
    mockJoin(clients1);
    expect(room.queue.length).toBe(13);
    mockFormGroups();
    expect(room.groupManager.pendingGroups.size).toBe(2);
    expect(room.queue.length).toBe(3);
    mockLeave([room.queue[0].client, room.queue[1].client]);
    expect(room.queue.length).toBe(1);

    const clients2 = mockColyseusClients("second", [14, 15, 16, 17, 18, 19]);
    mockJoin(clients2);
    mockFormGroups();
    expect(room.groupManager.pendingGroups.size).toBe(3);
    expect(room.queue.length).toBe(2);
  });

  it("forms groups from a large pool of newly joined clients", () => {
    const clients = mockColyseusClients(
      "player",
      Array.from({ length: 47 }, (_, i) => i + 1)
    );
    mockJoin(clients);
    mockFormGroups();
    expect(room.groupManager.pendingGroups.size).toBe(9);
    expect(room.queue.length).toBe(2);
    const groups = Array.from(room.groupManager.pendingGroups.values());
    for (let i = 0; i < 8; i++) {
      expect(groups[i].clients.length).toBe(5);
    }
    expect(room.queue.length).toBe(2);
  });

  it("shuffles the queue randomly when forming groups", () => {
    const clients = mockColyseusClients(
      "player",
      Array.from({ length: 20 }, (_, i) => i + 1)
    );
    const uniqueShuffleCombinations = new Set<string>();

    for (let i = 0; i < 50; i++) {
      mockJoin(clients);
      mockFormGroups();
      const group = Array.from(room.groupManager.pendingGroups.values())[0];
      const sortedGroupClientIds = group.clients
        .map(c => c.id)
        .sort((a, b) => a - b)
        .join(",");
      uniqueShuffleCombinations.add(sortedGroupClientIds);
      resetLobby();
    }

    expect(uniqueShuffleCombinations.size).toBeGreaterThan(1);
  });
});
